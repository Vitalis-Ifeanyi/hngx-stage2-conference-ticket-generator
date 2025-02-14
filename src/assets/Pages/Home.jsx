import { useState } from "react";
import Header from "../../Components/Header";
import StatusBar from "../../Components/StatusBar";
import TicketSelection from "../../Components/TicketSelection";

const Home = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="bg-[#02191D] pt-6 min-h-screen flex flex-col items-center">
      {/* Fixed Header and StatusBar */}
      <div className="fixed top-0 left-0 w-full bg-[#02191D] z-50">
        <Header />
        <StatusBar step={currentStep} />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] px-4 mt-[150px] pb-26">
        <TicketSelection
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default Home;
