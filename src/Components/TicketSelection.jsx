import { useState, useEffect } from "react";
import { ButtonSolid } from "./Button";
import CustomDropdown from "./Dropdown";
import { TicketType } from "./TicketType";
import { CloudDownload, Mail } from "lucide-react";
import { saveFormData, getFormData } from "./indexedDB";


// Main component for ticket selection and attendee details
const TicketSelection = ({ currentStep, setCurrentStep }) => {
  // State variables for managing ticket selection, form data, and errors
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [focusedTicket, setFocusedTicket] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [ticketCount, setTicketCount] = useState(0); // Number of tickets selected
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "", text: "" });

  // Button styling class
  const buttonClass =
    "w-[75vw] sm:w-[266px] border-1 border-[#24A0B5] hover:border-3-white hover:bg-[#24A0B5] text-[#24A0B5] hover:text-[#FAFAFA] focus:bg-[#24A0B5] focus:text-[#FAFAFA] transition-all duration-300 text-sm sm:text-xl";

  // Function to handle the "Next" button click and validate inputs
  const handleNext = () => {
    let isValid = true;
    const newErrors = {};

    // Validate based on the current step
    if (currentStep === 1) {
      // Step 1 Validation
      if (!selectedTicket) {
        newErrors.ticket = "Please select a ticket type.";
        isValid = false;
      }
      if (!ticketCount || ticketCount < 1) {
        newErrors.ticketCount = "Please select at least 1 ticket.";
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Step 2 Validation
      if (!formData.name.trim() || formData.name.length < 3) {
        newErrors.name = "Name must be at least 3 characters long.";
        isValid = false;
      }
      if (
        !formData.email.trim() ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
      ) {
        newErrors.email = "Enter a valid email address.";
        isValid = false;
      }
      if (!imageUrl) {
        newErrors.image = "Please upload a profile picture.";
        isValid = false;
      }
    }

    // Set errors if any
    setErrors(newErrors);

    // Proceed to the next step if valid
    if (isValid) {
      console.log("Proceeding to the next step with ticket count:", ticketCount);
      setCurrentStep(currentStep + 1); // Move to the next step
    } else {
      console.log("Validation errors:", newErrors);
    }
  };

  // Function to handle the "Back" button click
  const handleBack = () => {
    if (currentStep === 3) {
      // Reset to stage 1
      setCurrentStep(1);
      setSelectedTicket(null);
      setTicketCount(0);
      setFormData({ name: "", email: "", text: "" });
      setImage(null);
      setErrors({});
    } else if (currentStep === 1) {
      window.location.reload(); // Reload page
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle printing the ticket
  const handlePrint = () => {
    window.print();
  };

  // Function to handle keyboard events for ticket selection
  const handleKeyDown = (event, ticket) => {
    if (event.key === "Enter" || event.key === " ") {
      setSelectedTicket(ticket);
    }
  };

  // Function to handle file drop for image upload
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }

  };

  // Function to handle file input change for image upload
  const handleFileChange =  (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); 
    formData.append("cloud_name", "dotpf6cjf");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dotpf6cjf/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setImageUrl(data.secure_url); // Store the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Load saved form data from IndexedDB on component mount
  useEffect(() => {
    const loadData = async () => {
      const savedData = await getFormData("ticketForm");
      if (savedData) {
        setFormData(savedData);
      }
    };
    loadData();
  }, []);

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      saveFormData("ticketForm", newData); 
      console.log("Saving to IndexedDB:", newData);// Save on change
      return newData;
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center w-[95vw] sm:w-[700px] bg-[#041E23] border-1 border-[#0E464F] mt-2 sm:mt-4 rounded-2xl p-6">
        {/* Step Navigation */}
        <div className="w-full h-[] flex justify-between pb-12">
          <p className="text-white text-2xl sm:text-3xl">
            {currentStep === 1 && "Ticket Selection"}
            {currentStep === 2 && "Attendee Details"}
            {currentStep === 3 && "Ready"}
          </p>
          <p className="text-white text-md">Step {currentStep} / 3</p>
        </div>

        {/* Step Content */}
        <div className="w-full flex flex-col items-center justify-center ">

        {/* STAGE 1 */}
          {currentStep === 1 && (
            <div>
              <div className="w-[85vw] sm:w-[604px] h-[1000px] sm:h-[682px] border-1 border-[#0E464F] bg-[#08252B] rounded-2xl flex flex-col items-center ">
                <div className="flex flex-col items-center gap-4 sm:gap-3 back w-[75vw] sm:w-[556px] h-[200px] border-1 border-[#07373F] mt-[24px] rounded-2xl bg-[#4] backdrop-blur-3xl pb-2 sm:pb-0">
                  <p className="tech text-[#FAFAFA] text-5xl sm:text-7xl mt-4">
                    Techember Fest "25
                  </p>
                  <p className="eventD text-[#FAFAFA] text-sm sm:text-normal text-center font-sm px-3 sm:px-26">
                    Join us for an unforgettable experience at Crunchs And Tech!
                    Secure your spot now.
                  </p>
                  <p className="eventD text-[#FAFAFA] text-center px-8 sm:px-0">
                    📍LandMark Event Center || March 15, 2025 | 7:00 PM{" "}
                  </p>
                </div>
                <div className="w-[75vw] sm:w-[556px] h-[4px] bg-[#07373F] m-10"></div>
                <div className="w-[75vw] sm:w-[556px] ">
                  <p className="select text-[#FAFAFA] mb-2">
                    Select Ticket Type:
                  </p>
                  <div className="ticketType w-[75vw] sm:w-[556px] h-[45vh] sm:h-[150px] bg-[#052228] border-1 border-[#07373F] rounded-2xl flex-col sm:flex-row flex items-center justify-center p-2 gap-4">
                    {TicketType.map((ticket, index) => (
                      <div
                        key={index}
                        tabIndex="0"
                        role="button"
                        aria-selected={selectedTicket === ticket}
                        onClick={() => setSelectedTicket(ticket)}
                        onKeyDown={(event) => handleKeyDown(event, ticket)}
                        onFocus={() => setFocusedTicket(index)}
                        onBlur={() => setFocusedTicket(null)}
                        className={`w-[70vw] sm:w-[158px] h-[110px] border-1 border-[#07373F] p-3 rounded-2xl text-[#FAFAFA] cursor-pointer transition-all duration-300 ${
                          selectedTicket === ticket
                            ? "bg-[#24A0B5]"
                            : "bg-[#052228] hover:bg-[#24A0B5]"
                        }`}
                      >
                        <p className="text-2xl font-extrabold price ">
                          {ticket.price}
                        </p>
                        <p className="text-sm">{ticket.type}</p>
                        <p className="text-sm">{ticket.pin}</p>
                      </div>
                    ))}
                  </div>
                  {errors.ticket && (
                    <span className="text-red-500">{errors.ticket}</span>
                  )}
                  <div className="mb-5">
                    <p className="select text-[#FAFAFA] my-4">
                      Number of Tickets:
                    </p>
                    <CustomDropdown setTicketCount={setTicketCount} />
                    {errors.ticketCount && (
                      <span className="text-red-500">{errors.ticketCount}</span>
                    )}
                  </div>
                </div>
                <div className="w-[75vw] sm:w-[556px] h-[48px] flex flex-col-reverse sm:flex-row justify-between mt-10 sm:mt-2 gap-2.5 sm:gap-0">
                  <ButtonSolid
                    className={buttonClass}
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    {currentStep === 1 && "Cancel"}
                    {currentStep === 2 && "Back"}
                    {currentStep === 3 && "Buy Another Ticket"}
                  </ButtonSolid>

                  <ButtonSolid className={buttonClass} onClick={handleNext}>
                    {currentStep === 1 && "Next"}
                    {currentStep === 2 && "Get My Free Ticket"}
                    {currentStep === 3 && "Download Ticket"}
                  </ButtonSolid>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2 */}
          {currentStep === 2 && (
            <div className=" flex items-center justify-center">
              <div className=" stage2 w-[85vw] sm:w-[604px] h-[1000px] sm:h-[682px] border-2 border-[#0E464F] bg-[#08252B] rounded-2xl flex flex-col items-center ">
                <div className="w-[75vw] sm:w-[556px] h-[200px] border-1 border-[#07373F] mt-6 mb-4 rounded-2xl flex flex-col content-center justify-center pl-2">
                  <div>
                    <p className="text-[#FAFAFA]">Upload Profile Picture</p>
                  </div>
                  <div className="flex items-center justify-center">
                    {/* Drag and Drop Upload */}
                    <div
                      className="relative w-[150px] h-[150px] border-3 border-[#24A0B5] p-6 rounded-lg text-center cursor-pointer bg-[#0E464F] flex items-center justify-center overflow-hidden"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      {/* Uploaded Image */}
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Uploaded"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      )}
                     

                      {/* Overlay Text (Hidden by Default, Appears on Hover) */}
                      <p
                        className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs bg-black/50 transition-opacity duration-300 ${
                          imageUrl ? "opacity-0 hover:opacity-100" : "opacity-100"
                        }`}
                      >
                        <CloudDownload className="mb-1" />
                        Drag & drop or click to upload
                      </p>

                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  {errors.image && (
                    <span className="text-red-500">{errors.image}</span>
                  )}
                </div>
                <div className="w-[75vw] sm:w-[556px] h-[4px] bg-[#07373F]"></div>
                <div>
                  <div className="w-[75vw] sm:w-[556px] h-[80px] mx-10 mt-1">
                    {/* Name Input */}
                    <div className="mt-4 ">
                      <label className="block text-gray-300">
                        Enter your name
                      </label>
                      <input
                        type="text"
                        className="w-full mt-1 pl-8 py-2 border-2 border-[#07373F] rounded-xl focus:outline-none text-[#FAFAFA]"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <span className="text-red-500">{errors.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-[75vw] sm:w-[556px] h-[80px] mx-10 mt-1">
                    {/* Email Input */}
                    <div className="mt-4">
                      <label className="block text-gray-300">
                        Enter your email *
                      </label>
                      <div className="flex items-center justify-center gap-1 border-2 border-[#07373F] rounded-xl focus:outline-none focus:border-4 px-1">
                        <Mail className="text-white w-5" />
                        <input
                          type="email"
                          name="email"
                          className="w-full mt-1 p-2 rounded-xl focus:outline-none text-[#FAFAFA]"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {errors.email && (
                        <span className="text-red-500">{errors.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-[75vw] sm:w-[556px] h-[159px] mx-10 mt-2 text-[#FAFAFA]">
                    <p>Special Requests?</p>
                    <div className="w-[75vw] sm:w-[556px] h-[127px] border-1 border-[#0E464F] text-[#FAFAFA] p-1 rounded-2xl">
                      <input
                        type="text"
                        name="text"
                        className="w-full h-{127px} mt-1 p-2 rounded-xl focus:outline-none text-[#FAFAFA]"
                        value={formData.text}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-[75vw] sm:w-[556px] h-[48px] flex flex-col-reverse sm:flex-row justify-between mt-16 sm:mt-6 gap-2.5 sm:gap-0 ml-10 mb-10">
                    <ButtonSolid
                      className={buttonClass}
                      onClick={handleBack}
                      disabled={currentStep === 1}
                    >
                      {currentStep === 1 && "Cancel"}
                      {currentStep === 2 && "Back"}
                      {currentStep === 3 && "Buy Another Ticket"}
                    </ButtonSolid>

                    <ButtonSolid className={buttonClass} onClick={handleNext}>
                      {currentStep === 1 && "Next"}
                      {currentStep === 2 && "Get My Free Ticket"}
                      {currentStep === 3 && "Download Ticket"}
                    </ButtonSolid>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3 */}
          {currentStep === 3 && (
            <div>
              <div>
                <div className="text-[#FAFAFA] text-center flex flex-col items-center justify-center mb-5">
                  <p className="lastpage text-3xl">Your Ticket is Booked!</p>
                  <p className="ready font-medium">
                    Check your email for a copy or you can <b>download</b>
                  </p>
                </div>
                <div
                  className="flex flex-col items-center justify-center relative "
                  id="printable-ticket"
                >
                  <img
                    src="/src/assets/bg (1).png"
                    className="w-[300px] h-[600px]"
                  />
                  <img
                    src="/src/assets/Skelethon (1).png"
                    className="w-[260px] h-[446px] absolute top-[20px]"
                  />
                  <div>
                    <div
                      id="bindDiv"
                      className="flex flex-col items-center gap-2 sm:gap-3 w-[70vw] sm:w-[280px] h-[500px]  mt-[24px] rounded-2xl pb-2 sm:pb-0 absolute right-[18px] sm:right-[138px] bottom-[82px] sm:bottom-[87px]"
                    >
                      <p className="tech text-[#FAFAFA] text-4xl sm:text-3xl mt-4">
                        Techember Fest "25
                      </p>

                      <p className="eventD text-[#FAFAFA] text-center px-8 sm:px-0 text-[10px] ">
                        📍LandMark Event Center,Lekki, Lagos. <br /> March 15,
                        2025 | 7:00 PM
                      </p>
                      <img
                        src={imageUrl}
                        alt="Attendee's Picture"
                        className="w-32 h-32 mt-[18px] rounded-lg"
                      />
                      <div className=" eventD flex items-center justify-around   text-[#FAFAFA] w-[250px] ml-4 mt-12 sm:mt-10">
                        <p className="text-[12px]">{formData.name}</p>
                        <p className="pl-4 text-[8px]">{formData.email}</p>
                      </div>
                      <div className=" eventD flex items-center  justify-start text-[#FAFAFA] w-[250px] ml-10 sm:ml-16 mt-2">
                        <p className=" text-[10px]">{selectedTicket?.type}</p>
                        <p className="pl-15 text-[12px]">{ticketCount}</p>
                      </div>
                      <div className=" eventD flex  text-[#FAFAFA] ml-3 sm:ml-5 mt-4 sm:mt-5">
                        <p className=" w-[200px] text-xs break-words whitespace-normal text-ellipsis overflow-hidden">
                          {formData.text}
                        </p>
                      </div>
                      <img
                        src="/src/assets/Bar Code.png"
                        alt=""
                        className="mt-20 "
                      />
                    </div>{" "}
                  </div>
                </div>
              </div>

              <div className="w-[75vw] sm:w-[556px] h-[48px] flex flex-col-reverse sm:flex-row justify-between mt-16 sm:mt-6 gap-2.5 sm:gap-0">
                <ButtonSolid
                  className={buttonClass}
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  {currentStep === 1 && "Cancel"}
                  {currentStep === 2 && "Back"}
                  {currentStep === 3 && "Buy Another Ticket"}
                </ButtonSolid>

                <ButtonSolid className={buttonClass} onClick={handlePrint}>
                  {currentStep === 1 && "Next"}
                  {currentStep === 2 && "Get My Free Ticket"}
                  {currentStep === 3 && "Download Ticket"}
                </ButtonSolid>
              </div>
            </div>
          )}
          {/* Navigation Buttons */}
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;