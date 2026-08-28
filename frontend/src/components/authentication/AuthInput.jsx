import React from "react";
import {UserRound, Mail, Lock } from "lucide-react";

const icons = {
  identifier: UserRound,
  name: UserRound, 
  email: Mail,
  password: Lock,
};

const AuthInput = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}) => {
  const Icon = icons[name];

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-neutral-300">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        )}

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full
            pl-10
            pr-4
            py-2
            rounded-lg
            bg-neutral-900
            border border-neutral-800
            text-white
            placeholder-neutral-500
            outline-none
            focus:border-blue-500
            transition
          "
        />
      </div>
    </div>
  );
};

export default AuthInput;