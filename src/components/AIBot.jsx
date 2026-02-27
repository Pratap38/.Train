// // import React, { useState, useRef } from "react";

// // const AIBot = () => {
// //   const [listening, setListening] = useState(false);
// //   const [transcript, setTranscript] = useState("");
// //   const [response, setResponse] = useState("");
// //   const recognitionRef = useRef(null);

// //   // 🎙 Start Speech Recognition
// //   const startListening = () => {
// //     const SpeechRecognition =
// //       window.SpeechRecognition || window.webkitSpeechRecognition;

// //     if (!SpeechRecognition) {
// //       alert("Speech Recognition not supported in this browser.");
// //       return;
// //     }

// //     const recognition = new SpeechRecognition();
// //     recognition.lang = "en-IN";
// //     recognition.interimResults = false;
// //     recognition.continuous = false;

// //     recognition.onstart = () => {
// //       setListening(true);
// //     };

// //     recognition.onresult = (event) => {
// //       const speechText = event.results[0][0].transcript;
// //       setTranscript(speechText);
// //       sendToBackend(speechText);
// //     };

// //     recognition.onerror = () => {
// //       setListening(false);
// //     };

// //     recognition.onend = () => {
// //       setListening(false);
// //     };

// //     recognitionRef.current = recognition;
// //     recognition.start();
// //   };

// //   // 📡 Send To Backend
// //   const sendToBackend = async (text) => {
// //     try {
// //       const res = await fetch("http://localhost:8000/api/voice-command/", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ text }),
// //       });

// //       const data = await res.json();

// //       if (data.speech_text) {
// //         setResponse(data.speech_text);
// //         speak(data.speech_text);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   // 🔊 Text To Speech
// //   const speak = (text) => {
// //     const utterance = new SpeechSynthesisUtterance(text);
// //     utterance.lang = "en-IN";
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-6">
      
// //       <div className="w-full max-w-xl bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-slate-700">
        
// //         <h2 className="text-2xl font-bold text-white mb-6 text-center">
// //           🚆 AI Train Assistant
// //         </h2>

// //         {/* Chat Box */}
// //         <div className="space-y-4 min-h-[120px] mb-6">
          
// //           {transcript && (
// //             <div className="bg-slate-700 text-white p-3 rounded-xl text-sm">
// //               <span className="font-semibold">You:</span> {transcript}
// //             </div>
// //           )}

// //           {response && (
// //             <div className="bg-blue-600 text-white p-3 rounded-xl text-sm">
// //               <span className="font-semibold">AI:</span> {response}
// //             </div>
// //           )}
// //         </div>

// //         {/* Mic Button */}
// //         <div className="flex justify-center">
// //           <button
// //             onClick={startListening}
// //             className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-lg 
// //               ${listening 
// //                 ? "bg-red-500 animate-pulse" 
// //                 : "bg-blue-600 hover:bg-blue-700"}
// //             `}
// //           >
// //             {listening ? "🎙 Listening..." : "🎤 Speak"}
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default AIBot;



// // import React, { useState, useRef } from "react";
// // import { useLiveTrain } from "../context/LiveTrainContext";


// // const AIBot = () => {
// //   const [listening, setListening] = useState(false);
// //   const [transcript, setTranscript] = useState("");
// //   const [response, setResponse] = useState("");
// //   const [trainResults, setTrainResults] = useState([]);
// //   const [routeInfo, setRouteInfo] = useState(null);
// //   const [trainLocation, setTrainLocation] = useState(null); // ✅ NEW STATE

// //   const recognitionRef = useRef(null);

// //   const startListening = () => {
// //     const SpeechRecognition =
// //       window.SpeechRecognition || window.webkitSpeechRecognition;

// //     if (!SpeechRecognition) {
// //       alert("Speech Recognition not supported in this browser.");
// //       return;
// //     }

// //     const recognition = new SpeechRecognition();
// //     recognition.lang = "en-IN";
// //     recognition.interimResults = false;
// //     recognition.continuous = false;

// //     recognition.onstart = () => setListening(true);

