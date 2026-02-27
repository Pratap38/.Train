// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   TrainFront,
//   MapPin,
//   Clock,
//   Navigation,
//   Wifi,
//   ChevronLeft,
//   CircleCheck,
//   CircleDot
// } from "lucide-react";

// import TrainSimulation from "../components/TrainSimulation";
// import TrainMap from "../components/TrainMap";

// const BASE_URL = "http://127.0.0.1:8000/api";

// const TrainDetails = () => {
//   const { trainNumber } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [sim, setSim] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* ---------------- LOGIC REMAINS UNCHANGED ---------------- */
//   useEffect(() => {
//     const fetchTrain = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/trainsapi/${trainNumber}/`);
//         if (!res.ok) throw new Error("API failed");
//         const json = await res.json();
//         setData(json.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load train data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrain();
//   }, [trainNumber]);

//   const route = Array.isArray(data?.map_route) ? data.map_route : [];
//   const journey = data?.journey_timeline ?? {};

//   const currentStation =
//     sim
//       ? route?.[sim.segmentIndex]?.station
//       : journey.current ||
//         journey.completed?.[journey.completed.length - 1] ||
//         "Unknown";

//   const nextStation =
//     sim ? route?.[sim.segmentIndex + 1]?.station : "--";

//   useEffect(() => {
//     if (!sim || !data || !route.length) return;
//     const currentIndex = sim.segmentIndex;
//     const upcomingAlert = data.network_alerts?.find(alert => {
//       const alertIndex = route.findIndex(
//         s => s.station?.toUpperCase() === alert.station?.toUpperCase()
//       );
//       if (alertIndex === -1) return false;
//       return alertIndex - currentIndex === 1;
//     });

//     if (upcomingAlert) {
//       navigate(`/alert/${trainNumber}`, {
//         state: {
//           station: upcomingAlert.station,
//           severity: upcomingAlert.severity,
//           distanceKm: 3
//         }
//       });
//     }
//   }, [sim, data, route, navigate, trainNumber]);

//   /* ---------------- THEME STYLING ---------------- */
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FDB813] flex flex-col items-center justify-center">
//         <div className="bg-black p-6 border-4 border-black shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
//           <TrainFront className="w-14 h-14 text-[#FDB813] animate-bounce" />
//         </div>
//         <p className="mt-6 font-black uppercase tracking-widest text-black">
//           Locating Unit {trainNumber}
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#FDB813] flex items-center justify-center">
//         <div className="bg-white border-4 border-black p-8 font-black uppercase shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
//           System Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FDB813] font-sans pb-12">

//       {/* HERO SECTION */}
//       <div className="bg-black text-[#FDB813] pb-16 border-b-8 border-black">
//         <div className="max-w-6xl mx-auto px-6 pt-8">

//           <div className="flex justify-between items-center mb-10">
//             <Link to="/" className="p-3 bg-[#FDB813] border-2 border-black hover:bg-white transition-all shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]">
//               <ChevronLeft className="text-black" />
//             </Link>
//             <div className="flex items-center gap-2 bg-[#FDB813] px-4 py-1 border-2 border-black">
//               <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
//               <span className="text-black font-black text-[10px] uppercase">Telemetry Active</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
//             <div>
//               <h1 className="text-8xl font-black uppercase tracking-tighter leading-none">{trainNumber}</h1>
//               <p className="mt-4 flex items-center gap-3 text-xl font-bold uppercase">
//                 <MapPin className="w-6 h-6 text-[#FDB813]" />
//                 Current: <span className="underline decoration-4 underline-offset-4">{currentStation}</span>
//               </p>
//             </div>

