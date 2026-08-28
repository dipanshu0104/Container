import React, { useRef, useState, useEffect } from "react";

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, [])
  

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");

    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    // Move to next
    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // If completed
    if (newOtp.every((digit) => digit !== "")) {
      onComplete && onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputsRef.current[index - 1].focus();
      }

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length)
      .split("");

    const newOtp = [...otp];

    pasteData.forEach((value, index) => {
      newOtp[index] = value;
    });

    setOtp(newOtp);

    if (pasteData.length === length) {
      onComplete && onComplete(pasteData.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="
            w-12 h-12
            text-center
            text-white
            text-xl
            font-semibold
            bg-neutral-900
            border border-neutral-800
            rounded-xl
            focus:outline-none
            focus:border-transparent
            focus:ring-2
            focus:ring-blue-500
            transition-all
            duration-300
            shadow-lg
          "
        />
      ))}
    </div>
  );
};

export default OtpInput;