// //     recognition.onresult = (event) => {
// //       const speechText = event.results[0][0].transcript;
// //       setTranscript(speechText);
// //       sendToBackend(speechText);
// //     };

// //     recognition.onerror = () => setListening(false);
// //     recognition.onend = () => setListening(false);

// //     recognitionRef.current = recognition;
// //     recognition.start();
// //   };

// //   const sendToBackend = async (text) => {
// //     try {
// //       const res = await fetch(
// //         "http://localhost:8000/api/voice-command/",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({ text }),
// //         }
// //       );

// //       const data = await res.json();

// //       // 🗣 Speech response
// //       if (data.speech_text) {
// //         setResponse(data.speech_text);
// //         speak(data.speech_text);
// //       }

// //       // 🚉 ROUTE SEARCH
// //       if (data.intent === "route_search" && data.trains) {
// //         setTrainLocation(null); // clear location block
// //         setTrainResults(data.trains);
// //         setRouteInfo({
// //           from: data.from,
// //           to: data.to,
// //         });
// //       }

// //       // 🚆 TRAIN STATUS (LIVE LOCATION)
// //       if (data.intent === "train_status" && data.data) {
// //         setTrainResults([]); // clear route results
// //         setRouteInfo(null);

// //         const position = data.data.current_position;

// //         if (position) {
// //           setTrainLocation({
// //             station: data.data.current_station,
// //             lat: position.latitude,
// //             lng: position.longitude,
// //             trainNumber: data.data.train_number,
// //           });
// //         }
// //       }

// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   const speak = (text) => {
// //     const utterance = new SpeechSynthesisUtterance(text);
// //     utterance.lang = "en-IN";
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-6">
// //       <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-slate-700">
// //         <h2 className="text-2xl font-bold text-white mb-6 text-center">
// //           🚆 AI Train Assistant
// //         </h2>

// //         {/* Chat Area */}
// //         <div className="space-y-4 min-h-[120px] mb-6">
// //           {transcript && (
// //             <div className="bg-slate-700 text-white p-3 rounded-xl text-sm">
// //               <b>You:</b> {transcript}
// //             </div>
// //           )}

// //           {response && (
// //             <div className="bg-blue-600 text-white p-3 rounded-xl text-sm">
// //               <b>AI:</b> {response}
// //             </div>
// //           )}
// //         </div>

// //         {/* 🚆 Route Results */}
// //         {trainResults.length > 0 && (
// //           <div className="bg-slate-900 p-4 rounded-xl border border-slate-600 mb-6">
// //             <h3 className="text-white font-semibold mb-3">
// //               Trains from {routeInfo?.from} → {routeInfo?.to}
// //             </h3>

// //             <div className="space-y-3 max-h-60 overflow-y-auto">
// //               {trainResults.map((train, index) => (
// //                 <div
// //                   key={index}
// //                   className="bg-slate-700 p-3 rounded-lg text-white text-sm"
// //                 >
// //                   <div className="font-semibold">
// //                     {train.train_number} - {train.train_name}
// //                   </div>
// //                   <div>
// //                     Departure: {train.departure_time} | Arrival:{" "}
// //                     {train.arrival_time}
// //                   </div>
// //                   <div>Duration: {train.duration}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* 📍 LIVE TRAIN LOCATION BLOCK */}
// //         {trainLocation && (
// //           <div className="bg-green-700 p-4 rounded-xl text-white mb-6">
// //             <div className="font-semibold">
// //               Train {trainLocation.trainNumber} Current Location
// //             </div>
// //             <div>Station: {trainLocation.station}</div>
// //             <div>
// //               Coordinates: {trainLocation.lat.toFixed(4)},{" "}
// //               {trainLocation.lng.toFixed(4)}
// //             </div>
// //           </div>
// //         )}

// //         {/* Mic Button */}
// //         <div className="flex justify-center">
// //           <button
// //             onClick={startListening}
// //             className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 shadow-lg ${
// //               listening
// //                 ? "bg-red-500 animate-pulse"
// //                 : "bg-blue-600 hover:bg-blue-700"
// //             }`}
// //           >
// //             {listening ? "🎙 Listening..." : "🎤 Speak"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AIBot;




