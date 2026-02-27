import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchTrain from "../components/SearchTrain";
import FindTrain from "../components/FindTrain";
import AIBot from "../components/AIBot";
import "../App.css";
const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
       <FindTrain />
       <AIBot/>
 
    </>
  );
};

export default Home;
