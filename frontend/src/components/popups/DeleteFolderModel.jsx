import { useEffect } from "react";
import Modal from "./Model";
import {
  Folder,
  Trash2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export default function DeleteFolderModel({
  isOpen,
  onClose,
  onDelete,
  folder,
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Enter") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  if (!folder) return null;

  const color = folder.color || "#EF4444";

  const handleDelete = async () => {
    await onDelete(folder._id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Folder"
    >
      <div className="flex flex-col gap-6 p-1">

        {/* Preview */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl border bg-neutral-900/50"
          style={{
            borderColor: `${color}30`,
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${color}20`,
            }}
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

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Folder
            </p>

            <h3 className="text-white text-lg font-semibold truncate">
              {folder.name}
            </h3>

            <p className="text-xs text-neutral-400 mt-1">
              {folder.totalItems || 0} items inside
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-3 p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
          <div className="mt-0.5">
            <AlertTriangle
              size={18}
              className="text-red-400"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-300">
              This action cannot be undone
            </h4>

            <p className="text-xs leading-relaxed text-neutral-400">
              Deleting this folder will permanently remove
              all files and subfolders inside it.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            style={{
              backgroundColor: "#EF4444",
              boxShadow: "0 10px 20px -10px rgba(239,68,68,0.5)",
            }}
          >
            {loading ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 size={16} />
                Delete Folder
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}