// import React, { useState, useRef, useEffect } from "react";
// import { useLiveTrain } from "../context/LiveTrainContext";
// import {
//   Mic,
//   MicOff,
//   Train,
//   X,
//   MapPin,
//   Clock,
//   Navigation,
//   MessageCircle,
//   Headphones
// } from "lucide-react";

// const AIBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [response, setResponse] = useState("");
//   const [trainResults, setTrainResults] = useState([]);
//   const [routeInfo, setRouteInfo] = useState(null);
//   const [trainLocation, setTrainLocation] = useState(null);
//   const [language, setLanguage] = useState("hinglish"); // hinglish, hindi, english
//   const [chatHistory, setChatHistory] = useState([]);
//   const [rotatingMessage, setRotatingMessage] = useState(0); // 0 = English, 1 = Hindi

//   const recognitionRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Rotate messages every 2 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRotatingMessage(prev => (prev === 0 ? 1 : 0));
//     }, 2000);
    
//     return () => clearInterval(interval);
//   }, []);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory, response, transcript]);

//   // Rotating messages for the floating button
//   const rotatingMessages = [
//     "Click here for getting train updates", // English
//     "ट्रेन अपडेट के लिए यहाँ क्लिक करें" // Hindi
//   ];

//   // Language texts
//   const languageTexts = {
//     hinglish: {
//       trigger: "Agar aapko nahi aata, ise click karein",
//       title: "🚆 AI Train Assistant",
//       listening: "Sun raha hoon...",
//       speak: "Boliye",
//       you: "Aap",
//       ai: "Assistant",
//       trainsFrom: "Trains from",
//       currentLocation: "Current Location",
//       coordinates: "Coordinates",
//       station: "Station"
//     },
//     hindi: {
//       trigger: "अगर आपको नहीं आता, इसे क्लिक करें",
//       title: "🚆 एआई ट्रेन सहायक",
//       listening: "सुन रहा हूं...",
//       speak: "बोलिए",
//       you: "आप",
//       ai: "सहायक",
//       trainsFrom: "से ट्रेनें",
//       currentLocation: "वर्तमान स्थान",
//       coordinates: "निर्देशांक",
//       station: "स्टेशन"
//     },
//     english: {
//       trigger: "Click here if you don't know how to use",
//       title: "🚆 AI Train Assistant",
//       listening: "Listening...",
//       speak: "Speak",
//       you: "You",
//       ai: "AI",
//       trainsFrom: "Trains from",
//       currentLocation: "Current Location",
//       coordinates: "Coordinates",
//       station: "Station"
//     }
//   };

//   const texts = languageTexts[language];

//   const startListening = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = language === "hindi" ? "hi-IN" : "en-IN";
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => setListening(true);

//     recognition.onresult = (event) => {
//       const speechText = event.results[0][0].transcript;
//       setTranscript(speechText);
//       const newChat = [...chatHistory, { type: "user", text: speechText }];
//       setChatHistory(newChat);
//       sendToBackend(speechText);
//     };

