import Folder from "../models/folders.model.js";
import Drive from "../../../drive/src/models/drive.model.js";
import {
  deleteSelectedPermanent,
  toggletrash,
  downloadSelectedFiles,
  moveItemsService
} from "../services/folders.service.js";

// getFolders, getChoiceFolder, createFolder, deleteFolder

// controllers for the files

// 1) get folders

export const getFolders = async (req, res) => {
  try {
    const activeDrive = await Drive.findOne({ userId: req.userId, isActive: true, });

    if (!activeDrive) {
      return res.status(400).json({
        message: "No active drive found. Please activate a drive first.",
      });
    }

    const folders = await Folder.find({ userId: req.userId, drive_Id: activeDrive._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2) get folder on choice

export const getChoiceFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const activeDrive = await Drive.findOne({ userId: req.userId, isActive: true, });

    if (!activeDrive) {
      return res.status(400).json({
        message: "No active drive found. Please activate a drive first.",
      });
    }

    const folder = await Folder.find({ parent_Id: id, userId: req.userId, drive_Id: activeDrive._id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3) create folder

export const createFolder = async (req, res) => {
  const { folderName, parentId, color } = req.body;

  try {
    const activeDrive = await Drive.findOne({ userId: req.userId, isActive: true, });

    if (!activeDrive) {
      return res.status(400).json({
        message: "No active drive found. Please activate a drive first.",
      });
    }

    // check if folder already exists in same parent
    const existingFolder = await Folder.findOne({
      name: folderName,
      userId: req.userId,
      parent_Id: parentId || "root",
      drive_Id: activeDrive._id,
    });

    if (existingFolder) {
      return res.status(400).json({ message: "Folder already exists" });
    }

    const newFolder = await Folder.create({
      userId: req.userId,
      name: folderName,
      parent_Id: parentId || "root",
      color: color || "#3B82F6",
      drive_Id: activeDrive._id,
    });

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4) rename Folders

export const editFolder = async (req, res) => {
  try {
    const { newName, color } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Folder ID is required",
      });
    }

    const folder = await Folder.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found or access denied",
      });
    }

    // Update folder name
    if (newName && newName.trim()) {
      folder.name = newName.trim();
    }

    // Update folder color
    if (color) {
      folder.color = color;
    }

    await folder.save();

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.status(200).json({
      message: "Folder updated successfully",
      folder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update folder",
      error: error.message,
    });
  }
};

// 5) delete folders

export const deleteFolder = async (req, res) => {
  const { ids } = req.body;

  try {
    const folder = await Folder.findById(ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    await deleteSelectedPermanent(ids);

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.status(200).json({
      message: "Folder and all its contents deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6) Trash Folders

export const trashSelectedFolders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    const result = await toggletrash(ids);

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.status(200).json({
      message: "Selected items moved to trash successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Bulk trash failed",
      error: error.message,
    });
  }
};

// 7) Download all

export const downloadAll = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    const result = await downloadSelectedFiles(ids, res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to download selected files",
      error: error.message,
    });
  }
};


// 8) Move files

export const moveItems = async (req, res) => {
  try {
    const { ids, destinationId } = req.body;

    const result = await moveItemsService(
      ids,
      destinationId,
      req.userId
    );

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.status(200).json({
      message: "Items moved successfully",
      ...result
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Move failed"
    });
  }
};