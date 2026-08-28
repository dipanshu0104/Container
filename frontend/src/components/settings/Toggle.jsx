import { useState } from "react";

const Toggle = ({ defaultOn = true }) => {
  const [enabled, setEnabled] = useState(defaultOn);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${
        enabled ? "bg-blue-600" : "bg-neutral-800"
      }`}
    >
      <span
        className={`absolute top-1 left-0 w-4 h-4 rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-5 bg-black" : "translate-x-1 bg-white"
        }`}
      />
    </button>
  );
};

export default Toggle;