//     recognition.onerror = () => setListening(false);
//     recognition.onend = () => setListening(false);

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   const sendToBackend = async (text) => {
//     try {
//       const res = await fetch("http://localhost:8000/api/voice-command/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text }),
//       });

//       const data = await res.json();

//       // 🗣 Speech response
//       if (data.speech_text) {
//         setResponse(data.speech_text);
//         setChatHistory(prev => [...prev, { type: "ai", text: data.speech_text }]);
//         speak(data.speech_text);
//       }

//       // 🚉 ROUTE SEARCH
//       if (data.intent === "route_search" && data.trains) {
//         setTrainLocation(null);
//         setTrainResults(data.trains);
//         setRouteInfo({
//           from: data.from,
//           to: data.to,
//         });
//       }

//       // 🚆 TRAIN STATUS
//       if (data.intent === "train_status" && data.data) {
//         setTrainResults([]);
//         setRouteInfo(null);

//         const position = data.data.current_position;

//         if (position) {
//           setTrainLocation({
//             station: data.data.current_station,
//             lat: position.latitude,
//             lng: position.longitude,
//             trainNumber: data.data.train_number,
//             speed: data.data.speed || "N/A",
//             delay: data.data.delay || "On Time"
//           });
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       setChatHistory(prev => [...prev, { 
//         type: "ai", 
//         text: "Sorry, I encountered an error. Please try again." 
//       }]);
//     }
//   };

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = language === "hindi" ? "hi-IN" : "en-IN";
//     utterance.rate = 0.9;
//     utterance.pitch = 1;
//     window.speechSynthesis.speak(utterance);
//   };

//   const clearChat = () => {
//     setChatHistory([]);
//     setTranscript("");
//     setResponse("");
//     setTrainResults([]);
//     setRouteInfo(null);
//     setTrainLocation(null);
//   };

//   // If popup is closed, show only the trigger button
//   if (!isOpen) {
//     return (
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={() => setIsOpen(true)}
//           className="group relative flex items-center justify-center"
//         >
//           {/* Floating Assistant Button */}
//           <div className="bg-yellow-200 font-extrabold  p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 animate-pulse-slow">
//             <div className="flex items-center gap-3">
//               <Headphones className="w-8 h-8 text-blue-950 border-2 rounded-2xl transition-all duration-200 hover:-translate-y-2 hover:bg-blue-900" />
//               <div className="text-left">
//                 <div className="text-black font-bold text-lg">Train Assistant</div>
//                 <div className="text-black text-xs mt-1 min-h-[20px] w-40 overflow-hidden">
//                   {/* Rotating message with smooth transition */}
//                   <div className={`transition-all duration-500 transform ${rotatingMessage === 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 absolute'}`}>
//                     {rotatingMessages[0]}
//                   </div>
//                   <div className={`transition-all duration-500 transform ${rotatingMessage === 1 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
//                     {rotatingMessages[1]}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Language selector floating */}
//           <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="flex gap-2">
//               {["hinglish", "hindi", "english"].map((lang) => (
//                 <button
//                   key={lang}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setLanguage(lang);
//                   }}
//                   className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
//                     language === lang
//                       ? "bg-blue-600 text-white"
//                       : "bg-slate-700 text-slate-300 hover:bg-slate-600"
//                   }`}
//                 >
//                   {lang.charAt(0).toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </button>
//       </div>
//     );
//   }

//   // Main Chat Interface
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//       <div className="relative w-full max-w-4xl h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
        
//         {/* Header */}
//         <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-lg p-4 border-b border-slate-700 z-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white/10 rounded-xl">
//                 <Train className="w-6 h-6 text-blue-300" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-white">{texts.title}</h1>
//                 <div className="flex gap-2 mt-1">
//                   {["hinglish", "hindi", "english"].map((lang) => (
//                     <button
//                       key={lang}
//                       onClick={() => setLanguage(lang)}
//                       className={`px-3 py-1 text-xs rounded-full transition-all ${
//                         language === lang
//                           ? "bg-white text-blue-700 font-semibold"
//                           : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
//                       }`}
//                     >
//                       {lang.charAt(0).toUpperCase() + lang.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={clearChat}
//                 className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 text-sm font-medium transition-colors"
//               >
//                 Clear Chat
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-2 bg-slate-700/50 hover:bg-red-500/20 rounded-xl text-slate-300 hover:text-red-400 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="pt-20 h-full flex flex-col">
//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {chatHistory.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="inline-block p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl mb-6">
//                   <MessageCircle className="w-16 h-16 text-blue-400 mx-auto" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-white mb-3">Welcome to Train Assistant</h3>
//                 <p className="text-slate-400 max-w-md mx-auto">
//                   Ask me about train routes, schedules, live locations, or any train-related information.
//                   Click the microphone button below and speak naturally!
//                 </p>
//                 <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
//                   <div className="bg-slate-800/50 p-4 rounded-xl">
//                     <div className="text-blue-400 font-semibold mb-2">Try saying:</div>
//                     <div className="text-slate-400 text-sm">
//                       "Delhi se Mumbai ki train batao"
//                     </div>
//                   </div>
//                   <div className="bg-slate-800/50 p-4 rounded-xl">
//                     <div className="text-blue-400 font-semibold mb-2">Or:</div>
//                     <div className="text-slate-400 text-sm">
//                       "Train Number 12175 ki live location batao"
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {chatHistory.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] rounded-2xl p-4 ${
//                         msg.type === "user"
//                           ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
//                           : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-1">
//                         {msg.type === "user" ? (
//                           <>
//                             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//                               <span className="text-xs">👤</span>
//                             </div>
//                             <span className="font-semibold text-sm">{texts.you}</span>
//                           </>
//                         ) : (
//                           <>
//                             <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
//                               <span className="text-xs">🚆</span>
//                             </div>
//                             <span className="font-semibold text-sm">{texts.ai}</span>
//                           </>
//                         )}
//                       </div>
//                       <div className="text-sm">{msg.text}</div>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </>
//             )}

//             {/* 🚆 Route Results */}
//             {trainResults.length > 0 && (
//               <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-5">
//                 <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
//                   <Navigation className="w-5 h-5 text-blue-400" />
//                   {texts.trainsFrom} {routeInfo?.from} → {routeInfo?.to}
//                 </h3>
//                 <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
//                   {trainResults.map((train, index) => (
//                     <div
//                       key={index}
//                       className="bg-slate-800/60 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 transition-all hover:border-blue-500/50 group"
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-blue-500/20 rounded-lg">
//                             <Train className="w-4 h-4 text-blue-400" />
//                           </div>
//                           <div>
//                             <div className="font-bold text-white">
//                               {train.train_number} - {train.train_name}
//                             </div>
//                             <div className="text-slate-400 text-sm">
//                               Runs: {train.runs_on || "Daily"}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-sm font-semibold px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
//                           {train.duration}
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div className="flex items-center gap-2 text-blue-300">
//                           <Clock className="w-4 h-4" />
//                           <span>Departure: {train.departure_time}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-green-300">
//                           <Clock className="w-4 h-4" />
//                           <span>Arrival: {train.arrival_time}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* 📍 LIVE TRAIN LOCATION */}
//             {trainLocation && (
//               <div className="mt-6 bg-gradient-to-r from-emerald-900/30 to-green-900/30 border border-emerald-500/40 rounded-2xl p-5">
//                 <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
//                   <MapPin className="w-5 h-5 text-emerald-400" />
//                   {texts.currentLocation} - Train {trainLocation.trainNumber}
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-800/50 p-4 rounded-xl">
//                     <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-2">
//                       <MapPin className="w-4 h-4" />
//                       {texts.station}
//                     </div>
//                     <div className="text-white text-xl font-bold">{trainLocation.station}</div>
//                   </div>
//                   <div className="bg-slate-800/50 p-4 rounded-xl">
//                     <div className="text-emerald-400 font-semibold mb-1">
//                       {texts.coordinates}
//                     </div>
//                     <div className="text-white">
//                       {trainLocation.lat.toFixed(4)}, {trainLocation.lng.toFixed(4)}
//                     </div>
//                   </div>
//                 </div>
//                 {trainLocation.speed && (
//                   <div className="mt-4 grid grid-cols-2 gap-4">
//                     <div className="bg-slate-800/50 p-3 rounded-lg text-center">
//                       <div className="text-slate-400 text-sm">Speed</div>
//                       <div className="text-white font-bold">{trainLocation.speed} km/h</div>
//                     </div>
//                     <div className="bg-slate-800/50 p-3 rounded-lg text-center">
//                       <div className="text-slate-400 text-sm">Status</div>
//                       <div className={`font-bold ${
//                         trainLocation.delay === "On Time" 
//                           ? "text-green-400" 
//                           : "text-yellow-400"
//                       }`}>
//                         {trainLocation.delay}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Mic Button Section */}
//           <div className="border-t border-slate-700/50 p-6 bg-gradient-to-t from-slate-900/80 to-transparent">
//             <div className="flex items-center justify-center gap-4">
//               {/* Transcript Display */}
//               {transcript && !listening && (
//                 <div className="flex-1 bg-slate-800/50 p-4 rounded-xl">
//                   <div className="text-sm text-slate-400 mb-1">Last Command</div>
//                   <div className="text-white">{transcript}</div>
//                 </div>
//               )}

//               {/* Mic Button */}
//               <button
//                 onClick={startListening}
//                 disabled={listening}
//                 className={`relative p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
//                   listening
//                     ? "bg-gradient-to-r from-red-500 to-pink-600 animate-pulse shadow-2xl shadow-red-500/50"
//                     : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/50"
//                 }`}
//               >
//                 {listening ? (
//                   <MicOff className="w-8 h-8 text-white" />
//                 ) : (
//                   <Mic className="w-8 h-8 text-white" />
//                 )}
                
//                 {/* Animation rings when listening */}
//                 {listening && (
//                   <>
//                     <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></div>
//                     <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-50 animation-delay-300"></div>
//                   </>
//                 )}
//               </button>

//               {/* Listening Indicator */}
//               {listening && (
//                 <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full">
//                   <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
//                   <span className="text-red-300 font-medium">{texts.listening}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Mic Button Label */}
//             <div className="text-center mt-4">
//               <div className="text-slate-400 text-sm">
//                 Click the microphone and speak naturally
//               </div>
//               <div className="text-xs text-slate-500 mt-1">
//                 Language: {language.charAt(0).toUpperCase() + language.slice(1)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIBot;

// // Add custom animation for slow pulse
// const style = document.createElement('style');
// style.textContent = `
//   @keyframes pulse-slow {
//     0%, 100% { opacity: 1; }
//     50% { opacity: 0.7; }
//   }
//   .animate-pulse-slow {
//     animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//   }
//   .animation-delay-300 {
//     animation-delay: 300ms;
//   }
// `;
// document.head.appendChild(style);
import React, { useState, useRef, useEffect } from "react";
import { useLiveTrain } from "../context/LiveTrainContext";
import {
  Mic,
  MicOff,
  Train,
  X,
  MapPin,
  Clock,
  Navigation,
  MessageCircle,
  Headphones
} from "lucide-react";

const AIBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [trainResults, setTrainResults] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [trainLocation, setTrainLocation] = useState(null);
  const [language, setLanguage] = useState("hinglish");
  const [chatHistory, setChatHistory] = useState([]);
  const [rotatingMessage, setRotatingMessage] = useState(0);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Rotate messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingMessage(prev => (prev === 0 ? 1 : 0));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, response, transcript]);

  // Rotating messages for the floating button
  const rotatingMessages = [
    "Click here for getting train updates",
    "ट्रेन अपडेट के लिए यहाँ क्लिक करें"
  ];

  // Language texts
  const languageTexts = {
    hinglish: {
      title: "🚆 AI Train Assistant",
      listening: "Sun raha hoon...",
      speak: "Boliye",
      you: "Aap",
      ai: "Assistant",
      trainsFrom: "Trains from",
      currentLocation: "Current Location",
      coordinates: "Coordinates",
      station: "Station"
    },
    hindi: {
      title: "🚆 एआई ट्रेन सहायक",
      listening: "सुन रहा हूं...",
      speak: "बोलिए",
      you: "आप",
      ai: "सहायक",
      trainsFrom: "से ट्रेनें",
      currentLocation: "वर्तमान स्थान",
      coordinates: "निर्देशांक",
      station: "स्टेशन"
    },
    english: {
      title: "🚆 AI Train Assistant",
      listening: "Listening...",
      speak: "Speak",
      you: "You",
      ai: "AI",
      trainsFrom: "Trains from",
      currentLocation: "Current Location",
      coordinates: "Coordinates",
      station: "Station"
    }
  };

  const texts = languageTexts[language];

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hindi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      const newChat = [...chatHistory, { type: "user", text: speechText }];
      setChatHistory(newChat);
      sendToBackend(speechText);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendToBackend = async (text) => {
    try {
      const res = await fetch("http://localhost:8000/api/voice-command/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.speech_text) {
        setResponse(data.speech_text);
        setChatHistory(prev => [...prev, { type: "ai", text: data.speech_text }]);
        speak(data.speech_text);
      }

      if (data.intent === "route_search" && data.trains) {
        setTrainLocation(null);
        setTrainResults(data.trains);
        setRouteInfo({
          from: data.from,
          to: data.to,
        });
      }

      if (data.intent === "train_status" && data.data) {
        setTrainResults([]);
        setRouteInfo(null);

        const position = data.data.current_position;

        if (position) {
          setTrainLocation({
            station: data.data.current_station,
            lat: position.latitude,
            lng: position.longitude,
            trainNumber: data.data.train_number,
            speed: data.data.speed || "N/A",
            delay: data.data.delay || "On Time"
          });
        }
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        type: "ai", 
        text: "Sorry, I encountered an error. Please try again." 
      }]);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hindi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    setChatHistory([]);
    setTranscript("");
    setResponse("");
    setTrainResults([]);
    setRouteInfo(null);
    setTrainLocation(null);
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center"
        >
          {/* Floating Assistant Button */}
          <div className="bg-white shadow-2xl p-4 rounded-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-[#0A1628]/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0A1628] rounded-xl animate-pulse">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[#0A1628] font-bold text-lg">Train Assistant</div>
                <div className="text-[#0A1628]/60 text-xs mt-1 min-h-[20px] w-40 overflow-hidden">
                  <div className={`transition-all duration-500 transform ${rotatingMessage === 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 absolute'}`}>
                    {rotatingMessages[0]}
                  </div>
                  <div className={`transition-all duration-500 transform ${rotatingMessage === 1 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {rotatingMessages[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Language selector */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border border-[#0A1628]/10 rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              {["hinglish", "hindi", "english"].map((lang) => (
                <button
                  key={lang}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage(lang);
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    language === lang
                      ? "bg-[#0A1628] text-white"
                      : "bg-gray-100 text-[#0A1628]/70 hover:bg-gray-200"
                  }`}
                >
                  {lang.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </button>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/20 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#0A1628]/10 overflow-hidden">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-[#0A1628]/10 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0A1628] rounded-xl">
                <Train className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0A1628]">{texts.title}</h1>
                <div className="flex gap-2 mt-1">
                  {["hinglish", "hindi", "english"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        language === lang
                          ? "bg-[#0A1628] text-white font-semibold"
                          : "bg-gray-100 text-[#0A1628]/70 hover:bg-gray-200"
                      }`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={clearChat}
                className="px-4 py-2 bg-[#0A1628]/5 hover:bg-[#0A1628]/10 rounded-xl text-[#0A1628] text-sm font-medium transition-colors"
              >
                Clear Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-[#0A1628]/5 hover:bg-red-50 rounded-xl text-[#0A1628] hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="pt-20 h-full flex flex-col bg-gray-50">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-[#0A1628]/5 rounded-2xl mb-6">
                  <MessageCircle className="w-16 h-16 text-[#0A1628] mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A1628] mb-3">Welcome to Train Assistant</h3>
                <p className="text-[#0A1628]/70 max-w-md mx-auto">
                  Ask me about train routes, schedules, live locations, or any train-related information.
                  Click the microphone button below and speak naturally!
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-white p-4 rounded-xl border border-[#0A1628]/10">
                    <div className="text-[#0A1628] font-semibold mb-2">Try saying:</div>
                    <div className="text-[#0A1628]/60 text-sm">
                      "Delhi se Mumbai ki train batao"
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#0A1628]/10">
                    <div className="text-[#0A1628] font-semibold mb-2">Or:</div>
                    <div className="text-[#0A1628]/60 text-sm">
                      "Train Number 12175 ki live location"
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.type === "user"
                          ? "bg-[#0A1628] text-white rounded-br-none"
                          : "bg-white text-[#0A1628] rounded-bl-none border border-[#0A1628]/10 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.type === "user" ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                            <span className="font-semibold text-sm">{texts.you}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-full bg-[#0A1628]/10 flex items-center justify-center">
                              <span className="text-xs">🚆</span>
                            </div>
                            <span className="font-semibold text-sm">{texts.ai}</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}

            {/* Route Results */}
            {trainResults.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl p-5 border border-[#0A1628]/10 shadow-sm">
                <h3 className="text-[#0A1628] font-bold text-lg mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#0A1628]" />
                  {texts.trainsFrom} {routeInfo?.from} → {routeInfo?.to}
                </h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {trainResults.map((train, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 hover:bg-[#0A1628]/5 p-4 rounded-xl border border-[#0A1628]/10 transition-all hover:border-[#0A1628]/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#0A1628]/10 rounded-lg">
                            <Train className="w-4 h-4 text-[#0A1628]" />
                          </div>
                          <div>
                            <div className="font-bold text-[#0A1628]">
                              {train.train_number} - {train.train_name}
                            </div>
                            <div className="text-[#0A1628]/60 text-sm">
                              Runs: {train.runs_on || "Daily"}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          {train.duration}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-[#0A1628]/70">
                          <Clock className="w-4 h-4" />
                          <span>Departure: {train.departure_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#0A1628]/70">
                          <Clock className="w-4 h-4" />
                          <span>Arrival: {train.arrival_time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Train Location */}
            {trainLocation && (
              <div className="mt-6 bg-white rounded-2xl p-5 border border-[#0A1628]/10 shadow-sm">
                <h3 className="text-[#0A1628] font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0A1628]" />
                  {texts.currentLocation} - Train {trainLocation.trainNumber}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0A1628]/5 p-4 rounded-xl">
                    <div className="text-[#0A1628] font-semibold mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {texts.station}
                    </div>
                    <div className="text-[#0A1628] text-xl font-bold">{trainLocation.station}</div>
                  </div>
                  <div className="bg-[#0A1628]/5 p-4 rounded-xl">
                    <div className="text-[#0A1628] font-semibold mb-1">
                      {texts.coordinates}
                    </div>
                    <div className="text-[#0A1628]">
                      {trainLocation.lat.toFixed(4)}, {trainLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
                {trainLocation.speed && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-[#0A1628]/60 text-sm">Speed</div>
                      <div className="text-[#0A1628] font-bold">{trainLocation.speed} km/h</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-[#0A1628]/60 text-sm">Status</div>
                      <div className={`font-bold ${
                        trainLocation.delay === "On Time" 
                          ? "text-green-600" 
                          : "text-yellow-600"
                      }`}>
                        {trainLocation.delay}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mic Button Section */}
          <div className="border-t border-[#0A1628]/10 p-6 bg-white">
            <div className="flex items-center justify-center gap-4">
              {/* Transcript Display */}
              {transcript && !listening && (
                <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-[#0A1628]/10">
                  <div className="text-sm text-[#0A1628]/60 mb-1">Last Command</div>
                  <div className="text-[#0A1628]">{transcript}</div>
                </div>
              )}

              {/* Mic Button */}
              <button
                onClick={startListening}
                disabled={listening}
                className={`relative p-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  listening
                    ? "bg-red-500 animate-pulse shadow-2xl shadow-red-500/30"
                    : "bg-[#0A1628] hover:shadow-2xl hover:shadow-[#0A1628]/30"
                }`}
              >
                {listening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
                
                {/* Animation rings when listening */}
                {listening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-50 animation-delay-300"></div>
                  </>
                )}
              </button>

              {/* Listening Indicator */}
              {listening && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">{texts.listening}</span>
                </div>
              )}
            </div>
            
            {/* Mic Button Label */}
            <div className="text-center mt-4">
              <div className="text-[#0A1628]/70 text-sm">
                Click the microphone and speak naturally
              </div>
              <div className="text-xs text-[#0A1628]/50 mt-1">
                Language: {language.charAt(0).toUpperCase() + language.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBot;

// Add custom animation for slow pulse
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .animate-pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .animation-delay-300 {
    animation-delay: 300ms;
  }
`;
document.head.appendChild(style);