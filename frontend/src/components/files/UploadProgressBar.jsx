import { motion, AnimatePresence } from "framer-motion";
import useUploadStore from "../../store/useUploadStore";

const UploadProgressBar = () => {
  const { uploadingFiles } = useUploadStore();

  if (uploadingFiles.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-3 w-72 space-y-3 z-50">
      <AnimatePresence>
        {uploadingFiles.map((file) => (
          <motion.div
            key={file.filename}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-950 p-3 rounded-lg border border-neutral-900 relative shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
          >
            <div className="text-sm text-white font-medium truncate">
              {file.filename}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded mt-2">
              <motion.div
                className="h-2 rounded bg-blue-500"
                animate={{ width: `${file.progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-right text-gray-500 mt-1">
              {file.progress}%
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UploadProgressBar;