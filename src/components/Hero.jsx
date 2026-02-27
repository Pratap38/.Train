// import SearchTrain from "./SearchTrain";
// import "./Hero.css"; 

// const Hero = () => {
//   return (
//     /* Added pt-20 (mobile) and lg:pt-24 (desktop) to push content below the fixed Navbar */
//     <section className="min-h-screen bg-[#FDB813] relative overflow-hidden font-sans pt-20 lg:pt-24">
      
//       {/* Isometric Grid Overlay */}
//       <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#000_12%,transparent_12.5%,transparent_87%,#000_87.5%,#000),linear-gradient(150deg,#000_12%,transparent_12.5%,transparent_87%,#000_87.5%,#000),linear-gradient(30deg,#000_12%,transparent_12.5%,transparent_87%,#000_87.5%,#000),linear-gradient(150deg,#000_12%,transparent_12.5%,transparent_87%,#000_87.5%,#000),linear-gradient(60deg,#000_25%,transparent_25.5%,transparent_75%,#000_75.5%,#000),linear-gradient(60deg,#000_25%,transparent_25.5%,transparent_75%,#000_75.5%,#000)] bg-[length:80px_140px]" />

//       {/* Changed min-h-screen to min-h-[calc(100vh-80px)] 
//           to account for the navbar height and keep the layout centered 
//       */}
//       <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-100px)]">
        
//         {/* LEFT CONTENT */}
//         <div className="py-10 lg:py-0 text-left z-10">
//           {/* Main Heading */}
//           <h1 className="text-black text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter uppercase">
//             TRAIN<br />
//             JUNCTION
//           </h1>

//           {/* Description */}
//           {/* <p className="mt-8 text-black/80 max-w-sm leading-relaxed text-base font-medium font-semibold hover:-skew-x-12 transition-all">1 */}
//           {/* <p className="mt-8 text-black/80 max-w-sm leading-relaxed text-base font-semibold animate-skewAuto"> */}
//           <p className="mt-8 text-black/80 max-w-sm leading-relaxed text-base font-semibold animate-skewAuto">


//            .Train is an Mordern Train  web application that provides real-time tracking and comprehensive information about trains across various routes. Whether you're a daily commuter or a train enthusiast, Train offers an intuitive interface to monitor train schedules, locations, and statuses with ease.
//           </p>

//           {/* "Learn More" */}
//           <div className="mt-6 flex items-center gap-3 group cursor-pointer">
//             {/* <span className="text-black font-bold text-lg">Learn more</span> */}
//             {/* <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//                 <path d="M9 18l6-6-6-6" />
//               </svg>
//             </div> */}
//           </div>

//           {/* Search Component Container */}
//           <div className="mt-12 bg-black/5 backdrop-blur-md rounded-xl p-6 border-2 border-black/20 shadow-xl max-w-md">
//             <div className="mb-4">
//               <h3 className="text-black text-xl font-bold uppercase tracking-tight">Find Your Route</h3>
//               <p className="text-black/60 text-xs font-bold uppercase">System Terminal v2.0</p>
//             </div>
//             <SearchTrain />
//           </div>
//         </div>

//         {/* RIGHT CONTENT */}
//         <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center overflow-visible">
//           <div className="relative w-full h-full scale-100 lg:scale-110 transition-transform duration-700 hover:scale-105">
//             <img 
//               src="/assets/heroo.png" 
//               alt="Train Junction Illustration" 
//               className="w-full h-full object-contain z-20 drop-shadow-[20px_20px_0px_rgba(0,0,0,0.1)]"
//             />
            
//             <div className="absolute top-1/4 right-10 w-12 h-12 bg-[#E5A710] border-2 border-black rotate-45" />
//             <div className="absolute bottom-1/3 left-0 w-16 h-8 bg-black/10 -skew-x-12" />
//           </div>
//         </div>
//       </div>

     
//     </section>
//   );
// };

