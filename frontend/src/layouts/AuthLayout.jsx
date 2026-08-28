import React from "react";

const AuthInput = ({ label, type="text", placeholder }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-300">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
          w-full
          bg-neutral-900
          border border-neutral-800
          rounded-lg
          px-4 py-3
          text-sm
          text-white
          outline-none
          focus:border-blue-500
          focus:ring-1
          focus:ring-blue-500
          transition
        "
      />
    </div>
  );
};

export default AuthInput;