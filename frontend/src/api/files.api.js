import api from "./api";

// Get all files
export const getFilesAPI = () => api.get("/files");

// Preview file
export const previewFileAPI = (id) => api.get(`/files/preview/${id}`, { responseType: "blob",});

// Download single file
export const downloadFileAPI = (id) => api.get(`/files/download/${id}`, { responseType: "blob",});

// Upload multiple files
export const uploadFilesAPI = (formData, parentId, onUploadProgress) => {
  formData.append("parentId", parentId || "root");

  return api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};


   // RENAME FILE
export const renameFileAPI = (id, newName) => api.put(`/files/rename/${id}`, { newName: newName });


// Delete single file
export const deleteFileAPI = (id) => api.delete(`/files/delete/${id}`);



   // DOWNLOAD MULTIPLE FILES
export const downloadSelectedAPI = (fileIds) =>api.post("/files/download-all", { fileIds }, {responseType: "blob",});


   // DELETE MULTIPLE FILES
export const deleteSelectedAPI = (fileIds) => api.post("/files/delete-all", { fileIds });


   // FAVORITE FILE
export const toggleFavoriteAPI = (id) => api.post("/files/set-favorite", { id });


   // TOGGLE TRASH
export const toggleTrashFileAPI = (id) => api.patch(`/files/trash/${id}`);



   // MOVE / COPY FILES
export const moveFilesAPI = (data) => api.post("/files/move", data);