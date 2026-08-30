import { useState } from "react";
import { HardDrive, Plus, AlertTriangle, Circle } from "lucide-react";
import { formatSize } from "../../utils/formatters";
import EditDriveModal from "../popups/EditDriveModal";

export function DriveCard({ drive, active, onClick }) {
  const health = drive.health || "Healthy";

  const usagePercent =
    drive.totalSpace > 0 ? (drive.usedSpace / drive.totalSpace) * 100 : 0;

  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: drive.name || "",
    drivePath: drive.drivePath || "",
    capacity: "",
    unit: "TB",
    type: drive.type || "SSD",
    totalSpace: drive.totalSpace || 0,
  });

  const healthStyles = {
    Healthy: {
      icon: "bg-green-500/10 text-green-400",
      dot: "bg-green-400",
      text: "text-green-400",
    },
    Warning: {
      icon: "bg-yellow-500/10 text-yellow-400",
      dot: "bg-yellow-400",
      text: "text-yellow-400",
    },
    Critical: {
      icon: "bg-red-500/10 text-red-400",
      dot: "bg-red-400",
      text: "text-red-400",
    },
  };

  const style = healthStyles[health];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border
        transition-all duration-300
        bg-[#050505]
        p-4 sm:p-5
        min-h-80
        flex flex-col
        ${
          drive.isActive
            ? "border-[#0095ff] shadow-[0_0_0_1px_rgba(0,149,255,0.2)] bg-blue-500/10"
            : "border-neutral-900 hover:border-blue-400/50"
        }
      `}
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center shrink-0
              ${style.icon}
            `}
          >
            <HardDrive size={18} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-[15px] font-semibold text-white truncate">
              {drive.name}
            </h2>

            <p className="text-xs text-neutral-500 mt-0.5 truncate">
              {drive.drivePath}
            </p>
          </div>
        </div>

        {/* ACTIVE TOGGLE */}
        <button
          type="button"
          onClick={onClick}
          className={`
            relative w-10 h-5 rounded-full shrink-0
            transition-colors duration-300
            ${drive.isActive ? "bg-[#0095ff]" : "bg-neutral-800"}
          `}
          aria-label={drive.isActive ? "Deactivate drive" : "Activate drive"}
        >
          <span
            className={`
              absolute top-1 left-1
              w-3 h-3 rounded-full
              transition-transform duration-300
              ${drive.isActive ? "translate-x-5 bg-black" : "translate-x-0 bg-white"}
            `}
          />
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl bg-black p-3">
          <p className="text-[11px] text-neutral-500 mb-1">Type</p>

          <h3 className="text-sm font-semibold text-white">{drive.type}</h3>
        </div>

        <div className="rounded-xl bg-black p-3">
          <p className="text-[11px] text-neutral-500 mb-1">Latency</p>

          <h3 className={`text-sm font-semibold ${style.text}`}>
            {drive.latency ?? "0"} ms
          </h3>
        </div>

        <div className="rounded-xl bg-black p-3">
          <p className="text-[11px] text-neutral-500 mb-1">Capacity</p>

          <h3 className="text-sm font-semibold text-white">
            {formatSize(drive.totalSpace)}
          </h3>
        </div>

        <div className="rounded-xl bg-black p-3">
          <p className="text-[11px] text-neutral-500 mb-1">Used</p>

          <h3 className="text-sm font-semibold text-white">
            {formatSize(drive.usedSpace)}
          </h3>
        </div>
      </div>

      {/* STORAGE */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-400">Storage Usage</span>

          <span className="text-xs font-semibold text-white">
            {usagePercent.toFixed(1)}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-neutral-900 overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-500
              ${
                health === "Critical"
                  ? "bg-red-500"
                  : health === "Warning"
                    ? "bg-yellow-500"
                    : "bg-[#169bff]"
              }
            `}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${style.dot}`} />

        <span className={`text-xs font-medium ${style.text}`}>{health}</span>
      </div>

      {/* BUTTONS */}
      {drive.isActive && (
        <div className="grid grid-cols-2 gap-2 mt-auto pt-5">
          <button
            className="
              h-8 rounded-lg border border-neutral-800
              text-sm font-medium text-white
              hover:bg-blue-500 transition
            "
          >
            Monitor
          </button>

          <button
            onClick={() => setIsOptimizeOpen(true)}
            className="
              h-8 rounded-lg border border-neutral-800
              text-sm font-medium text-white
              hover:bg-blue-500 transition
            "
          >
            Optimize
          </button>
        </div>
      )}

      <EditDriveModal
        isOpen={isOptimizeOpen}
        onClose={() => setIsOptimizeOpen(false)}
        formData={formData}
        setFormData={setFormData}
        loading={false}
        onSubmit={(e) => {
          e.preventDefault();

          console.log("Optimizing drive:", formData);

          setIsOptimizeOpen(false);
        }}
      />
    </div>
  );
}

export const AddDriveCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="min-h-80 rounded-2xl border border-dashed border-neutral-800 bg-[#050505] flex items-center justify-center hover:border-neutral-700 transition"
  >
    <div className="text-center">
      <div className="w-11 h-11 rounded-xl bg-[#0b8fff]/10 text-[#0b8fff] flex items-center justify-center mx-auto mb-5">
        <Plus size={18} />
      </div>

      <h2 className="font-semibold text-white mb-1">Add Drive</h2>

      <p className="text-sm text-neutral-500">Connect a new storage drive</p>
    </div>
  </div>
);

export const SystemCard = ({
  title,
  value,
  subtitle,
  rightText,
  progressTitle,
  progressValue,
  warning,
}) => (
  <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#050505]">
    {/* TOP */}
    <div
      className={`
        p-5 border-b border-neutral-900
        ${
          warning
            ? "bg-[linear-gradient(90deg,rgba(120,35,0,0.35),rgba(50,0,0,0.25))]"
            : "bg-[linear-gradient(90deg,rgba(0,60,100,0.35),rgba(0,40,40,0.2))]"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-neutral-400 text-sm mb-4">{title}</p>

          <h2 className="text-2xl font-bold text-white mb-1">{value}</h2>

          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>

        <div
          className={`flex items-center gap-1.5 text-sm font-medium ${
            warning ? "text-orange-400" : "text-green-400"
          }`}
        >
          {warning ? (
            <AlertTriangle size={14} />
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-400" />
          )}

          {rightText}
        </div>
      </div>
    </div>

    {/* BOTTOM */}
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-neutral-400">{progressTitle}</p>

        <p className="text-white font-semibold">{progressValue}</p>
      </div>

      <div className="h-2 rounded-full bg-neutral-900 overflow-hidden">
        <div className="h-full w-[42%] rounded-full bg-[#169bff]" />
      </div>
    </div>
  </div>
);
