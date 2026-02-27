// import { useParams, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { AlertTriangle, Download, CheckCircle } from "lucide-react";

// const BASE_URL = "http://127.0.0.1:8000/api";

// const OfflinePage = () => {
//   const { trainNumber } = useParams();

//   const [data, setData] = useState(null);
//   const [cached, setCached] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   /* ---------- FETCH OFFLINE PACKAGE ---------- */
//   useEffect(() => {
//     const fetchOfflinePackage = async () => {
//       try {
//         const res = await fetch(
//           `${BASE_URL}/train/${trainNumber}/offline-package`
//         );

//         if (!res.ok) throw new Error("API failed");

//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//       }
//     };

//     fetchOfflinePackage();
//   }, [trainNumber]);

//   /* ---------- LOADING ---------- */
//   if (!data && !error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-slate-600 font-semibold">
//         Preparing offline package…
//       </div>
//     );
//   }

//   /* ---------- ERROR ---------- */
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
//         Failed to prepare offline data
//       </div>
//     );
//   }

//   /* ---------- NORMALIZE BACKEND DATA ---------- */
//   const pkg = data.offline_package || {};
//   const stations = pkg.station || [];
//   const alerts = pkg.network_alerts || [];
//   const validity = pkg.validMin || 1;

//   /* ---------- CACHE SIMULATION ---------- */
//   const handleCache = () => {
//     setLoading(true);

//     setTimeout(() => {
//       localStorage.setItem(
//         `offline-train-${trainNumber}`,
//         JSON.stringify({
//           cachedAt: Date.now(),
//           offline_package: pkg
//         })
//       );

//       // 🔑 mark this alert as dismissed
//       if (alerts.length > 0) {
//         localStorage.setItem(
//           `offline-alert-dismissed-${trainNumber}`,
//           alerts[0].station
//         );
//       }

//       setCached(true);
//       setLoading(false);
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-6 flex justify-center">
//       <div className="w-full max-w-3xl space-y-6">

//         {/* WARNING BANNER */}
//         <div className="bg-red-100 border-l-4 border-red-500 p-5 rounded-xl flex gap-3">
//           <AlertTriangle className="text-red-600 mt-1" />
//           <div>
//             <p className="font-bold text-red-700 text-lg">
//               Network loss ahead
//             </p>
//             <p className="text-sm text-red-600">
//               Offline mode recommended for uninterrupted tracking
//             </p>
//           </div>
//         </div>

//         {/* OFFLINE PACKAGE DETAILS */}
//         <div className="bg-white rounded-2xl shadow p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Offline Package Contents
//           </h2>

//           <ul className="space-y-3 text-sm text-slate-700">
//             <li>⏱ Validity: ~{validity} mins</li>
//             <li>🚉 Stations cached: {stations.length}</li>
//             <li>🛤 Full route & station order</li>
//             <li>⚠ Network blackout alerts</li>
//             <li>📍 Current & next stations</li>
//             <li>⏳ ETA & delays</li>
//           </ul>

//           {/* STATIONS LIST */}
//           <div className="mt-5">
//             <p className="font-semibold text-sm mb-2 text-slate-700">
//               Cached Stations
//             </p>
//             <div className="max-h-40 overflow-y-auto rounded-lg border p-3 space-y-2 text-sm">
//               {stations.map((s, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between text-slate-600"
//                 >
//                   <span>🚉 {s.name}</span>
//                   <span className="text-xs text-slate-400">
//                     ETA {s.eta_min} min
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-4 text-sm text-slate-600">
//             ⚠ Alerts cached:{" "}
//             <span className="font-bold">{alerts.length}</span>
//           </div>
//         </div>

//         {/* ACTION BUTTON */}
//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           {!cached ? (
//             <button
//               onClick={handleCache}
//               disabled={loading}
//               className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold tracking-wide flex items-center justify-center gap-3 hover:bg-slate-800 transition"
//             >
//               {loading ? (
//                 "Preparing Offline Data..."
//               ) : (
//                 <>
//                   <Download />
//                   Prepare Offline Package
//                 </>
//               )}
//             </button>
//           ) : (
//             <div className="flex flex-col items-center gap-3">
//               <CheckCircle className="text-green-600 w-10 h-10" />
//               <p className="font-bold text-green-700">
//                 Offline Ready
//               </p>
//               <p className="text-sm text-slate-500">
//                 Data cached safely on this device
//               </p>
//               <Link
//                 to={`/train/${trainNumber}`}
//                 className="mt-3 text-blue-600 font-semibold"
//               >
//                 Back to Live View
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OfflinePage;



import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  Download, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  Database,
  Clock,
  MapPin,
  Train,
  ChevronRight
} from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/api";

