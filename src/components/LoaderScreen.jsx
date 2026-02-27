import { useEffect } from "react";

const LoaderScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 7000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        src="/assets/loader.mp4"
        autoPlay
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute  bottom-10 w-full text-center text-white text-sm tracking-widest opacity-80">
        Loading experience…
      </div>
    </div>
  );
};

export default LoaderScreen;