// export default Hero;
import SearchTrain from "./SearchTrain";
import "./Hero.css"; 

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden font-sans pt-20 lg:pt-24">
      
      {/* Enhanced Geometric Pattern */}
      <div className="absolute inset-0">
        {/* Moving Railway Tracks Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(90deg,#0A1628_2px,transparent_2px),linear-gradient(180deg,#0A1628_2px,transparent_2px)] bg-[size:50px_50px]" />
        
        {/* Animated Circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#0A1628]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-100px)]">
        
        {/* LEFT CONTENT */}
        <div className="py-10 lg:py-0 text-left z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1628]/10 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[#0A1628] text-xs font-bold uppercase tracking-wider">Live Tracking Active</span>
          </div>

          {/* Main Description - Now as the hero text */}
          <div className="relative">
            <div className="absolute -top-6 -left-4 text-8xl text-[#0A1628]/5 font-black">
              01
            </div>
            <h1 className="text-[#0A1628] text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-[#0A1628] to-blue-600 bg-clip-text text-transparent">.Train</span> is a modern train web application that provides real-time tracking and comprehensive information
            </h1>
            <p className="mt-4 text-[#0A1628]/70 text-lg sm:text-xl font-medium max-w-xl">
              Whether you're a daily commuter or a train enthusiast, Train offers an intuitive interface to monitor train schedules, locations, and statuses with ease across various routes.
            </p>
          </div>

          {/* Stats Row */}
          {/* <div className="mt-8 flex gap-8">
            <div className="relative">
              <div className="text-3xl font-black text-[#0A1628]">500K+</div>
              <div className="text-xs font-bold text-[#0A1628]/60 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="relative">
              <div className="text-3xl font-black text-[#0A1628]">99.9%</div>
              <div className="text-xs font-bold text-[#0A1628]/60 uppercase tracking-wider">Uptime</div>
            </div>
            <div className="relative">
              <div className="text-3xl font-black text-[#0A1628]">24/7</div>
              <div className="text-xs font-bold text-[#0A1628]/60 uppercase tracking-wider">Live Track</div>
            </div>
          </div> */}

          {/* Train Image - Below the text */}
          <div className="mt-12 relative h-[250px] lg:h-[300px] max-w-md">
            <div className="relative w-full h-full transform transition-all duration-700 hover:scale-105">
              <img 
                src="/assets/heroo.png" 
                alt="Train Junction Illustration" 
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
              
              {/* Decorative shapes around image */}
              <div className="absolute top-10 -right-5 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 -left-5 w-32 h-32 bg-[#0A1628]/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT - Search Component */}
        <div className="relative h-full flex flex-col justify-center items-center lg:items-start">
          {/* Enhanced Search Component Container */}
          <div className="relative group w-full max-w-md">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A1628] to-blue-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#0A1628]/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[#0A1628] text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Your Route
                  </h3>
                  <p className="text-[#0A1628]/50 text-xs font-bold uppercase">Terminal v2.0 • Fast Search</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
              </div>
              <SearchTrain />
            </div>
          </div>

          {/* Floating Info Cards around search */}
          {/* <div className="relative w-full max-w-md mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-float">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-[#0A1628]/10">
                  <div className="text-xs font-bold text-[#0A1628]/60 uppercase">Next Arrival</div>
                  <div className="text-2xl font-black text-[#0A1628]">2 MIN</div>
                  <div className="text-xs text-[#0A1628]/50 mt-1">Platform 3</div>
                </div>
              </div>
              
              <div className="animate-float animation-delay-1000">
                <div className="bg-gradient-to-r from-[#0A1628] to-blue-600 text-white rounded-xl shadow-lg p-4">
                  <div className="text-xs font-bold uppercase">Express Train</div>
                  <div className="text-2xl font-black">ON TIME</div>
                  <div className="text-xs opacity-80 mt-1">Track A</div>
                </div>
              </div>

              <div className="animate-float animation-delay-2000">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-[#0A1628]/10">
                  <div className="text-xs font-bold text-[#0A1628]/60 uppercase">Passengers</div>
                  <div className="text-2xl font-black text-[#0A1628]">1,245</div>
                  <div className="text-xs text-[#0A1628]/50 mt-1">Today</div>
                </div>
              </div>

              <div className="animate-float animation-delay-1000">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-[#0A1628]/10">
                  <div className="text-xs font-bold text-[#0A1628]/60 uppercase">Weather</div>
                  <div className="text-2xl font-black text-[#0A1628]">Clear ☀️</div>
                  <div className="text-xs text-[#0A1628]/50 mt-1">No Delays</div>
                </div> */}
              {/* </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default Hero;