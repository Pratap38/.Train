// import { useState, useEffect } from "react";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navItems = [
//     { label: "Home", href: "#" },
//     { label: "Schedule", href: "#" },
//     { label: "Live Map", href: "#" },
//     { label: "Tickets", href: "#" },
//     { label: "Contact", href: "#" },
//   ];

//   return (
//     <>
//       <nav 
//         className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//           scrolled 
//             ? "bg-[#FDB813] border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]" 
//             : "bg-transparent"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16 lg:h-24">
            
//             {/* Logo - Matching the Isometric Block Style */}
//             <div className="flex items-center gap-3 group cursor-pointer">
//               <div className="relative">
//                 <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center transform group-hover:-translate-y-1 transition-transform duration-300">
//                  <img src="/assets/logo.png" className="w-8 h-8 invert" alt="Logo" />
//                 </div>
//                 {/* Shadow block to give 3D isometric feel */}
//                 <div className="absolute top-1 left-1 -z-10 w-12 h-12 bg-black/20 rounded-lg"></div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-black font-black text-2xl lg:text-3xl tracking-tighter uppercase leading-none">
//                   .Train
//                 </span>
//                 <span className="text-black/60 text-[10px] font-bold tracking-[0.2em] uppercase">
//                   Terminal System
//                 </span>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-10">
//               {navItems.map((item) => (
//                 <a
//                   key={item.label}
//                   href={item.href}
//                   className="text-black font-black text-xs uppercase tracking-widest hover:text-white transition-colors duration-200 relative group"
//                 >
//                   {item.label}
//                   <span className="absolute -bottom-1 left-0 w-0 h-1 bg-black group-hover:w-full transition-all duration-200"></span>
//                 </a>
//               ))}
              
//               {/* User Actions - High Contrast Buttons */}
             
//             </div>

//             {/* Mobile Menu Button - Styled as a black block */}
           
//           </div>
//         </div>

     
//       </nav>

//       {/* Solid overlay for mobile */}
//       {open && (
//         <div 
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;
import { useState, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#", icon: "🏠" },
    { label: "Schedule", href: "#", icon: "📅" },
    { label: "Live Map", href: "#", icon: "📍" },
    { label: "Tickets", href: "#", icon: "🎫" },
    { label: "Contact", href: "#", icon: "📞" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white shadow-2xl" 
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        {/* Railway Track Lines - Top decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#0A1628]/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 border-r-2 border-dashed border-[#0A1628]/20"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            
            {/* Logo - Train Station Style */}
            <div className="flex items-center gap-3 group cursor-pointer relative">
              {/* Animated Train Icon */}
              <div className="relative">
                <div className="w-14 h-14 bg-[#0A1628] rounded-xl flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-500 relative overflow-hidden shadow-lg">
                  {/* Moving train effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <img src="/assets/logo.png" className="w-8 h-8 brightness-0 invert relative z-10" alt="Logo" />
                </div>
                {/* Rails under logo */}
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#0A1628]/20 rounded-full"></div>
                <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-[#0A1628]/40"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[#0A1628] font-black text-2xl lg:text-3xl tracking-tight uppercase leading-none flex items-center gap-1">
                  <span className="text-[#0A1628] animate-pulse opacity-70">●</span>
                  Train
                </span>
                <span className="text-[#0A1628]/70 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                  Terminal System
                  <span className="text-xs animate-pulse">🚊</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Railway Station Board Style */}
            <div className="hidden lg:flex items-center">
              {/* Track Background */}
              <div className="relative flex items-center gap-2 bg-[#0A1628]/5 rounded-full px-2 py-2 backdrop-blur-sm">
                {/* Moving indicator */}
                <div 
                  className="absolute h-10 bg-[#0A1628] rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{
                    width: '120px',
                    left: `${activeIndex * 130 + 8}px`,
                  }}
                />
                
                {navItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveIndex(index)}
                    className={`relative z-10 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      activeIndex === index 
                        ? 'text-white' 
                        : 'text-[#0A1628] hover:text-[#0A1628]/70'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Station Clock - Decorative Element */}
              <div className="ml-8 relative">
                <div className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-white text-xs font-bold">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>

            {/* Mobile Menu Button - Signal Light Style */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden relative w-12 h-12 bg-[#0A1628] rounded-lg flex flex-col items-center justify-center gap-1.5 overflow-hidden group shadow-lg"
            >
              <div className={`absolute inset-0 bg-white/10 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}></div>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Bottom Railway Track Effect */}
        <div className="absolute bottom-0 left-0 w-full h-2 overflow-hidden">
          <div className="absolute bottom-0 left-0 h-1 bg-[#0A1628]/10 w-full"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0A1628]/5 flex gap-4">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="w-8 h-full bg-[#0A1628]/20"></div>
            ))}
          </div>
          {/* Moving Train Animation */}
          <div className="absolute bottom-0 animate-train">
            <div className="flex items-center gap-0.5">
              <div className="w-8 h-1 bg-[#0A1628] shadow-glow-navy"></div>
              <div className="w-6 h-1 bg-blue-600 shadow-glow-blue"></div>
              <div className="w-6 h-1 bg-[#0A1628] shadow-glow-navy"></div>
              <div className="w-6 h-1 bg-blue-500 shadow-glow-blue-light"></div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Departure Board Style */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-white border-t-2 border-[#0A1628]/10 transition-all duration-500 overflow-hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-4 bg-[#0A1628]/5 rounded-lg hover:bg-[#0A1628] hover:text-white text-[#0A1628] transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-bold uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[#0A1628]/60 group-hover:text-white/60 text-sm">
                  <span>Platform {index + 1}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-[#0A1628]/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Custom CSS for train animation and glows */}
      <style jsx>{`
        @keyframes train {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        .animate-train {
          animation: train 10s linear infinite;
        }
        .shadow-glow-navy {
          box-shadow: 0 0 10px rgba(10, 22, 40, 0.3);
        }
        .shadow-glow-blue {
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
        }
        .shadow-glow-blue-light {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
};

export default Navbar;