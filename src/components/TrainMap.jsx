// import { useNavigate, useParams } from "react-router-dom";
// import { Crosshair, Map as MapIcon, Maximize2 } from "lucide-react";

// const TrainMap = ({ lat, lon, currentStation, nextStation }) => {
//   const navigate = useNavigate();
//   const { trainNumber } = useParams();

//   return (
//     <div
//       onClick={() => navigate(`/map/${trainNumber}`)}
//       className="bg-[#FDB813] h-80 w-full flex relative overflow-hidden cursor-pointer group border-black"
//     >
//       {/* 1. ISOMETRIC GRID BACKGROUND */}
//       <div className="absolute inset-0 opacity-15 bg-[linear-gradient(30deg,#000_12%,transparent_12.5%,transparent_87%,#000_87.5%,#000),linear-gradient(150deg,#000_12%,transparent_12.5%,transparent_87%,#000_87.5%,#000)] bg-[size:60px_100px]" />

//       {/* 2. RADAR SECTION (Left Side) */}
//       <div className="hidden md:flex w-1/3 border-r-4 border-black items-center justify-center relative bg-black/5">
//         <div className="relative w-40 h-40 border-2 border-black rounded-full flex items-center justify-center">
//           {/* Animated Radar Rings */}
//           <div className="absolute inset-0 border border-black rounded-full animate-ping opacity-20" />
//           <div className="absolute w-24 h-24 border border-black/30 rounded-full" />
          
//           {/* The "Train" Marker */}
//           <div className="relative z-10 text-4xl group-hover:scale-125 transition-transform duration-500">
//             🚆
//           </div>
          
//           {/* Crosshair Overlay */}
//           <Crosshair className="absolute w-full h-full text-black/10 p-4" />
//         </div>
//         <div className="absolute bottom-4 left-4 font-mono text-[9px] font-bold uppercase">
//           Tracking_Signal: Active
//         </div>
//       </div>

//       {/* 3. DATA SECTION (Right Side / Main) */}
//       <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 relative z-10">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="h-4 w-1 bg-black" />
//           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">
//             Terminal Connection
//           </span>
//         </div>

//         <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight text-black">
//           {currentStation}
//           <br />
//           <span className="text-2xl text-black/40">TO</span> {nextStation}
//         </h2>

//         {/* Coordinate Strip */}
//         <div className="mt-6 flex flex-wrap gap-4">
//           <div className="bg-black text-[#FDB813] px-3 py-1 font-mono text-xs font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
//             LAT: {lat?.toFixed(4)}
//           </div>
//           <div className="bg-black text-[#FDB813] px-3 py-1 font-mono text-xs font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
//             LON: {lon?.toFixed(4)}
//           </div>
//         </div>

//         {/* Bottom CTA */}
//         <div className="absolute bottom-6 right-6 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
//           <span className="text-[10px] font-black uppercase tracking-widest">Expand Map</span>
//           <div className="bg-black p-1">
//             <Maximize2 className="w-4 h-4 text-[#FDB813]" />
//           </div>
//         </div>
//       </div>

//       {/* 4. SCANLINE EFFECT */}
//       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%]" />
//     </div>
//   );
// };

// export default TrainMap;

import { useNavigate, useParams } from "react-router-dom";
import { Crosshair, Map as MapIcon, Maximize2, Navigation, Radio } from "lucide-react";

