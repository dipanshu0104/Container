import api from "./api";

// 1) Get all drives
export const getDrivesAPI = () => api.get("/drives");

// 2) Create / set a drive
export const createDriveAPI = (data) => api.post("/drives", data);

// 3) Toggle active drive
export const toggleActiveDriveAPI = (id) =>
  api.patch(`/drives/set-active/${id}`);

// 4) Rename a drive
export const renameDriveAPI = (id, name) =>
  api.put(`/drives/${id}/rename`, { name });

// 5) Delete a drive
export const deleteDriveAPI = (id) =>
  api.delete(`/drives/${id}`);

// 6) System health check
export const getDriveHealthAPI = () =>
  api.get("/drives/health");

// 7) System storage summary
export const getStorageStatusAPI = () =>  api.get("/drives/summary");
