import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ACTIONS } from "../../config/fileMenuActions";

import RenameModal from "../popups/RenameModel";
import InfoModal from "../popups/InfoModel";
import DeleteModal from "../popups/DeleteModel";

import { useFileStore } from "../../store/useFileStore";
import { useFolderStore } from "../../store/useFolderStore";

const MENU_HEIGHT = 260;

export default function AdaptiveMenu({ file }) {
  const { renameFile, deleteFile, downloadFile } = useFileStore();
  const { setMovingItems } = useFolderStore();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);

  /* single modal state */
  const [modal, setModal] = useState(null);

  const btnRef = useRef(null);

  /* Decide dropdown direction */
  useEffect(() => {
    if (!open || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    setOpenUp(spaceBelow < MENU_HEIGHT);
  }, [open]);

  /* ---------------- ACTION HANDLER ---------------- */

  const handleAction = async (action) => {
    setOpen(false);

    try {

      if (action === "move") {
        setMovingItems(file._id);
        toast.info("Select destination folder");
        return;
      }
      if (action === "rename") return setModal("rename");

      if (action === "detail") return setModal("info");

      if (action === "delete") return setModal("delete");

      /* Navigate to Preview Page */

      if (action === "preview") {
        navigate(`/preview/${file._id}`);
        return;
      }

      if (action === "download") {
        await downloadFile(file._id, file.name);
        return;
      }

    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- API ACTIONS ---------------- */

  const handleRename = async (fileId, newName) => {
    try {
      await renameFile(fileId, newName);

      toast.success("File renamed!");

    } catch (err) {
      console.error(err);
      toast.error("File Rename failed");
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);

      toast.success("File deleted!");

    } catch (err) {
      console.error(err);
      toast.error("File Delete failed");
    }
  };

  return (
    <>
      {/* ---------------- Desktop Backdrop ---------------- */}

      <AnimatePresence>
        {open && (
          <motion.div
            className="hidden md:block fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ---------------- Trigger Button ---------------- */}

      <div className="relative inline-block">
        <button
          ref={btnRef}
          onClick={() => setOpen((p) => !p)}
          className="text-neutral-400 p-0.5 rounded-full hover:bg-neutral-800 hover:text-white cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>

        {/* ---------------- Desktop Dropdown ---------------- */}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.18 }}
              className={`
                hidden md:block absolute right-0 z-50 w-44 p-3
                rounded-xl bg-neutral-950 overflow-hidden
                border border-white/10 shadow-2xl
                ${
                  openUp
                    ? "bottom-full mb-2 origin-bottom-right"
                    : "top-full mt-2 origin-top-right"
                }
              `}
            >
              {ACTIONS.map(({ id, label, icon: Icon, iconColor, danger }) => (
                <button
                  key={id}
                  onClick={() => handleAction(id)}
                  className={`
                    flex w-full items-center gap-3 px-4 py-2 text-sm
                    rounded-md transition-all
                    hover:bg-blue-400 hover:text-black
                    ${danger ? "text-red-400" : "text-neutral-200"}
                  `}
                >
                  <Icon size={17} className={iconColor} />
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- Rename Modal ---------------- */}

      <RenameModal
        open={modal === "rename"}
        onClose={() => setModal(null)}
        file={file}
        onRename={handleRename}
      />

      {/* ---------------- Info Modal ---------------- */}

      <InfoModal
        open={modal === "info"}
        onClose={() => setModal(null)}
        file={file}
      />

      {/* ---------------- Delete Modal ---------------- */}

      <DeleteModal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        file={file}
        onDelete={handleDelete}
      />

      {/* ---------------- Mobile Bottom Sheet ---------------- */}

      <AnimatePresence>
        {open && (
          <div className="md:hidden fixed inset-0 z-60">
            {/* Backdrop */}

            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}

            <motion.div
              className="
                absolute bottom-0 left-0 w-full
                rounded-t-2xl
                bg-neutral-950
                border-t border-white/10
                p-4
              "
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25 }}
            >
              {/* drag handle */}

              <div className="mx-auto mb-4 h-1 w-10 rounded bg-neutral-700" />

              <div className="divide-y divide-white/10">
                {ACTIONS.map(({ id, label, icon: Icon, iconColor, danger }) => (
                  <button
                    key={id}
                    onClick={() => handleAction(id)}
                    className={`
                      flex w-full items-center gap-4 py-3 text-sm
                      transition hover:bg-white/5
                      ${danger ? "text-red-400" : "text-neutral-300"}
                    `}
                  >
                    <Icon size={18} className={iconColor} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}