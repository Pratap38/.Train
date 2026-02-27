import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";


import Home from "./pages/Home";
import TrainDetails from "./pages/TrainDetails";
import LoaderScreen from "./components/LoaderScreen";
import OfflinePage from "./pages/OfflinePage";
import BiggerMap from "./components/BiggerMap";
import AlertPage from "./pages/Alert";
// import { LiveTrainProvider } from "./context/LiveTrainContext";

function App() {
  const [loading, setLoading] = useState(true);

  // Show loader only once when app starts
  if (loading) {
    return <LoaderScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train/:trainNumber" element={<TrainDetails />} />
         <Route path="/offline/:trainNumber" element={<OfflinePage />} /> 
         <Route path="/alert/:trainNumber" element={<AlertPage />} />
          <Route path="/map/:trainNumber" element={<BiggerMap />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
