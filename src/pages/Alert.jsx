import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";

const Alert = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        No active alerts
      </div>
    );
  }

  const { station, severity, distanceKm } = state;

  const borderColor =
    severity === "HIGH" ? "border-red-600" : "border-yellow-500";

  const badgeColor =
    severity === "HIGH"
      ? "bg-red-500/20 text-red-400"
      : "bg-yellow-500/20 text-yellow-400";

  const iconColor =
    severity === "HIGH" ? "text-red-500" : "text-yellow-400";

  const handleDismiss = () => {
    // ✅ mark this alert as already seen
    sessionStorage.setItem(
      `alert-seen-${trainNumber}-${station}`,
      "true"
    );

    navigate(`/train/${trainNumber}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div
        className={`relative bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border-l-8 ${borderColor}`}
      >
        {/* ❌ Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className={`w-8 h-8 ${iconColor}`} />
          <h1 className="text-2xl font-bold">
            Network Alert Ahead
          </h1>
        </div>

        <p className="text-lg mb-3">
          <b>{station}</b> in ~{distanceKm} km
        </p>

        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${badgeColor}`}
        >
          {severity} NETWORK
        </span>

        <p className="mt-6 text-slate-300">
          You may experience connectivity issues soon.
        </p>

        <div className="mt-8 flex gap-3">
          {/* ✅ Continue */}
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold"
          >
            Continue Tracking
          </button>

          {/* 📴 Offline */}
          <Link
            to={`/offline/${trainNumber}`}
            className="flex-1 bg-slate-700 py-3 rounded-xl text-center font-bold"
          >
            Offline Mode
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Alert;