//             <div className="flex gap-4 md:justify-end">
//               <GlassStat
//                 icon={<Clock className="text-black" />}
//                 label="ETA"
//                 value={sim ? `${Math.ceil(sim.eta)} MIN` : `${data.eta_minutes} MIN`}
//               />
//               <GlassStat
//                 icon={<Navigation className="text-black" />}
//                 label="DIST"
//                 value={sim ? `${sim.distance.toFixed(1)} KM` : `${data.distance_remaining_km.toFixed(1)} KM`}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAP BOX */}
//       <div className="max-w-6xl mx-auto px-6 -mt-10">
//         <div className="border-4 border-black shadow-[15px_15px_0_0_rgba(0,0,0,0.15)] bg-white overflow-hidden">
//           <TrainMap
//             lat={sim?.lat}
//             lon={sim?.lon}
//             currentStation={currentStation}
//             nextStation={nextStation}
//           />
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

//         {/* FULL ROUTE LIST */}
//         <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
//           <h2 className="text-2xl font-black uppercase mb-8 border-b-4 border-black pb-2 flex items-center gap-3">
//             <TrainFront className="w-6 h-6" />
//             Full Route Schedule
//           </h2>

//           {/* Scrollable container if the route is very long */}
//           <div className="relative border-l-4 border-black ml-4 pl-8 space-y-8 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-black">
//             {route.map((stop, index) => {
//               const isCurrent = index === sim?.segmentIndex;
//               const isPast = index < (sim?.segmentIndex ?? 0);
              
//               return (
//                 <div key={stop.stop_number} className="relative py-1">
//                   {/* Status Indicator Dots */}
//                   <div className={`absolute -left-[46px] top-0 w-8 h-8 border-4 border-black flex items-center justify-center transition-colors duration-300 ${
//                     isCurrent ? 'bg-[#FDB813] scale-110 shadow-[3px_3px_0_0_rgba(0,0,0,1)]' : 
//                     isPast ? 'bg-black' : 
//                     'bg-white'
//                   }`}>
//                     {isPast ? (
//                       <CircleCheck className="w-4 h-4 text-white" />
//                     ) : (
//                       <CircleDot className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-gray-300'}`} />
//                     )}
//                   </div>
                  
//                   <div className={`${isCurrent ? "translate-x-2" : ""} transition-transform duration-300`}>
//                     <p className={`text-xl font-black uppercase leading-none ${
//                       isCurrent ? "text-black" : 
//                       isPast ? "text-black/40" : 
//                       "text-black/20"
//                     }`}>
//                       {stop.station}
//                     </p>
//                     <div className="flex items-center gap-4 mt-1">
//                       <p className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? "text-black" : "text-gray-400"}`}>
//                         Stop #{stop.stop_number}
//                       </p>
//                       {isCurrent && (
//                         <span className="bg-black text-[#FDB813] text-[9px] px-2 py-0.5 font-black uppercase animate-pulse">
//                           Current Platform
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* NETWORK / SIDEBAR */}
//         <div className="space-y-8">
//           <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
//             <h2 className="text-lg font-black uppercase mb-6 flex items-center gap-2 border-b border-white/20 pb-4">
//               <Wifi className="w-5 h-5 text-[#FDB813]" />
//               Network Status
//             </h2>

//             {data.network_alerts?.length === 0 ? (
//               <p className="text-[#FDB813] font-bold text-xs uppercase tracking-widest">
//                 {">>"} All Signals Nominal
//               </p>
//             ) : (
//               data.network_alerts.map((a, i) => (
//                 <div key={i} className="mb-4 p-4 border-2 border-[#FDB813] bg-white/5">
//                   <p className="font-black uppercase text-sm">{a.station}</p>
//                   <p className="text-[10px] font-bold text-[#FDB813] uppercase mt-1">{a.severity}</p>
//                 </div>
//               ))
//             )}
//           </div>
          
//           {/* Decorative Technical Box */}
//           <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
//              <div className="flex items-center justify-between mb-2">
//                 <span className="text-[10px] font-black uppercase">System Logs</span>
//                 <div className="w-2 h-2 bg-green-500 rounded-full" />
//              </div>
//              <div className="space-y-1">
//                 <div className="h-1 bg-black w-full" />
//                 <div className="h-1 bg-black w-4/5" />
//                 <div className="h-1 bg-black w-3/4" />
//              </div>
//           </div>
//         </div>
//       </main>

