import api from "./api";

export const checkAuthAPI = () => api.get("/auth/check-auth");  // check authentication system 

export const signupAPI = (data) => api.post("/auth/signup", data);  // signup the user

export const verifyAPI = (code) => api.post("/auth/verify-email", {code});  // verify the user email

export const loginAPI = (data) => api.post("/auth/login", data);  // login the user

export const logoutAPI = () => api.post("/auth/logout");  // logout the user

export const forgotPassAPI = (data) => api.post("/auth/forgot-password", data);  // change password when forgot

export const resetPassAPI = (token, password) => api.post(`/auth/reset-password/${token}`, { password });  // reset the password

export const getSessionAPI = () => api.get("/auth/sessions"); // get all active session of the user

export const deleteSessionAPI = (data) => api.delete(`/auth/sessions/${data}`);  // delete a session

export const updateProfileAPI = (data) => api.put("/auth/update-profile", data);  // update the user profile

export const uploadAvatarAPI = (data) => api.post("/auth/upload-avatar", data);  // upload avatar of the user



