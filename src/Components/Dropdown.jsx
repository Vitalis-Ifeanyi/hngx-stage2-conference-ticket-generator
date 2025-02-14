import { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ setTicketCount }) => {
  const options = ["1", "2", "3", "4"];
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle selection
  const handleOptionClick = (option) => {
    setInputValue(option);
    setTicketCount(Number(option)); // Update parent state
    setShowDropdown(false);
  };

  // Handle keyboard events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowDropdown(true);
      setFocusedIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : options.length - 1));
    } else if (event.key === "Enter" && focusedIndex !== -1) {
      event.preventDefault();
      handleOptionClick(options[focusedIndex]);
    } else if (event.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onClick={() => setShowDropdown((prev) => !prev)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
        className="w-[75vw] sm:w-[556px] p-2 bg-[#052228] border border-[#07373F] rounded-md text-[#FAFAFA] outline-none cursor-pointer"
        placeholder="Select a number..."
        readOnly
        tabIndex="0"
      />

      {showDropdown && (
        <ul className="absolute p-2 sm:mt-1 bg-[#07373F] border rounded-xl shadow-md transition-all duration-300 ease-in-out opacity-100 translate-y-0">
          {options.map((option, index) => (
            <li
              key={option}
              tabIndex="0"
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => e.key === "Enter" && handleOptionClick(option)}
              className={`w-[75vw] sm:w-[556px] p-2 cursor-pointer bg-[#07373F] hover:bg-[#24A0B5] text-left text-[#FAFAFA] ${
                focusedIndex === index ? "bg-[#24A0B5]" : ""
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