const OfflinePage = () => {
  const { trainNumber } = useParams();

  const [data, setData] = useState(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ---------- FETCH OFFLINE PACKAGE ---------- */
  useEffect(() => {
    const fetchOfflinePackage = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/train/${trainNumber}/offline-package`
        );

        if (!res.ok) throw new Error("API failed");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchOfflinePackage();
  }, [trainNumber]);

  /* ---------- LOADING STATE ---------- */
  if (!data && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#0A1628]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#0A1628] rounded-full animate-spin"></div>
            <Database className="absolute inset-0 m-auto w-8 h-8 text-[#0A1628]" />
          </div>
          <p className="text-[#0A1628] font-semibold animate-pulse">
            Preparing offline package…
          </p>
        </div>
      </div>
    );
  }

  /* ---------- ERROR STATE ---------- */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-[#0A1628] font-bold text-xl mb-2">
            Connection Failed
          </p>
          <p className="text-[#0A1628]/60 text-sm">
            Unable to prepare offline data. Please check your connection.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- NORMALIZE BACKEND DATA ---------- */
  const pkg = data.offline_package || {};
  const stations = pkg.station || [];
  const alerts = pkg.network_alerts || [];
  const validity = pkg.validMin || 1;

  /* ---------- CACHE SIMULATION ---------- */
  const handleCache = () => {
    setLoading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      localStorage.setItem(
        `offline-train-${trainNumber}`,
        JSON.stringify({
          cachedAt: Date.now(),
          offline_package: pkg
        })
      );

      if (alerts.length > 0) {
        localStorage.setItem(
          `offline-alert-dismissed-${trainNumber}`,
          alerts[0].station
        );
      }

      setCached(true);
      setLoading(false);
      setProgress(100);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6 animate-fade-in">

        {/* WARNING BANNER - Animated */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-bounce-slow">
                <WifiOff className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div>
              <p className="font-bold text-[#0A1628] text-lg mb-1">
                Network Loss Detected Ahead
              </p>
              <p className="text-[#0A1628]/70 text-sm">
                Download offline package to continue tracking without interruption
              </p>
            </div>
          </div>
        </div>

        {/* OFFLINE PACKAGE DETAILS - Enhanced Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#0A1628]/5 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A1628] to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Database className="w-6 h-6" />
                Offline Package Contents
              </h2>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                Train #{trainNumber}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0A1628]/5 rounded-xl p-4 hover:bg-[#0A1628]/10 transition-colors">
                <Clock className="w-5 h-5 text-[#0A1628] mb-2" />
                <p className="text-[#0A1628] font-semibold">Validity</p>
                <p className="text-[#0A1628]/60 text-sm">~{validity} minutes</p>
              </div>
              
              <div className="bg-[#0A1628]/5 rounded-xl p-4 hover:bg-[#0A1628]/10 transition-colors">
                <MapPin className="w-5 h-5 text-[#0A1628] mb-2" />
                <p className="text-[#0A1628] font-semibold">Stations</p>
                <p className="text-[#0A1628]/60 text-sm">{stations.length} cached</p>
              </div>
              
              <div className="bg-[#0A1628]/5 rounded-xl p-4 hover:bg-[#0A1628]/10 transition-colors">
                <AlertTriangle className="w-5 h-5 text-[#0A1628] mb-2" />
                <p className="text-[#0A1628] font-semibold">Alerts</p>
                <p className="text-[#0A1628]/60 text-sm">{alerts.length} warnings</p>
              </div>
              
              <div className="bg-[#0A1628]/5 rounded-xl p-4 hover:bg-[#0A1628]/10 transition-colors">
                <Train className="w-5 h-5 text-[#0A1628] mb-2" />
                <p className="text-[#0A1628] font-semibold">Route Data</p>
                <p className="text-[#0A1628]/60 text-sm">Complete</p>
              </div>
            </div>

            {/* Stations List - Animated */}
            <div className="border-t border-[#0A1628]/10 pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-[#0A1628]">Route Stations</p>
                <span className="text-xs text-[#0A1628]/50 bg-[#0A1628]/5 px-2 py-1 rounded-full">
                  Scroll to view all
                </span>
              </div>
              
              <div className="max-h-48 overflow-y-auto rounded-xl border border-[#0A1628]/10 bg-gray-50 p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#0A1628]/20">
                {stations.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0A1628]/10 rounded-full flex items-center justify-center text-[#0A1628] font-semibold text-sm">
                        {i + 1}
                      </div>
                      <span className="text-[#0A1628] font-medium">{s.name}</span>
                    </div>
                    <span className="text-xs text-[#0A1628]/50 bg-[#0A1628]/5 px-2 py-1 rounded">
                      ETA {s.eta_min} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON - Enhanced with animations */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#0A1628]/5 p-6">
          {!cached ? (
            <div>
              {loading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-[#0A1628]/60 mb-2">
                    <span>Downloading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-[#0A1628]/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#0A1628] to-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={handleCache}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0A1628] to-blue-600 text-white font-bold tracking-wide flex items-center justify-center gap-3 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing Offline Data...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 animate-bounce-slow" />
                    Download Offline Package
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-up">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="font-bold text-[#0A1628] text-xl mb-2">
                Offline Ready!
              </p>
              <p className="text-[#0A1628]/60 text-sm mb-6">
                Data cached successfully on this device
              </p>
              <Link
                to={`/train/${trainNumber}`}
                className="inline-flex items-center gap-2 text-[#0A1628] font-semibold hover:gap-3 transition-all duration-300"
              >
                Back to Live View
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-up {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-up {
          animation: scale-up 0.5s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OfflinePage;