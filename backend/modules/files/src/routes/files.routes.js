import { Router } from "express";
import {
  getFiles,
  uploadFiles,
  previewFile,
  downloadFile,
  renameFile,
  deleteFile,
  downloadSelected,
  deleteSelected,
  toggleFavorite,
  toggleTrashFile,
  copyFiles
} from "../controllers/files.controller.js";
import {upload} from "../services/upload.service.js";
import { verifyToken } from "../../../../middlewares/verify.middleware.js";

const router = Router();

//File Routes

router.get("/", verifyToken, getFiles); // Route to get files

router.post("/upload", verifyToken, upload.array("files"), uploadFiles); //route for upload files

router.get("/preview/:id", verifyToken, previewFile); // Route to preview file

router.get("/download/:id", verifyToken, downloadFile); // Route for download the file

router.put("/rename/:id", verifyToken, renameFile); // Route for rename file

router.delete("/delete/:id", verifyToken, deleteFile); // Route to delete a file

router.post("/download-all", verifyToken,  downloadSelected); // Route to download selected files

router.post("/delete-all", verifyToken, deleteSelected); // Route to delete selected files

router.post("/set-favorite", verifyToken, toggleFavorite); // Route to set favorite files

router.patch("/trash/:id", verifyToken, toggleTrashFile);  // Route to toggle Trash file

router.post("/move", verifyToken, copyFiles); // Route to copy files


export default router;
