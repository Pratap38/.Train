import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import loaderVideo from "/assets/train.mp4";

/* ---------------- CONSTANTS ---------------- */
const UPDATE_INTERVAL = 1000; // 1s refresh rate
const HALT_TIME = 20000;      // 20s stop at stations
const STORAGE_KEY = "train-sim-state";
const TRAIN_IMAGE_URL = "https://cdn-icons-png.flaticon.com/512/325/325297.png"; // Top-down train view

/* ---------------- FIX DEFAULT ICONS ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* ---------------- MATH HELPERS ---------------- */
// Calculates the angle (bearing) between two points so the train faces the right way
const getBearing = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLon = toRad(lng2 - lng1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  let brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360; // Normalize to 0-360
};

/* ---------------- ICONS ---------------- */
// Dynamic Icon Generator to handle Rotation
const createTrainIcon = (rotation) =>
  new L.DivIcon({
    className: "train-marker-container",
    html: `
      <div style="
        transform: rotate(${rotation}deg);
        transition: transform 0.5s linear;
        width: 40px; height: 40px;
        display: flex; justify-content: center; align-items: center;
      ">
        <img src="${TRAIN_IMAGE_URL}" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));" />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Center the rotation point
    popupAnchor: [0, -20]
  });

const stationIcon = (color) =>
  new L.DivIcon({
    className: "",
    html: `<div style="
      width:12px; height:12px; background:${color}; border-radius:50%;
      border:2px solid white; box-shadow:0 0 0 4px ${color}33;">
    </div>`
  });

/* ---------------- HELPER: SMOOTH TRAIN MOVEMENT & ROTATION ---------------- */
const AnimatedMarker = ({ position }) => {
  const [renderPos, setRenderPos] = useState(position);
  const [rotation, setRotation] = useState(0);
  
  const startPosRef = useRef(position);
  const targetPosRef = useRef(position);
  const startTimeRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    // 1. Calculate Rotation (Bearing) whenever target changes
    if (startPosRef.current[0] !== position[0] || startPosRef.current[1] !== position[1]) {
        const newBearing = getBearing(
            startPosRef.current[0], startPosRef.current[1], 
            position[0], position[1]
        );
        // Only update rotation if moving a significant distance to prevent jitter
        if (!isNaN(newBearing)) {
            setRotation(newBearing);
        }
    }

    startPosRef.current = renderPos;
    targetPosRef.current = position;
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / UPDATE_INTERVAL, 1);

      // Linear Interpolation
      const lat = startPosRef.current[0] + (targetPosRef.current[0] - startPosRef.current[0]) * progress;
      const lng = startPosRef.current[1] + (targetPosRef.current[1] - startPosRef.current[1]) * progress;

      setRenderPos([lat, lng]);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position[0], position[1]]); // Trigger on new coordinates

  // Create icon with current rotation
  const icon = useMemo(() => createTrainIcon(rotation), [rotation]);

  return <Marker position={renderPos} icon={icon} zIndexOffset={1000} />;
};

/* ---------------- HELPER: AUTO-FOLLOW CAMERA ---------------- */
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
};

/* ---------------- MAIN COMPONENT ---------------- */
const BiggerMap = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  
  const [apiData, setApiData] = useState(null);
  
  const [simState, setSimState] = useState({
    lat: null,
    lon: null,
    segmentIndex: 0,
    eta: 0,
    distance: 0
  });

  const intervalRef = useRef(null);
  const simRef = useRef({
    segmentIndex: 0,
    progress: 0,
    eta: 0,
    distance: 0,
    lastTick: Date.now()
  });

  // 1. Fetch Data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/trainsapi/${trainNumber}/`);
        const json = await res.json();
        setApiData(json.data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    load();
  }, [trainNumber]);

  // 2. Simulation Logic
  useEffect(() => {
    if (!apiData) return;

    const route = apiData.map_route.filter(s => s.latitude && s.longitude);
    if (route.length < 2) return;

    // Load saved state or init
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        simRef.current = JSON.parse(saved);
      } catch {
        simRef.current = {
            segmentIndex: 0, progress: 0, 
            eta: apiData.eta_minutes, distance: apiData.distance_remaining_km, 
            lastTick: Date.now()
        };
      }
    } else {
        simRef.current = {
            segmentIndex: 0, progress: 0, 
            eta: apiData.eta_minutes, distance: apiData.distance_remaining_km, 
            lastTick: Date.now()
        };
    }

    const tick = () => {
      const sim = simRef.current;
      const now = Date.now();
      const elapsedSec = (now - sim.lastTick) / 1000;
      sim.lastTick = now;

      const i = sim.segmentIndex;

      // Final Station
      if (i >= route.length - 1) {
        const last = route[route.length - 1];
        setSimState({
          lat: last.latitude,
          lon: last.longitude,
          segmentIndex: route.length - 1,
          eta: 0,
          distance: 0
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sim));
        clearInterval(intervalRef.current);
        return;
      }

      const curr = route[i];
      const next = route[i + 1];

      // Move Train (Speed factor: 50s per segment)
      const progressDelta = elapsedSec / 50; 
      sim.progress += progressDelta;
      if (sim.progress > 1) sim.progress = 1;

      const lat = curr.latitude + (next.latitude - curr.latitude) * sim.progress;
      const lon = curr.longitude + (next.longitude - curr.longitude) * sim.progress;

      sim.eta = Math.max(0, sim.eta - elapsedSec / 60);
      sim.distance = Math.max(0, sim.distance - elapsedSec * 0.03);

      setSimState({
        lat,
        lon,
        segmentIndex: i,
        eta: sim.eta,
        distance: sim.distance
      });

      // Arrived at next station
      if (sim.progress >= 1) {
        sim.progress = 0;
        sim.segmentIndex += 1;
        clearInterval(intervalRef.current);
        setTimeout(() => {
          sim.lastTick = Date.now();
          intervalRef.current = setInterval(tick, UPDATE_INTERVAL);
        }, HALT_TIME);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sim));
    };

    intervalRef.current = setInterval(tick, UPDATE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [apiData]);
