import express from "express";
import {
  userSignup,
  verifyEmail,
  logout,
  userLogin,
  forgotPassword,
  resetPassword,
  checkAuth,
  getUserSessions,
  terminateSession,
  UpdateProfile,
  uploadAvatar,
} from "../controllers/auth.controller.js";
import {upload} from "../services/upload.service.js"
import { verifyToken } from "../../../../middlewares/verify.middleware.js";

const routes = express.Router();

// Routes for users

routes.get("/check-auth", verifyToken, checkAuth);  // Check the user status (login or not)

routes.post("/signup", userSignup);  // Register the user 

routes.post("/verify-email", verifyEmail);  // verify your email

routes.post("/login", userLogin);  // login the user

routes.post("/logout", verifyToken, logout);  // logout the user

routes.post("/forgot-password", forgotPassword);  // change the password when user forget

routes.post("/reset-password/:token", resetPassword);  // reset the password by link

routes.get("/sessions", verifyToken, getUserSessions);  // list out the sessions

routes.delete("/sessions/:sessionId", verifyToken, terminateSession);  // delete a specific session

routes.put("/update-profile", verifyToken, UpdateProfile);  // update the user data

routes.post("/upload-avatar", verifyToken, upload.single("avatar"),uploadAvatar);  // upload the user avatar


export default routes;