import { createContext, useContext, useState } from "react";

const LiveTrainContext = createContext();

export const LiveTrainProvider = ({ children }) => {
  const [liveTrain, setLiveTrain] = useState(null);

  return (
    <LiveTrainContext.Provider value={{ liveTrain, setLiveTrain }}>
      {children}
    </LiveTrainContext.Provider>
  );
};

export const useLiveTrain = () => useContext(LiveTrainContext);
