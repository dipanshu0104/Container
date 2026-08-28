import { useState } from "react";
import { Plus } from "lucide-react";
import { useFileStore } from "../../store/useFileStore";
import UploadProgressBar from "./UploadProgressBar";

const UploadButton = ({ folderId = "root" }) => {
  const uploadFiles = useFileStore((state) => state.uploadFiles);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    setUploading(true);

    // ✅ use prop
    await uploadFiles(selectedFiles, folderId);

    setUploading(false);
    event.target.value = "";
  };

  return (
    <div className="relative">
      <label className="cursor-pointer">
        <div
          className="
            bg-blue-500 hover:bg-blue-600
            px-4 py-2 rounded-lg
            text-sm font-semibold
            flex items-center gap-1
            transition
          "
        >
          <Plus size={18} />
          <span className="hidden md:block">
            {uploading ? "Uploading..." : "Upload"}
          </span>
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      <UploadProgressBar />
    </div>
  );
};

export default UploadButton;