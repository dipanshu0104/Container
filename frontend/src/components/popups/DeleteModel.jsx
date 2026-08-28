import Model from "./Model";
import { AlertTriangle, Trash2 } from "lucide-react";
import { getFileIconConfig } from "../../utils/fileIconUtil";

const DeleteModal = ({ file, open, onClose, onDelete }) => {

  const { icon: Icon, color, bgColor } = getFileIconConfig(file.mimeType);

  if (!file) return null;

  const handleDelete = () => {
    onDelete(file._id);
    onClose();
  };

  return (
    <Model isOpen={open} onClose={onClose} title="Delete File" width="max-w-md">

      <div className="space-y-6">
        <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">

          <div className={`w-10 h-10 flex items-center justify-center rounded-md ${bgColor}`}>
            <Icon size={20} className={color} />
          </div>

          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-white">
              {file.name}
            </p>
            <p className="text-xs text-gray-400">
              {file.mimeType || "Unknown file"}
            </p>
          </div>

        </div>

        <div className="flex items-start gap-3 text-sm text-gray-300">

          <AlertTriangle size={18} className="text-red-400 mt-0.5" />

          <p>
            Are you sure you want to delete
            <span className="text-red-400 font-medium"> {file.name}</span> ?
          </p>

        </div>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-neutral-800 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-md"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>

    </Model>
  );
};

export default DeleteModal;