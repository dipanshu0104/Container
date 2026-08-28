import { Folder, MoveDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AdaptiveFolderMenu from "./AdaptiveFolderMenu";

import { useSelectionStore } from "../../store/useSelectionStore";
import { useLayoutStore } from "../../store/useLayoutStore";
import { useLongPress } from "../../hooks/useLongPress";
import { useFileStore } from "../../store/useFileStore";
import { useFolderStore } from "../../store/useFolderStore";

export default function FolderCard({ folder }) {
  const navigate = useNavigate();

  const { _id, name, totalItems, files, folders, updatedAt, createdAt, color } =
    folder;
  const itemCount = totalItems ?? (files?.length || 0) + (folders?.length || 0);

  const { selected, selectionMode, startSelection } = useSelectionStore();
  const { layout } = useLayoutStore();
  const { movingItems, moveItems } = useFolderStore();

  const isMovingMode = movingItems?.isMoving;

  const isSelected = selected.folders.includes(_id);
  const folderColor = color || "#3B82F6";

  const isGrid = layout === "grid";

  /* ================= HANDLERS ================= */

  const handleOpenFolder = () => {
    if (selectionMode) return;
    navigate(`/MyFiles/${_id}`);
  };

  const handleConfirmMove = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (movingItems?.ids?.includes(_id)) {
      toast.error("Cannot move a folder into itself");
      return;
    }

    const result = await moveItems(_id);
    if (result?.success) {
      toast.success(`Moved into ${name}`);
    }
  };

  const longPressHandlers = useLongPress(
    () => startSelection("folders", _id),
    handleOpenFolder,
    selectionMode,
  );

  return (
    <div
      {...longPressHandlers}
      style={{
        touchAction: "manipulation",
        borderColor: isSelected
          ? folderColor
          : isMovingMode
            ? "#3B82F6"
            : undefined,
      }}
      className={`
        relative cursor-pointer group transition-all duration-200
        border rounded-xl
        overflow-visible  

        ${
          isSelected
            ? "bg-opacity-10"
            : "bg-neutral-950 border-white/10 hover:bg-neutral-800"
        }

        ${isMovingMode ? "border-blue-500/50 border-dashed" : ""}

        ${
          isGrid
            ? "p-4 flex flex-col items-start gap-3"
            : "p-4 flex items-center gap-4"
        }
      `}
    >
      {/* ================= MOVE BUTTON ================= */}
      {isMovingMode && (
        <button
          onClick={handleConfirmMove}
          className="absolute top-2 right-2 z-30 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
        >
          <MoveDown size={12} />
        </button>
      )}

      {/* ================= MENU ================= */}
      {!isMovingMode && (
        <div
          data-no-longpress
          className="
           absolute top-3 right-3
           transition-opacity duration-200
          "
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <AdaptiveFolderMenu folder={folder} />
        </div>
      )}

      {/* ================= SELECTION ================= */}
      {isSelected && (
        <div
          className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center z-10"
          style={{ backgroundColor: folderColor }}
        >
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

      {/* ================= ICON ================= */}
      <div
        className={`
          flex items-center justify-center shrink-0 rounded-xl
          ${isGrid ? "w-14 h-14" : "w-12 h-12"}
        `}
        style={{
          backgroundColor: folderColor + "20",
        }}
      >
        <Folder
          className={isGrid ? "w-10 h-10" : "w-8 h-8"}
          style={{
            fill: folderColor,
            stroke: isSelected ? "none" : folderColor,
          }}
        />
      </div>

      {/* ================= INFO ================= */}
      <div className={`flex flex-col min-w-0 ${isGrid ? "w-full" : ""}`}>
        <h3
          className={`
            text-white font-medium truncate
            ${isGrid ? "text-sm" : "text-base"}
          `}
        >
          {name}
        </h3>

        <p className="text-xs text-neutral-400 mt-1">
          {itemCount} items • {formatTime(updatedAt || createdAt)}
        </p>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */

function formatTime(date) {
  if (!date) return "recently";

  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}
