import React, { useState, useEffect } from "react";
import { Inbox } from "lucide-react";

import { useFilteredFiles } from "../hooks/useFilteredFiles";
import FileCard from "../components/files/FileCard";
import FileSorter from "../components/files/FileSorter";
import SelectionBar from "../components/files/SelectionBar";

const FileCategoryPage = ({ category, title }) => {
  const files = useFilteredFiles(category);

  const [sortedFiles, setSortedFiles] = useState(files);

  useEffect(() => {
    setSortedFiles(files);
  }, [files]);

  return (
    <div className="p-6 overflow-auto custom-scrollbar h-full bg-black">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>

          <p className="text-sm text-neutral-400 mt-1">
            All your {category.charAt(0).toUpperCase() + category.slice(1)} (
            {sortedFiles.length}{" "}
            {sortedFiles.length === 1 ? "file" : "files"})
          </p>
        </div>

        {files.length > 0 && (
          <FileSorter files={files} onSorted={setSortedFiles} />
        )}
      </div>

      {/*  UPDATED SELECTION BAR USAGE */}
      <SelectionBar files={sortedFiles} folders={[]}>
        
        {/* EMPTY STATE */}
        {sortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-neutral-700 h-2/3">
            <Inbox size={60}/>
            <p className="font-semibold">No files</p>
          </div>
        ) : (
          /* FILE GRID */
          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {sortedFiles.map((file) => (
              <FileCard
                key={file._id}
                file={file}
              />
            ))}
          </div>
        )}
      </SelectionBar>
    </div>
  );
};

export default FileCategoryPage;