//       {/* SIMULATION ENGINE */}
//       {route.length > 1 && (
//         <TrainSimulation
//           route={route}
//           etaMinutes={data.eta_minutes}
//           distanceKm={data.distance_remaining_km}
//           onUpdate={setSim}
//         />
//       )}
//     </div>
//   );
// };

// /* STAT CARD COMPONENT */
// const GlassStat = ({ icon, label, value }) => (
//   <div className="bg-[#FDB813] border-4 border-black p-5 shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] min-w-[140px]">
//     <div className="mb-3 bg-black w-fit p-1">{icon && <div className="text-[#FDB813]">{icon}</div>}</div>
//     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">{label}</p>
//     <p className="text-2xl font-black text-black uppercase">{value}</p>
//   </div>
// );

// export default TrainDetails;



import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  TrainFront,
  MapPin,
  Clock,
  Navigation,
  Wifi,
  ChevronLeft,
  CircleCheck,
  CircleDot
} from "lucide-react";

import TrainSimulation from "../components/TrainSimulation";
import TrainMap from "../components/TrainMap";

const BASE_URL = "http://127.0.0.1:8000/api";

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- LOGIC REMAINS UNCHANGED ---------------- */
  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const res = await fetch(`${BASE_URL}/trainsapi/${trainNumber}/`);
        if (!res.ok) throw new Error("API failed");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load train data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrain();
  }, [trainNumber]);

  const route = Array.isArray(data?.map_route) ? data.map_route : [];
  const journey = data?.journey_timeline ?? {};

  const currentStation =
    sim
      ? route?.[sim.segmentIndex]?.station
      : journey.current ||
        journey.completed?.[journey.completed.length - 1] ||
        "Unknown";

  const nextStation =
    sim ? route?.[sim.segmentIndex + 1]?.station : "--";

  useEffect(() => {
    if (!sim || !data || !route.length) return;
    const currentIndex = sim.segmentIndex;
    const upcomingAlert = data.network_alerts?.find(alert => {
      const alertIndex = route.findIndex(
        s => s.station?.toUpperCase() === alert.station?.toUpperCase()
      );
      if (alertIndex === -1) return false;
      return alertIndex - currentIndex === 1;
    });

    if (upcomingAlert) {
      navigate(`/alert/${trainNumber}`, {
        state: {
          station: upcomingAlert.station,
          severity: upcomingAlert.severity,
          distanceKm: 3
        }
      });
    }
  }, [sim, data, route, navigate, trainNumber]);

  /* ---------------- UPDATED THEME STYLING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center">
        <div className="bg-[#0A1628] p-6 rounded-2xl shadow-2xl">
          <TrainFront className="w-14 h-14 text-white animate-bounce" />
        </div>
        <p className="mt-6 font-black uppercase tracking-widest text-[#0A1628]">
          Locating Unit {trainNumber}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="bg-white border-2 border-[#0A1628]/20 rounded-2xl p-8 font-black uppercase shadow-xl text-[#0A1628]">
          System Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-sans pb-12">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1a2c48] text-white pb-16 border-b border-[#0A1628]/10">
        <div className="max-w-6xl mx-auto px-6 pt-8">

          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">
              <ChevronLeft className="text-white" />
            </Link>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-bold text-xs uppercase tracking-wide">Telemetry Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {trainNumber}
              </h1>
              <p className="mt-4 flex items-center gap-3 text-xl font-semibold">
                <MapPin className="w-6 h-6 text-white/80" />
                Current: <span className="font-bold text-white">{currentStation}</span>
              </p>
            </div>

            <div className="flex gap-4 md:justify-end">
              <GlassStat
                icon={<Clock className="text-[#0A1628]" />}
                label="ETA"
                value={sim ? `${Math.ceil(sim.eta)} MIN` : `${data.eta_minutes} MIN`}
              />
              <GlassStat
                icon={<Navigation className="text-[#0A1628]" />}
                label="DIST"
                value={sim ? `${sim.distance.toFixed(1)} KM` : `${data.distance_remaining_km.toFixed(1)} KM`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAP BOX */}
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white border border-[#0A1628]/10">
          <TrainMap
            lat={sim?.lat}
            lon={sim?.lon}
            currentStation={currentStation}
            nextStation={nextStation}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* FULL ROUTE LIST */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-[#0A1628]/10 p-8">
          <h2 className="text-2xl font-black uppercase mb-8 text-[#0A1628] border-b-2 border-[#0A1628]/10 pb-4 flex items-center gap-3">
            <TrainFront className="w-6 h-6 text-[#0A1628]" />
            Full Route Schedule
          </h2>

          {/* Scrollable container if the route is very long */}
          <div className="relative border-l-4 border-[#0A1628]/20 ml-4 pl-8 space-y-8 max-h-[600px] overflow-y-auto pr-4">
            {route.map((stop, index) => {
              const isCurrent = index === sim?.segmentIndex;
              const isPast = index < (sim?.segmentIndex ?? 0);
              
              return (
                <div key={stop.stop_number} className="relative py-1">
                  {/* Status Indicator Dots */}
                  <div className={`absolute -left-[46px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCurrent ? 'bg-[#0A1628] border-[#0A1628] scale-110 shadow-lg' : 
                    isPast ? 'bg-[#0A1628] border-[#0A1628]' : 
                    'bg-white border-[#0A1628]/30'
                  }`}>
                    {isPast ? (
                      <CircleCheck className="w-4 h-4 text-white" />
                    ) : (
                      <CircleDot className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-[#0A1628]/30'}`} />
                    )}
                  </div>
                  
                  <div className={`${isCurrent ? "translate-x-2" : ""} transition-transform duration-300`}>
                    <p className={`text-xl font-bold uppercase leading-none ${
                      isCurrent ? "text-[#0A1628]" : 
                      isPast ? "text-[#0A1628]/40" : 
                      "text-[#0A1628]/20"
                    }`}>
                      {stop.station}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className={`text-xs font-medium uppercase tracking-wide ${
                        isCurrent ? "text-[#0A1628]/80" : "text-[#0A1628]/40"
                      }`}>
                        Stop #{stop.stop_number}
                      </p>
                      {isCurrent && (
                        <span className="bg-gradient-to-r from-[#0A1628] to-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase animate-pulse">
                          Current Platform
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NETWORK / SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-[#0A1628] text-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <Wifi className="w-5 h-5 text-white" />
              Network Status
            </h2>

            {data.network_alerts?.length === 0 ? (
              <p className="text-green-400 font-semibold text-sm">
                ✓ All Signals Nominal
              </p>
            ) : (
              data.network_alerts.map((a, i) => (
                <div key={i} className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="font-semibold uppercase text-sm">{a.station}</p>
                  <p className="text-xs font-medium text-yellow-400 uppercase mt-1">{a.severity}</p>
                </div>
              ))
            )}
          </div>
          
          {/* Decorative Technical Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#0A1628]/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase text-[#0A1628]">System Logs</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-[#0A1628]/10 rounded-full w-full" />
              <div className="h-2 bg-[#0A1628]/10 rounded-full w-4/5" />
              <div className="h-2 bg-[#0A1628]/10 rounded-full w-3/4" />
            </div>
          </div>
        </div>
      </main>

      {/* SIMULATION ENGINE */}
      {route.length > 1 && (
        <TrainSimulation
          route={route}
          etaMinutes={data.eta_minutes}
          distanceKm={data.distance_remaining_km}
          onUpdate={setSim}
        />
      )}
    </div>
  );
};

/* STAT CARD COMPONENT - Updated */
const GlassStat = ({ icon, label, value }) => (
  <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl p-5 shadow-lg min-w-[140px]">
    <div className="mb-3 bg-white rounded-lg p-2 w-fit shadow-sm">
      {icon && <div>{icon}</div>}
    </div>
    <p className="text-xs font-semibold uppercase text-[#0A1628]/60 tracking-wide">{label}</p>
    <p className="text-2xl font-black text-[#0A1628] uppercase">{value}</p>
  </div>
);

export default TrainDetails;