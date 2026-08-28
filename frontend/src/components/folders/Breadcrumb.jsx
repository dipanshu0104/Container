import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { House, ChevronRight, ArrowLeft } from "lucide-react";

export default function Breadcrumb({ folderId, folders }) {
  const navigate = useNavigate();

  const path = useMemo(() => {
    if (!folderId) return [];

    const map = new Map();
    folders.forEach((f) => map.set(f._id, f));

    const result = [];
    let currentId = folderId;

    while (currentId && currentId !== "root") {
      const folder = map.get(currentId);
      if (!folder) break;

      result.unshift(folder);
      currentId = folder.parent_Id;
    }

    return result;
  }, [folderId, folders]);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 flex-wrap">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition"
        >
          <ArrowLeft size={16} className="text-neutral-300" />
          <span className="text-sm text-neutral-300 hidden sm:inline">
            Back
          </span>
        </button>

        {/* HOME */}
        <button
          onClick={() => navigate("/MyFiles")}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition"
        >
          <House size={16} className="text-neutral-300" />
          <span className="text-sm text-neutral-300 hidden sm:inline">
            Home
          </span>
        </button>

        {/* PATH */}
        {path.map((folder, index) => {
          const isLast = index === path.length - 1;
          const folderColor = folder.color || "#3B82F6";

          return (
            <div key={folder._id} className="flex items-center gap-2">
              {/* Separator */}
              <ChevronRight size={16} className="text-neutral-500" />

              {/* Folder */}
              <button
                onClick={() => navigate(`/MyFiles/${folder._id}`)}
                className={`
                  px-2 py-1 rounded-lg text-sm
                  truncate max-w-30 md:max-w-50
                  transition
                  ${
                    isLast
                      ? "font-medium"
                      : "text-neutral-300 hover:bg-white/10 hover:text-white"
                  }
                `}
                style={
                  isLast
                    ? {
                        backgroundColor: folderColor + "20",
                        color: folderColor,
                      }
                    : {}
                }
              >
                {folder.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}