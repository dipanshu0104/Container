import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FileCard from "../files/FileCard";
import FileLayoutButton from "../main/FileLayoutButton";
import SelectionBar from "../files/SelectionBar";

export default function RecentFiles({ files = [], limit = 12 }) {

  const navigate = useNavigate();

  // Remove deleted files
  const filteredFiles = useMemo(() => {
    return files.filter((file) => !file.isDeleted);
  }, [files]);

  // Apply limit
  const limitedFiles = useMemo(() => {
    return filteredFiles.slice(0, limit);
  }, [filteredFiles, limit]);

  return (
    <section className="w-full py-5">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Recent Files
        </h2>

        <div className="flex items-center gap-2">
          <FileLayoutButton />
          <button 
          className="text-neutral-400 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white"
          onClick={()=>navigate("/Recent")}
          >
            View All
          </button>
        </div>
      </div>

      {/*  Wrap content with SelectionBar */}
      <SelectionBar files={limitedFiles} folders={[]}>
        {limitedFiles.length === 0 ? (
          <p className="text-sm text-neutral-400">No recent files</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {limitedFiles.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        )}
      </SelectionBar>
    </section>
  );
}