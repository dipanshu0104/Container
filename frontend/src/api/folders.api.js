import api from "./api";

// 1) Get all folders
export const getFoldersAPI = () => api.get("/folders");

// 2) Get folders inside a parent folder
export const getChoiceFolderAPI = (id) =>
  api.get(`/folders/${id}`);

// 3) Create folder
export const createFolderAPI = (folderName, parentId, color) =>
  api.post("/folders/create", { folderName, parentId, color });

// 4) Edit folder
export const editFolderAPI = (id, newName, color) =>
  api.put(`/folders/edit/${id}`, {
    newName,
    color,
  });

// 5) Delete folders (bulk)
export const deleteFolderAPI = (ids) =>
  api.delete("/folders/delete", { data: { ids } });

// 6) Trash folders (bulk toggle)
export const trashFoldersAPI = (ids) =>
  api.patch("/folders/trash", { ids });


// 7) Download selected files & folders (bulk)
export const downloadSelectedFilesAPI = async (ids) => {
  const response = await api.post(
    "/folders/download",
    { ids },
    {
      responseType: "blob", // important for zip
    }
  );

  // Create blob link and trigger download
  const blob = new Blob([response.data], {
    type: "application/zip",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Files.zip";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

// 8) Move selected files & folders (bulk + recursive)
export const moveItemsAPI = (ids, destinationId) =>
  api.patch("/folders/move", {
    ids,
    destinationId,
  });