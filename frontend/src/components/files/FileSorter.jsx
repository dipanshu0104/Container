import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUp, ArrowDown, Check } from "lucide-react";

const options = [
  { label: "Date", value: "date" },
  { label: "Name", value: "name" },
  { label: "Size", value: "size" },
];

const FileSorter = ({ files = [], onSorted }) => {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedFiles = useMemo(() => {
    if (!Array.isArray(files)) return [];

    return [...files].sort((a, b) => {
      // Folders always stay at the top
      if (a?.isFolder && !b?.isFolder) return -1;
      if (!a?.isFolder && b?.isFolder) return 1;

      let diff = 0;
      if (sortBy === "name") {
        diff = (a?.filename || "").localeCompare(b?.filename || "");
      } else if (sortBy === "size") {
        diff = (Number(a?.size) || 0) - (Number(b?.size) || 0);
      } else {
        const dateA = new Date(a?.createdAt || a?.birthtime || 0).getTime();
        const dateB = new Date(b?.createdAt || b?.birthtime || 0).getTime();
        diff = dateA - dateB;
      }
      return order === "asc" ? diff : -diff;
    });
  }, [files, sortBy, order]);

  useEffect(() => {
    onSorted?.(sortedFiles);
  }, [sortedFiles, onSorted]);

  const currentLabel = options.find((o) => o.value === sortBy)?.label;

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2.5 px-4 py-2 text-sm font-medium transition-all
                   bg-neutral-900/50 backdrop-blur-md border border-neutral-800 
                   hover:border-neutral-600 hover:bg-neutral-800 rounded-xl text-neutral-300 select-none"
      >
        <span className="text-neutral-500 font-normal">Sort:</span> 
        {currentLabel}
        <div className="w-px h-3 bg-neutral-700 mx-0.5" />
        {order === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute right-0 mt-2 min-w-35 p-1.5 z-50
                       bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {options.map((opt) => {
              const active = sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (active) setOrder(prev => prev === "asc" ? "desc" : "asc");
                    else { setSortBy(opt.value); setOrder("desc"); }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 mb-1 text-sm rounded-lg transition-colors
                    ${active ? "bg-white/5 text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 flex items-center">
                      {active && <Check size={14} className="text-blue-500" />}
                    </div>
                    {opt.label}
                  </div>
                  
                  {active && (
                    <span className="opacity-60">
                      {order === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileSorter;