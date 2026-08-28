import { useState, useEffect, useMemo } from "react";
import { FolderPlus } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useFolderStore } from "../store/useFolderStore";
import { useFileStore } from "../store/useFileStore";
import useSocket from "../hooks/useSocket";

import FileCard from "../components/files/FileCard";
import UploadButton from "../components/files/UploadButton";
import FolderCard from "../components/folders/FolderCard";
import Breadcrumb from "../components/folders/Breadcrumb";
import SelectionBar from "../components/files/SelectionBar";

import FolderModal from "../components/popups/FolderModal";

export default function MyFiles() {
  // to highlight the search file
  const location = useLocation();
  const highlightFileId = location.state?.highlightFileId;
  const highlightFolderId = location.state?.highlightFolderId;

  const { folderId } = useParams();
  const navigate = useNavigate();

  const targetParent = folderId || "root";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  //  Folder store
  const folders = useFolderStore((s) => s.folders);
  const currentFolder = useFolderStore((s) => s.currentFolder);
  const getFolders = useFolderStore((s) => s.getFolders);
  const getChoiceFolder = useFolderStore((s) => s.getChoiceFolder);
  const createFolder = useFolderStore((s) => s.createFolder);

  //  File store
  const files = useFileStore((s) => s.files);
  const getFiles = useFileStore((s) => s.getFiles);

  /* =========================
      LOAD DATA
  ========================= */
  useEffect(() => {
    getFiles();
    getFolders();

    if (folderId) {
      getChoiceFolder(folderId);
    }
  }, [folderId, getFiles, getFolders, getChoiceFolder]);

  /* =========================
      SOCKET CONNECT (BACKGROUND)
  ========================= */
  useSocket({
    "file:list:updated": async () => {
      await getFiles();
      await getFolders();

      if (folderId) {
        await getChoiceFolder(folderId);
      }
    },
  });

  // for auto scroll for the search file and folder
  useEffect(() => {
    if (!highlightFileId) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(highlightFileId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100); // small delay ensures DOM rendered

    return () => clearTimeout(timeout);
  }, [highlightFileId]);

  useEffect(() => {
    if (!highlightFolderId) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(highlightFolderId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [highlightFolderId]);

  /* =========================
      CREATE FOLDER
  ========================= */
  const handleCreateFolder = async (name, color) => {
    setCreating(true);

    await createFolder(name, targetParent, color); // pass color

    setCreating(false);
    setIsModalOpen(false);

    if (folderId) {
      await getChoiceFolder(folderId);
    } else {
      await getFolders();
    }
  };

  /* =========================
      FILTER DATA
  ========================= */
  const visibleFolders = useMemo(() => {
    return folders
      .filter((f) => f.parent_Id === targetParent && !f.isDeleted)
      .map((folder) => {
        const childFolders = folders.filter(
          (f) => f.parent_Id === folder._id && !f.isDeleted,
        );

        const childFiles = files.filter(
          (file) => file.parent_Id === folder._id && !file.isDeleted,
        );

        return {
          ...folder,
          totalItems: childFolders.length + childFiles.length,
        };
      });
  }, [folders, files, targetParent]);

  const visibleFiles = useMemo(() => {
    return files.filter(
      (file) => file.parent_Id === targetParent && !file.isDeleted,
    );
  }, [files, targetParent]);

  return (
    <div className="w-full h-screen px-4 md:px-6 py-6 text-white overflow-auto custom-scrollbar">
      {/* 🔹 Breadcrumb */}
      <div className="mb-3">
        <Breadcrumb folderId={folderId} folders={folders} />
        <div className="mt-2 border-b border-neutral-800"></div>
      </div>

      {/* 🔹 Title + Actions */}
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-semibold">
          {currentFolder?.name ||
            folders.find((f) => f._id === folderId)?.name ||
            "Home"}
        </h1>

        <div className="flex items-center gap-2">
          {/* New Folder */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-lg
              border border-neutral-700
              bg-black hover:bg-neutral-800
              text-white text-sm font-medium
              transition
            "
          >
            <FolderPlus size={20} />
            <span className="hidden md:inline-block">New Folder</span>
          </button>

          {/* Upload */}
          <UploadButton folderId={targetParent} />
        </div>
      </div>

      {/*  Selection Bar (GLOBAL) */}
      <SelectionBar files={visibleFiles} folders={visibleFolders} />

      {/*  Folders */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Folders</h2>

        {visibleFolders.length === 0 ? (
          <p className="text-neutral-400 text-sm">No folders</p>
        ) : (
          <div
            className="
              grid gap-4
              grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            "
          >
            {visibleFolders.map((folder) => (
              <div
                key={folder._id}
                id={folder._id}
                className="relative transition-all duration-300 rounded-xl"
              >
                {highlightFolderId === folder._id && (
                  <span className="absolute top-2 left-2 flex h-3 w-3 z-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
                <FolderCard
                  folder={folder}
                  onClick={() => navigate(`/MyFiles/${folder._id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/*  Files */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Files</h2>

        {visibleFiles.length === 0 ? (
          <p className="text-neutral-400 text-sm">No files</p>
        ) : (
          <div
            className="
              grid gap-4
              grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            "
          >
            {visibleFiles.map((file) => (
              <div
                key={file._id}
                id={file._id}
                className="relative transition-all duration-300 rounded-xl"
              >
                {highlightFileId === file._id && (
                  <span className="absolute top-2 left-2 flex h-3 w-3 z-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
                <FileCard file={file} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/*  Folder Modal */}
      <FolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFolder}
        loading={creating}
      />
    </div>
  );
}
