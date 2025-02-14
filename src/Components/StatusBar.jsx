const StatusBar = ({ step }) => {
  return (
    <div className="w-full bg-[#0E464F] text-white py-4 flex flex-col items-center">
      {/* Progress Bar */}
      <div className="flex items-center justify-center w-full max-w-xl">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step === num
                  ? "bg-[#24A0B5] text-white scale-110"
                  : step > num
                  ? "bg-[#19707D] text-white"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              {num}
            </div>

            {/* Connector Line */}
            {num !== 3 && (
              <div
                className={`w-24 sm:w-96 h-[4px] transition-all duration-300 ${
                  step > num ? "bg-[#24A0B5]" : "bg-gray-600"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
