import { HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import { calculateFileStats, formatSize } from "../../utils/formatters";

export default function StorageBar({ files, activeDrive }) {
  const storage = calculateFileStats(files, "size");

  const TOTAL_STORAGE = activeDrive?.totalSpace || 0;
  const USED_STORAGE = activeDrive?.usedSpace || 0;
  const usedPercentage = (storage.total / TOTAL_STORAGE) * 100;

  const segments = [
    { key: "images", color: "bg-blue-500" },
    { key: "videos", color: "bg-pink-500" },
    { key: "docs", color: "bg-yellow-400" },
    { key: "audio", color: "bg-green-500" },
    { key: "other", color: "bg-purple-500" },
  ];

  const spring = {
    type: "spring",
    stiffness: 70, // lower = smoother
    damping: 22, // higher = less bounce
    mass: 1,
  };

  return (
    <div className="w-full rounded-xl bg-black border border-neutral-800 p-4 sm:p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-blue-500/15">
          <HardDrive className="text-blue-500" size={25} />
        </div>
        <div>
          <h3 className="text-white text-xl font-semibold">Storage</h3>
          <p className="text-sm text-neutral-400">
            {formatSize(storage.total)} of {formatSize(TOTAL_STORAGE)} used
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
        {segments.map(({ key, color }) => {
          const width = (storage[key] / TOTAL_STORAGE) * 100;
          if (width <= 0) return null;

          return (
            <motion.div
              key={key}
              layout
              className={`${color} h-full`}
              animate={{ width: `${width}%` }}
              transition={spring}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-5 text-xs">
        {segments.map(({ key, color }) => (
          <div key={key} className="flex items-center gap-2 text-neutral-400">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="capitalize">
              {key} ({formatSize(storage[key])})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
