import { useState } from "react";
import { Check, Trash2, FolderX, X, Move, ArrowDownToLine } from "lucide-react";
import { useFolderStore } from "../../store/useFolderStore";
import { useSelectionStore } from "../../store/useSelectionStore";
import { useFileStore } from "../../store/useFileStore";
import { toast } from "react-toastify";
import { downloadSelectedFilesAPI } from "../../api/folders.api";

import DeleteAllModal from "../popups/DeleteAllModel";

export default function SelectionBar({ files = [], folders = [], children }) {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { selected, selectionMode, selectAll, clearSelection } =
    useSelectionStore();

  const { deleteFolder, trashFolders, setMovingItems } = useFolderStore();

  /* =========================
      COUNTS
  ========================= */
  const selectedCount = selected.files.length + selected.folders.length;

  const allSelected =
    files.length === selected.files.length &&
    folders.length === selected.folders.length &&
    selectedCount > 0;

  /* =========================
      SELECT ALL
  ========================= */
  const toggleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(files, folders);
    }
  };

  /* =========================
      MOVE MULTIPLE FILES
  ========================= */
const handleMoveSelection = () => {
  if (selectedCount === 0) {
    toast.warning("No items selected");
    return;
  }

  const allIds = [...selected.folders, ...selected.files];

  setMovingItems(allIds);
  clearSelection();

  toast.info("Select destination folder", {
    theme: "dark",
  });
};

  /* =========================
      OPEN DELETE MODAL
  ========================= */
  const openDeleteModal = () => {
    if (selectedCount === 0) return;
    setShowDeleteModal(true);
  };

  /* =========================
      CONFIRM DELETE
  ========================= */
  const confirmDelete = async () => {
    setLoading(true);
    try {
      const allIds = [...selected.folders, ...selected.files];

      await deleteFolder(allIds);

      if (selected.files.length > 0) {
        const currentFiles = useFileStore.getState().files;

        useFileStore.setState({
          files: currentFiles.filter(
            (file) => !selected.files.includes(file._id),
          ),
        });
      }

      clearSelection();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
    setLoading(false);
  };

  /* =========================
      TRASH
  ========================= */
  const handleTrash = async () => {
    if (selectedCount === 0) return;

    setLoading(true);
    try {
      const allIds = [...selected.folders, ...selected.files];

      await trashFolders(allIds);

      if (selected.files.length > 0) {
        const currentFiles = useFileStore.getState().files;

        useFileStore.setState({
          files: currentFiles.map((file) =>
            selected.files.includes(file._id)
              ? { ...file, isDeleted: !file.isDeleted }
              : file,
          ),
        });
      }

      clearSelection();
    } catch (err) {
      console.error(err);
      toast.error("Trash failed");
    }
    setLoading(false);
  };

  /* =========================
      Download
  ========================= */

const handleDownload = async () => {
  if (selectedCount === 0) {
    toast.warning("No items selected");
    return;
  }

  setLoading(true);

  // Show loading toast
  toast.loading("Preparing files...", {
    toastId: "download-toast",
    theme: "dark",
  });

  try {
    const allIds = [...selected.folders, ...selected.files];

    await downloadSelectedFilesAPI(allIds);

    // Remove loading toast
    toast.dismiss("download-toast");

    toast.success("Download started", {
      theme: "dark",
    });

    clearSelection();
  } catch (err) {
    console.error(err);

    // Remove loading toast
    toast.dismiss("download-toast");

    toast.error("Download failed", {
      theme: "dark",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {children}

      {/* SELECTION BAR */}
      <div
        className={`
          fixed bottom-0 left-0 w-full md:w-auto md:left-1/2 md:-translate-x-1/2
          z-100 transition-all duration-300 ease-out
          ${
            selectionMode
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }
        `}
      >
        <div
          className="
            flex items-center justify-between md:justify-center
            gap-3 md:gap-4
            px-4 py-3 md:px-6 md:py-3
            w-full md:w-auto
            bg-neutral-900/90 md:bg-neutral-900/80
            backdrop-blur-xl
            border-t md:border border-white/10
            rounded-t-2xl md:rounded-2xl
            shadow-[0_-5px_30px_rgba(0,0,0,0.6)] md:shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          "
        >
          {/* COUNT */}
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm md:text-base">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {selectedCount}
            <span className="hidden sm:inline"> selected</span>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* SELECT ALL */}
            <button
              onClick={toggleSelectAll}
              disabled={loading}
              className={`
                flex items-center gap-1 md:gap-2
                px-2 py-1.5 md:px-3 md:py-1.5
                rounded-lg text-xs md:text-sm
                transition
                ${
                  allSelected
                    ? "bg-blue-500/20 text-blue-400"
                    : "hover:bg-white/5 text-neutral-300"
                }
              `}
            >
              <Check size={16} />
              <span className="hidden md:inline">
                {allSelected ? "Deselect" : "All"}
              </span>
            </button>

            {/* DOWNLOAD */}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="
              flex items-center gap-1 md:gap-2
              px-2 py-1.5 md:px-3 md:py-1.5
              rounded-lg text-xs md:text-sm
              text-green-400 hover:bg-green-500/10 transition
              disabled:opacity-50
            "
            >
              <ArrowDownToLine size={18} />
              <span className="hidden md:inline">
                {loading ? "Preparing..." : "Download"}
              </span>
            </button>

            {/* MOVE */}
            <button
              onClick={handleMoveSelection}
              disabled={loading}
              className="
                flex items-center gap-1 md:gap-2
                px-2 py-1.5 md:px-3 md:py-1.5
                rounded-lg text-xs md:text-sm
                text-purple-400 hover:bg-purple-500/10 transition
                disabled:opacity-50
              "
            >
              <Move size={18} />
              <span className="hidden md:inline">Move</span>
            </button>

            {/* TRASH */}
            <button
              onClick={handleTrash}
              disabled={loading}
              className="
                flex items-center gap-1 md:gap-2
                px-2 py-1.5 md:px-3 md:py-1.5
                rounded-lg text-xs md:text-sm
                text-yellow-400 hover:bg-yellow-500/10 transition
                disabled:opacity-50
              "
            >
              <FolderX size={20} />
              <span className="hidden md:inline">
                {loading ? "Processing..." : "Trash"}
              </span>
            </button>

            {/* DELETE */}
            <button
              onClick={openDeleteModal}
              disabled={loading}
              className="
                flex items-center gap-1 md:gap-2
                px-2 py-1.5 md:px-3 md:py-1.5
                rounded-lg text-xs md:text-sm
                text-red-400 hover:bg-red-500/10 transition
                disabled:opacity-50
              "
            >
              <Trash2 size={20} />
              <span className="hidden md:inline">Delete</span>
            </button>

            {/* CLEAR */}
            <button
              onClick={clearSelection}
              disabled={loading}
              className="
                p-2 rounded-lg
                hover:bg-white/10 transition
                text-neutral-400
                disabled:opacity-50
              "
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <DeleteAllModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        loading={loading}
        count={selectedCount}
      />
    </>
  );
}
