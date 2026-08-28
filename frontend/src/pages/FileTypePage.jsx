import React, { useState, useEffect } from "react";
import { Inbox } from "lucide-react";

import { useCategoriesFiles } from "../hooks/useCategoriesFiles";

import FileCard from "../components/files/FileCard";
import FileSorter from "../components/files/FileSorter";
import SelectionBar from "../components/files/SelectionBar";

const FileTypePage = ({ category, title }) => {
  const files = useCategoriesFiles(category);

  const [sortedFiles, setSortedFiles] = useState([]);

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
            {sortedFiles.length}{" "}
            {sortedFiles.length === 1 ? "file" : "files"}
          </p>
        </div>

        {files.length > 0 && (
          <FileSorter files={files} onSorted={setSortedFiles} />
        )}
      </div>

      {/*  UPDATED SELECTION BAR */}
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

export default FileTypePage;