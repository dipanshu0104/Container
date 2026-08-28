import { Trash2, AlertTriangle } from "lucide-react";
import Model from "./Model"; // adjust path if needed

export default function DeleteAllModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  count,
}) {
  return (
    <Model isOpen={isOpen} onClose={onClose} title="Delete Items">
      <div className="flex flex-col gap-5">
        {/* ICON + MESSAGE */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertTriangle className="text-red-400" size={22} />
          </div>

          <div>
            <p className="text-sm text-neutral-300">
              Are you sure you want to permanently delete{" "}
              <span className="text-white font-semibold">
                {count} item{count > 1 ? "s" : ""}
              </span>
              ?
            </p>

            <p className="text-xs text-neutral-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg text-sm
              bg-white/5 hover:bg-white/10
              text-neutral-300 transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-lg text-sm
              bg-red-500 hover:bg-red-600
              text-white transition
              disabled:opacity-50
            "
          >
            <Trash2 size={16} />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Model>
  );
}