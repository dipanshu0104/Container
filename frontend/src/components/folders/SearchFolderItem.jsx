import React from "react";
import { useNavigate } from "react-router-dom";
import { Folder } from "lucide-react";

export default function SearchFolderItem({ folder, compact = false, onSelect }) {
  const navigate = useNavigate();

  const folderColor = folder.color || "#3B82F6";
  const parentId = folder.parent_Id || "root";

  const handleClick = () => {
    onSelect?.();
    navigate(`/MyFiles/${parentId === "root" ? "" : parentId}`, {
      state: { highlightFolderId: folder._id },
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center gap-3
        ${compact ? "px-2 py-2" : "px-3 py-2"}
        hover:bg-neutral-800
        cursor-pointer
        ${compact ? "rounded" : ""}
      `}
    >
      <div className="p-2 rounded-lg" style={{ backgroundColor: folder.color + "20", }}>
        <Folder size={18} style={{ fill: folder.color, stroke: folder.color, }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">
          {folder.name}
        </p>
        <p className="text-xs text-neutral-400">
          Folder
        </p>
      </div>
    </div>
  );
}