import { useState } from "react";
import { Star } from "lucide-react";

import AdaptiveMenu from "./AdaptiveMenu";

import { formatSize } from "../../utils/formatters";
import { getFileIconConfig, getFileType } from "../../utils/fileIconUtil";

import { useLayoutStore } from "../../store/useLayoutStore";
import { useSelectionStore } from "../../store/useSelectionStore";

import { toggleFavoriteAPI } from "../../api/files.api";
import { useLongPress } from "../../hooks/useLongPress";

export default function FileCard({ file }) {
  const { _id, name, size, mimeType, isFavorite = false, preview } = file;

  const [favorite, setFavorite] = useState(isFavorite);

  const layout = useLayoutStore((state) => state.layout);

  const { selected, selectionMode, startSelection } =
    useSelectionStore();

  const isSelected = selected.files.includes(_id);

  const type = getFileType(mimeType);
  const { icon: Icon, color, hoverBorder, bgColor } =
    getFileIconConfig(mimeType);

  /* =========================
      FAVORITE
  ========================= */
  const handleFavorite = async (e) => {
    e.stopPropagation();

    try {
      const res = await toggleFavoriteAPI(_id);
      if (res.data.success) {
        setFavorite(res.data.isFavorite);
      }
    } catch (error) {
      console.error("Favorite toggle failed", error);
    }
  };

  /* =========================
      CLICK / LONG PRESS
  ========================= */
  const longPressHandlers = useLongPress(
    () => startSelection("files", _id),
    () => console.log("open file"),
    selectionMode
  );

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!selectionMode) {
      console.log("open file");
    }
  };

  /* =========================
        LIST LAYOUT
  ========================= */

if (layout === "list") {
  return (
    <div
      {...longPressHandlers}
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: "manipulation" }}
      className={`
        relative group flex items-center justify-between
        rounded-xl p-3 cursor-pointer
        border transition-all duration-200
        ${hoverBorder}
        ${
          isSelected
            ? "bg-black border-blue-500"
            : "bg-neutral-900/70 border-white/5"
        }
      `}
    >
      {/* Selection Indicator (NO SHIFT) */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-10 shadow-md">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* LEFT SIDE (UNCHANGED) */}
      <div className="flex items-center gap-4 min-w-0">
        {type === "image" && preview ? (
          <img
            src="/Container_edit.png"
            alt={name}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon size={22} className={color} />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {name}
          </p>
          <p className="text-xs text-neutral-400">
            {formatSize(size)}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleFavorite}
          className={`
            p-1 rounded-md transition -translate-y-0.5
            ${
              favorite
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }
          `}
        >
          <Star
            size={16}
            className={
              favorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-neutral-400"
            }
          />
        </button>

        <AdaptiveMenu file={file} />
      </div>
    </div>
  );
}
  /* =========================
        GRID LAYOUT
  ========================= */

  return (
    <div
      {...longPressHandlers}
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: "manipulation" }}
      className={`
        group relative rounded-2xl cursor-pointer
        border transition-all duration-200
        ${hoverBorder}
        ${
          isSelected
            ? "bg-black border-blue-500"
            : "bg-neutral-900/70 border-white/5"
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-3 left-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-10">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="relative h-40 flex items-center justify-center">
        {type === "image" && preview ? (
          <img
            src="/Container_edit.png"
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`p-4 rounded-xl ${bgColor}`}>
            <Icon size={40} className={color} />
          </div>
        )}

        <button
          onClick={handleFavorite}
          className={`
            absolute top-3 right-3 p-1.5 rounded-full
            bg-black/60 backdrop-blur
            ${
              favorite
                ? "opacity-100"
                : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
            }
          `}
        >
          <Star
            size={16}
            className={
              favorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-neutral-400"
            }
          />
        </button>
      </div>

      <div className="p-4 bg-neutral-950 rounded-b-2xl">
        <div className="flex justify-between">
          <p className="text-sm font-semibold text-white truncate">
            {name}
          </p>
          <AdaptiveMenu file={file} />
        </div>

        <p className="text-xs text-neutral-400">
          {formatSize(size)}
        </p>
      </div>
    </div>
  );
}