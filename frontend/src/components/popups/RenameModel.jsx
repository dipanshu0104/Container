import { useEffect, useState } from "react";
import { Pencil, Check } from "lucide-react";
import Modal from "./Model";

const RenameModal = ({ open, onClose, file, onRename }) => {

  const [name, setName] = useState("");

  useEffect(() => {
    if (file) setName(file.name);
  }, [file]);

  const handleRename = () => {

    if (!name.trim()) return;

    onRename(file._id, name);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Rename File">

      <div className="space-y-5">

        <div className="relative">

          <Pencil size={16} className="absolute left-3 top-3 text-neutral-400" />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full pl-9 pr-3 py-2.5
              bg-neutral-900 border border-neutral-700
              rounded-md text-sm text-neutral-200
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            "
          />

        </div>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-neutral-800 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleRename}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md"
          >
            <Check size={16} />
            Rename
          </button>

        </div>

      </div>

    </Modal>
  );
};

export default RenameModal;