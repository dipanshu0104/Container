import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { useFileStore } from "../../store/useFileStore";
import UploadProgressBar from "../files/UploadProgressBar";

const DragAndDrop = () => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useFileStore((state) => state.uploadFiles);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFiles = async (files) => {
    if (!files.length) return;

    setUploading(true);

    await uploadFiles(files);

    setUploading(false);
  };

  return (
    <>
      <div
        onClick={openFilePicker}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);

          const files = Array.from(e.dataTransfer.files);
          await handleFiles(files);
        }}
        className={`
          relative mt-1
          w-full
          cursor-pointer
          rounded-2xl
          border-2 border-dashed
          transition-all duration-400 ease-in-out
          hover:border-blue-500
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/5 scale-101"
              : "border-gray-500/20"
          }
          px-4 py-10 sm:py-10
          flex flex-col items-center justify-center
          text-center
        `}
      >
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 pointer-events-none">
          <UploadCloud className="text-neutral-400" size={26} />
        </div>

        {/* Text */}
        <h3 className="text-base sm:text-lg font-semibold text-white pointer-events-none">
          Drag and drop files here
        </h3>

        <p className="mt-1 text-sm text-neutral-400 pointer-events-none">
          or click to browse from your computer
        </p>

        {/* Button */}
        <button
          type="button"
          className="
            mt-5
            rounded-lg
            border border-white/10
            px-4 py-2
            text-sm font-medium text-white
            hover:bg-white/10
            transition
            pointer-events-none
          "
        >
          {uploading ? "Uploading..." : "Browse Files"}
        </button>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            await handleFiles(files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Progress bars */}
      <UploadProgressBar />
    </>
  );
};

export default DragAndDrop;