if (!apiData)
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900">
      <video
        src=" "
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <p className="absolute bottom-10 text-white text-lg font-semibold">
        Loading Route...
      </p>
    </div>
  );


  const fullRoute = apiData.map_route.filter(s => s.latitude && s.longitude);
  const polylineCoords = fullRoute.map(s => [s.latitude, s.longitude]);

  // Initial display coordinates
  const displayLat = simState.lat || fullRoute[0].latitude;
  const displayLng = simState.lon || fullRoute[0].longitude;

  return (
    <div className="fixed inset-0 z-50 bg-white" dir="rtl">
      
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-[1000] bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition"
      >✕</button>

      <MapContainer
        center={[displayLat, displayLng]}
        zoom={14} // Zoomed in closer to see the train image better
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={displayLat} lng={displayLng} />

        <Polyline positions={polylineCoords} color="#2563eb" weight={6} opacity={0.6} />

        {/* Stations */}
        {fullRoute.map((st, index) => {
          let color = "#3b82f6"; // Blue
          if (index < simState.segmentIndex) color = "#ef4444"; // Red
          if (index === simState.segmentIndex) color = "#ec4899"; // Pink

          return (
            <Marker
              key={st.stop_number}
              position={[st.latitude, st.longitude]}
              icon={stationIcon(color)}
            >
              <Popup><b>{st.station}</b><br />#{st.stop_number}</Popup>
            </Marker>
          );
        })}

        {/* 🚆 MOVING TRAIN WITH IMAGE */}
        {displayLat && displayLng && (
          <AnimatedMarker position={[displayLat, displayLng]} />
        )}

        {/* Network Alerts */}
        {apiData.network_alerts.map((z, i) => (
          <Circle
            key={i}
            center={[z.latitude, z.longitude]}
            radius={z.coverage_gap_m}
            pathOptions={{
              color: z.severity === "HIGH" ? "red" : "orange",
              fillOpacity: 0.1
            }}
          />
        ))}
      </MapContainer>

      {/* Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-5px_10px_rgba(0,0,0,0.1)] text-sm z-[1000] flex justify-around border-t">
        <span>🚆 <b>{apiData.train_name}</b></span>
        <span>ETA: <b>{Math.ceil(simState.eta)} min</b></span>
        <span>Dist: <b>{Math.max(0, simState.distance).toFixed(1)} km</b></span>
      </div>
    </div>
  );
};

export default BiggerMap;