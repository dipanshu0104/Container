import { useState, useEffect } from "react";
import Modal from "./Model";
import { Palette, Folder, ChevronRight } from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#22C55E",
  "#F59E0B",
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export default function EditModel({
  isOpen,
  onClose,
  onSubmit,
  folder,
  loading = false,
}) {
  const [folderName, setFolderName] = useState("");
  const [color, setColor] = useState("#3B82F6");

  useEffect(() => {
    if (isOpen && folder) {
      setFolderName(folder.name || "");
      setColor(folder.color || "#3B82F6");
    }
  }, [isOpen, folder]);

  const handleSubmit = async () => {
    if (!folderName.trim()) return;

    await onSubmit(folder._id, folderName.trim(), color);
    onClose()
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Folder">
      <div className="flex flex-col gap-6 p-1">

        {/* Preview + Input */}
        <div
          className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800 transition-all duration-300"
          style={{ borderColor: `${color}30` }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500"
            style={{ backgroundColor: `${color}20` }}
          >
            <Folder
              size={28}
              style={{
                fill: color,
                color: color,
              }}
              fill={`${color}40`}
              strokeWidth={1.5}
            />
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Folder Name
            </label>

            <input
              type="text"
              placeholder="Enter folder name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSubmit()
              }
              className="w-full bg-transparent text-white text-lg font-medium outline-none placeholder:text-neutral-700"
              autoFocus
            />
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Label Color
            </span>

            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: color }}
              />

              <span className="text-[10px] font-mono text-neutral-400">
                {color.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 p-3 rounded-2xl bg-neutral-900/30 border border-neutral-800/50">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="group relative flex justify-center items-center"
              >
                <div
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    color === c
                      ? "scale-105 ring-2 ring-offset-2 ring-offset-neutral-950"
                      : "scale-90 opacity-50 hover:opacity-100 hover:scale-100"
                  }`}
                  style={{
                    backgroundColor: c,
                    ringColor: c,
                  }}
                />
              </button>
            ))}

            {/* Custom Color Picker */}
            <div className="relative flex justify-center items-center group">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div
                className={`w-7 h-7 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center transition-all ${
                  !COLORS.includes(color)
                    ? "scale-110 border-solid ring-2 ring-offset-2 ring-offset-neutral-950"
                    : "group-hover:border-neutral-400"
                }`}
                style={{
                  backgroundColor: !COLORS.includes(color)
                    ? color
                    : "transparent",
                  ringColor: color,
                }}
              >
                <Palette
                  size={12}
                  className={
                    !COLORS.includes(color)
                      ? "text-white"
                      : "text-neutral-500"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-neutral-500 text-sm font-semibold hover:text-white hover:bg-neutral-900 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !folderName.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed shadow-lg"
            style={{
              backgroundColor: color,
              boxShadow: `0 10px 20px -10px ${color}60`,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}

            {!loading && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </Modal>
  );
}