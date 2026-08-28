import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Pencil, Move, Trash2, Trash } from "lucide-react";
import { toast } from "react-toastify";

import EditModel from "../popups/EditModel";
import DeleteFolderModel from "../popups/DeleteFolderModel";

import { useFolderStore } from "../../store/useFolderStore";

const MENU_HEIGHT = 220;

const ACTIONS = [
  {
    id: "edit",
    label: "Edit",
    icon: Pencil,
    iconColor: "text-green-500",
  },

  {
    id: "move",
    label: "Move",
    icon: Move,
    iconColor: "text-purple-500",
  },

  {
    id: "trash",
    label: "Trash",
    icon: Trash,
    iconColor: "text-yellow-500",
  },
  {
    id: "delete",
    label: "Delete",
    icon: Trash2,
    iconColor: "text-red-500",
    danger: true,
  },
];

export default function AdaptiveFolderMenu({ folder }) {
  const {
    editFolder,
    deleteFolder,
    MoveItems,
    setMovingItems,
    moveItems,
    movingItems,
    cancelMove,
  } = useFolderStore();

  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [modal, setModal] = useState(null);

  const btnRef = useRef(null);

  useEffect(() => {
    if (!open || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    setOpenUp(spaceBelow < MENU_HEIGHT);
  }, [open]);

  const handleAction = (action) => {
    setOpen(false);

    if (action === "edit") return setModal("edit");
    if (action === "delete") return setModal("delete");

    if (action === "move") {
      setMovingItems([folder._id]);
      toast.info("Select destination folder");
    }
  };

  const handleEdit = async (id, newName, color) => {
    try {
      await editFolder(id, newName, color);
      toast.success("Folder edited");
    } catch {
      toast.error("Edit failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFolder([id]);
      toast.success("Folder deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleMoveHere = async () => {
    const res = await moveItems(folder._id);

    if (res.success) {
      toast.success("Moved successfully");
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="hidden md:block fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* BUTTON */}
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="
          text-neutral-400 p-1 rounded-full hover:text-white transition
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          hover:bg-neutral-700
        "
      >
        <MoreVertical size={16} />
      </button>

      {/* DESKTOP MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={`
              hidden md:block absolute right-0 z-50 w-44 p-3
              rounded-xl bg-neutral-950 overflow-hidden
              border border-white/10 shadow-2xl
              ${openUp ? "bottom-full mb-2" : "top-full mt-2"}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
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

      {/* MODALS */}
      <EditModel
        isOpen={modal === "edit"}
        onClose={() => setModal(null)}
        folder={folder}
        onSubmit={handleEdit}
      />

      <DeleteFolderModel
        isOpen={modal === "delete"}
        onClose={() => setModal(null)}
        folder={folder}
        onDelete={handleDelete}
      />

      {/* ================= MOBILE BOTTOM SHEET (UPDATED) ================= */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden fixed inset-0 z-100">
            {/* BACKDROP */}
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* SHEET */}
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
              {/* DRAG HANDLE */}
              <div className="mx-auto mb-4 h-1 w-10 rounded bg-neutral-700" />

              {/* ACTION LIST */}
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
