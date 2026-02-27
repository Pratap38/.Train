import { useEffect, useRef } from "react";

const UPDATE_INTERVAL = 1000; // 1s
const HALT_TIME = 20000;      // 20s
const STORAGE_KEY = "train-sim-state";

const TrainSimulation = ({
  route = [],
  etaMinutes = 0,
  distanceKm = 0,
  onUpdate
}) => {
  const intervalRef = useRef(null);

  // 🔁 Persistent simulation state
  const simRef = useRef({
    segmentIndex: 0,
    progress: 0,
    eta: etaMinutes,
    distance: distanceKm,
    lastTick: Date.now()
  });

  useEffect(() => {
    if (!Array.isArray(route) || route.length < 2) return;

    // 🔹 LOAD SAVED STATE (if exists)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        simRef.current = JSON.parse(saved);
      } catch {
        simRef.current = {
          segmentIndex: 0,
          progress: 0,
          eta: etaMinutes,
          distance: distanceKm,
          lastTick: Date.now()
        };
      }
    }

    const tick = () => {
      const sim = simRef.current;
      const now = Date.now();

      // ⏱ compensate time gap
      const elapsedSec = (now - sim.lastTick) / 1000;
      sim.lastTick = now;

      const i = sim.segmentIndex;

      /* =====================================================
         🛑 FINAL STATION → HALT → RESTART JOURNEY
      ===================================================== */
      if (i >= route.length - 1) {
        const last = route[route.length - 1];
        if (!last?.latitude || !last?.longitude) return;

        // Final update at destination
        onUpdate({
          lat: last.latitude,
          lon: last.longitude,
          segmentIndex: route.length - 1,
          eta: 0,
          distance: 0
        });

        clearInterval(intervalRef.current);

        // ⏸ wait, then restart from beginning
        setTimeout(() => {
          simRef.current = {
            segmentIndex: 0,
            progress: 0,
            eta: etaMinutes,
            distance: distanceKm,
            lastTick: Date.now()
          };

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(simRef.current)
          );

          intervalRef.current = setInterval(tick, UPDATE_INTERVAL);
        }, HALT_TIME);

        return;
      }

      const curr = route[i];
      const next = route[i + 1];

      if (
        !curr ||
        !next ||
        typeof curr.latitude !== "number" ||
        typeof curr.longitude !== "number" ||
        typeof next.latitude !== "number" ||
        typeof next.longitude !== "number"
      ) {
        return;
      }

      // 🚆 MOVE TRAIN (time-based)
      const progressDelta = elapsedSec / 50; // ~50s per segment
      sim.progress += progressDelta;
      if (sim.progress > 1) sim.progress = 1;

      const lat =
        curr.latitude +
        (next.latitude - curr.latitude) * sim.progress;
      const lon =
        curr.longitude +
        (next.longitude - curr.longitude) * sim.progress;

      sim.eta = Math.max(0, sim.eta - elapsedSec / 60);
      sim.distance = Math.max(0, sim.distance - elapsedSec * 0.03);

      onUpdate({
        lat,
        lon,
        segmentIndex: i,
        eta: sim.eta,
        distance: sim.distance
      });

      // 🚉 ARRIVED AT NEXT STATION
      if (sim.progress >= 1) {
        sim.progress = 0;
        sim.segmentIndex += 1;

        clearInterval(intervalRef.current);
        setTimeout(() => {
          sim.lastTick = Date.now();
          intervalRef.current = setInterval(tick, UPDATE_INTERVAL);
        }, HALT_TIME);
      }

      // 💾 SAVE STATE EVERY TICK
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sim));
    };

    intervalRef.current = setInterval(tick, UPDATE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [route, etaMinutes, distanceKm, onUpdate]);

  return null;
};

export default TrainSimulation;
