import React from "react";
import { useNavigate } from "react-router-dom";
import { getFileIconConfig } from "../../utils/fileIconUtil";
import { formatSize } from "../../utils/formatters"

export default function SearchFileItem({ file, compact = false, onSelect }) {
  const navigate = useNavigate();
  const { icon: Icon, color, bgColor } = getFileIconConfig(file.mimeType);

  const handleClick = () => {
    onSelect?.();
    navigate(`/MyFiles/${file.parent_Id}`, {
      state: { highlightFileId: file._id },
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
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon size={18} className={color} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">
          {file.name}
        </p>
        <p className="text-xs text-neutral-400">
          {formatSize(file.size)}
        </p>
      </div>
    </div>
  );
}