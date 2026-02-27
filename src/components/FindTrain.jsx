import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Navigation, Calendar, Train, ArrowLeftRight } from "lucide-react";

const FindTrain = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to) {
      setError("Please enter both station codes.");
      return;
    }

    setLoading(true);
    setError("");
    setTrains([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/train/search?from=${from}&to=${to}&date=${date}`
      );
      const data = await res.json();
      if (data.success && data.trains) {
        setTrains(data.trains);
      } else {
        setError("No trains found for this route.");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-[#121212] py-12 px-4 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-blue-600/20 rounded-2xl">
              <Train className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">
              Find Your <span className="text-blue-500">Train</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Search trains between stations with real-time information and schedules.
          </p>
        </div>

        {/* Improved Search Card */}
        <div className="bg-[#1e1e1e] rounded-[32px] shadow-2xl p-2 mb-12 border border-white/5 shadow-blue-900/10">
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              
              {/* From Station */}
              <div className="lg:col-span-3 relative group">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">
                  <Navigation className="w-3 h-3" />
                  Origin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="From (e.g. DBA)"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-4 bg-[#2a2a2a] text-white border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#323232] transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              {/* Swap Button Integration */}
              <div className="lg:col-span-1 flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => {
                    const temp = from;
                    setFrom(to);
                    setTo(temp);
                  }}
                  className="p-3 bg-[#2a2a2a] hover:bg-blue-600 text-gray-400 hover:text-white rounded-xl transition-all duration-300 hover:rotate-180 shadow-lg active:scale-90 border border-white/5"
                  title="Swap stations"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>

              {/* To Station */}
              <div className="lg:col-span-3 relative group">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">
                  <Navigation className="w-3 h-3 rotate-90" />
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="To (e.g. GWL)"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-4 bg-[#2a2a2a] text-white border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#323232] transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="lg:col-span-2 relative group">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-blue-500 transition-colors">
                  <Calendar className="w-3 h-3" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-4 bg-[#2a2a2a] text-white border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#323232] transition-all [color-scheme:dark] font-medium"
                />
              </div>

              {/* Search Button */}
              <div className="lg:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Find Trains
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-1 rounded-full">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {trains.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Available Trains <span className="text-blue-500 ml-2">({trains.length})</span>
              </h2>
              <div className="px-4 py-1.5 bg-white/5 rounded-full text-sm text-gray-400 border border-white/5">
                Results for {date}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trains.map((train, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/train/${train.train_number}`)}
                  className="group bg-[#1e1e1e] rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-5 group-hover:from-blue-500 group-hover:to-blue-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{train.train_name}</h3>
                        <span className="bg-black/20 text-blue-100 px-2 py-0.5 rounded-md text-xs font-mono">#{train.train_number}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {train.train_type || "Express"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-8 relative">
                      <div className="text-center z-10">
                        <div className="text-2xl font-black text-white">{train.departure_time}</div>
                        <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">{train.from}</div>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center px-4 relative">
                        <div className="w-full h-[2px] bg-white/10 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 w-0 group-hover:w-full transition-all duration-700"></div>
                        </div>
                        <Clock className="w-4 h-4 text-gray-600 mt-2" />
                        <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">{train.duration}</span>
                      </div>

                      <div className="text-center z-10">
                        <div className="text-2xl font-black text-white">{train.arrival_time}</div>
                        <div className="text-xs font-bold text-green-500 uppercase tracking-widest">{train.to}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-xs font-bold">Runs Daily</span>
                      </div>
                      <span className="text-blue-500 text-xs font-black uppercase group-hover:translate-x-1 transition-transform">
                        Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FindTrain;