import express from "express";
import {
    getFolders, 
    getChoiceFolder, 
    createFolder, 
    deleteFolder,
    editFolder,
    trashSelectedFolders,
    downloadAll,
    moveItems
} from "../controllers/folders.controller.js"
import { verifyToken } from "../../../../middlewares/verify.middleware.js";

const routes = express.Router();

// Routes for folders

// 1) get all files

routes.get("/", verifyToken, getFolders);


// 2) get folders on choice

routes.get("/:id", verifyToken, getChoiceFolder);


// 3) create Folder

routes.post("/create", verifyToken, createFolder)


// 4) rename folder

routes.put("/edit/:id", verifyToken, editFolder)


//5) delete folder

routes.delete("/delete", verifyToken, deleteFolder)


// 6) trash folder

routes.patch("/trash", verifyToken, trashSelectedFolders);


// 7) download all

routes.post("/download", verifyToken, downloadAll)


// 8) Move files and folders

routes.patch("/move", verifyToken, moveItems)

export default routes;