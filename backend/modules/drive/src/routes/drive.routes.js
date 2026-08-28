import express from "express";
import {
    getDrives,
    setDrive, 
    getHealth, 
    renameDrive,
    deleteDrive,
    setActiveDrive,
    getStorageStatus
} from "../controllers/drive.controller.js"
import { verifyToken } from "../../../../middlewares/verify.middleware.js";

const routes = express.Router();

// Routes for folders


routes.get("/", verifyToken,getDrives);  // 1) route to get all drives


routes.post("/", verifyToken,setDrive);  // 2) route to set drives


routes.patch("/set-active/:id", verifyToken, setActiveDrive);  // 3) route to Set active drive


routes.put("/rename/:id", verifyToken, renameDrive);  // 4) route to rename the drive


routes.delete("/delete/:id", verifyToken, deleteDrive);  // 5) route to Delete a particular disk


routes.get("/health",  verifyToken,getHealth);  // 4) route to get folders on choice


routes.get("/summary", verifyToken, getStorageStatus)



export default routes;