import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { useLayoutStore } from "../../store/useLayoutStore";

const FileLayoutButton = () => {
  const { layout, setLayout } = useLayoutStore();

  return (
    <div className="flex items-center bg-neutral-900 border border-neutral-800/50 rounded-lg p-1">
      
      {/* Grid Button */}
      <button
        onClick={() => setLayout("grid")}
        className={`p-1.5 rounded-md transition flex items-center justify-center
        ${
          layout === "grid"
            ? "bg-blue-500 text-white"
            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        }`}
      >
       <LayoutGrid size={16}/>
      </button>

      {/* List Button */}
      <button
        onClick={() => setLayout("list")}
        className={`p-1.5 rounded-md transition flex items-center justify-center
        ${
          layout === "list"
            ? "bg-blue-500 text-white"
            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        }`}
      >
        <List size={16} />
      </button>
      
    </div>
  );
};

export default FileLayoutButton;