const TrainMap = ({ lat, lon, currentStation, nextStation }) => {
  const navigate = useNavigate();
  const { trainNumber } = useParams();

  return (
    <div
      onClick={() => navigate(`/map/${trainNumber}`)}
      className="bg-gradient-to-br from-white to-gray-50 h-80 w-full flex relative overflow-hidden cursor-pointer group transition-all duration-500 hover:shadow-2xl"
    >
      {/* 1. ANIMATED GRID BACKGROUND */}
      <div className="absolute inset-0">
        {/* Moving grid lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(90deg,#0A1628_1px,transparent_1px),linear-gradient(180deg,#0A1628_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1628]/5 via-transparent to-blue-500/5" />
      </div>

      {/* 2. RADAR SECTION (Left Side) - Enhanced with animations */}
      <div className="hidden md:flex w-1/3 border-r border-[#0A1628]/10 items-center justify-center relative bg-gradient-to-b from-[#0A1628]/5 to-transparent">
        {/* Main Radar Container */}
        <div className="relative w-40 h-40">
          {/* Rotating radar sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0A1628]/10 to-transparent animate-radar-sweep origin-center" />
          </div>
          
          {/* Static rings */}
          <div className="absolute inset-0 border-2 border-[#0A1628]/20 rounded-full" />
          <div className="absolute inset-4 border border-[#0A1628]/10 rounded-full" />
          <div className="absolute inset-8 border border-[#0A1628]/10 rounded-full" />
          
          {/* Animated pulse rings */}
          <div className="absolute inset-0 border-2 border-[#0A1628] rounded-full animate-ping opacity-20" />
          <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-10 animation-delay-500" />
          
          {/* Center train icon with glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0A1628] rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-[#0A1628] text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Navigation className="w-6 h-6 animate-bounce-slow" />
              </div>
            </div>
          </div>
          
          {/* Crosshair */}
          <Crosshair className="absolute w-full h-full text-[#0A1628]/10 p-8 animate-rotate-slow" />
          
          {/* Blinking dots around radar */}
          <div className="absolute top-4 left-1/2 w-2 h-2 bg-green-500 rounded-full animate-blink" />
          <div className="absolute bottom-4 right-1/4 w-2 h-2 bg-blue-500 rounded-full animate-blink animation-delay-1000" />
          <div className="absolute top-1/3 right-4 w-2 h-2 bg-yellow-500 rounded-full animate-blink animation-delay-2000" />
        </div>
        
        {/* Status text */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-green-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase text-[#0A1628]/70">
              Signal: Excellent
            </span>
          </div>
        </div>
      </div>

      {/* 3. DATA SECTION (Right Side / Main) - Enhanced typography and animations */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 relative z-10">
        {/* Connection status bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            <div className="h-4 w-1 bg-[#0A1628] animate-pulse" />
            <div className="h-4 w-1 bg-[#0A1628]/70 animate-pulse animation-delay-200" />
            <div className="h-4 w-1 bg-[#0A1628]/40 animate-pulse animation-delay-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A1628]/50">
            Live Terminal Connection
          </span>
        </div>

        {/* Station names with animation */}
        <div className="relative">
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-[#0A1628] animate-fade-in">
            <span className="bg-gradient-to-r from-[#0A1628] to-blue-600 bg-clip-text text-transparent">
              {currentStation}
            </span>
          </h2>
          
          {/* Animated arrow */}
          <div className="flex items-center gap-4 my-3">
            <div className="h-0.5 w-20 bg-gradient-to-r from-[#0A1628] to-transparent" />
            <div className="relative">
              <span className="text-sm font-semibold text-[#0A1628]/40 uppercase">Next Stop</span>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[#0A1628]/30 animate-slide-right">
                →
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl lg:text-3xl font-bold uppercase text-[#0A1628]/70 animate-fade-in animation-delay-300">
            {nextStation}
          </h3>
        </div>

        {/* Animated Coordinate Cards */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="bg-[#0A1628] text-white px-4 py-2 rounded-lg font-mono text-sm font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-300 animate-slide-up">
            <span className="text-white/60 text-xs">LAT</span>
            <span className="ml-2">{lat?.toFixed(4) || "Loading..."}</span>
          </div>
          <div className="bg-[#0A1628] text-white px-4 py-2 rounded-lg font-mono text-sm font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-200">
            <span className="text-white/60 text-xs">LON</span>
            <span className="ml-2">{lon?.toFixed(4) || "Loading..."}</span>
          </div>
          
          {/* Live speed indicator */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-mono text-sm font-semibold shadow-lg animate-slide-up animation-delay-400">
            <span className="text-white/90 text-xs">SPEED</span>
            <span className="ml-2">78 km/h</span>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-10 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-40" />
          <div className="absolute top-20 right-40 w-1 h-1 bg-[#0A1628] rounded-full animate-float animation-delay-1000 opacity-30" />
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-blue-500 rounded-full animate-float animation-delay-2000 opacity-30" />
        </div>

        {/* Bottom CTA with hover effect */}
        <div className="absolute bottom-6 right-6 group/cta">
          <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-[#0A1628]/10 rounded-full px-4 py-2 shadow-lg group-hover/cta:shadow-xl transition-all duration-300 group-hover/cta:bg-[#0A1628] group-hover/cta:text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628] group-hover/cta:text-white">
              Expand Map
            </span>
            <div className="bg-[#0A1628] group-hover/cta:bg-white p-1.5 rounded-full transition-colors">
              <Maximize2 className="w-3 h-3 text-white group-hover/cta:text-[#0A1628]" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. ANIMATED SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1628]/[0.02] to-transparent animate-scan" />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
        
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .animate-radar-sweep {
          animation: radar-sweep 3s linear infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-slide-right {
          animation: slide-right 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default TrainMap;