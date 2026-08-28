import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          py-1.5
          px-4
          rounded-lg
          border
          border-neutral-900
          bg-[#0e0e0e]
          text-sm
          text-white
          flex
          items-center
          justify-between
        "
      >
        <span>{value || placeholder}</span>

        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            mt-2 p-1
            w-full
            rounded-xl
            overflow-hidden
            border
            border-neutral-800
            bg-black
            shadow-2xl
            z-50
          "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="
                w-full
                px-4
                py-1.5
                flex
                items-center
                justify-between
                text-white
                text-sm
                rounded-md
                hover:bg-[#0b8fff]
              "
            >
              {option}

              {value === option && (
                <Check
                  size={15}
                  className="text-[#0b8fff]"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}