import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchTrain = () => {
  const [trainNo, setTrainNo] = useState("");
  const navigate = useNavigate();

  const handleTrack = () => {
    if (!trainNo || trainNo.length < 4) {
      alert("Enter a valid train number");
      return;
    }

    navigate(`/train/${trainNo}`);
  };

  return (
    <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-xl">
      <p className="text-white text-xs tracking-widest mb-3 text-center sm:text-left">
        TRACK LIVE STATUS
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Train No. (e.g. 12401)"
          value={trainNo}
          onChange={(e) =>
            setTrainNo(e.target.value.replace(/\D/g, ""))
          }
          className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl outline-none text-gray-700"
        />

       <button
  onClick={handleTrack}
  className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 
             bg-black text-[#FDB813] 
             font-black uppercase tracking-[0.2em] text-sm
             border-2 border-black
             shadow-[4px_4px_0_0_rgba(0,0,0,1)] 
             hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
             active:bg-[#FDB813] active:text-black
             transition-all duration-150"
>
  TRACK
</button>
      </div>
    </div>
  );
};

export default SearchTrain;
