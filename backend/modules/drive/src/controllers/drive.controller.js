import os from "os";
import fs from "fs";
import path from "path";
import Drive from "../models/drive.model.js";
import File from "../../../files/src/models/files.model.js";
import Folder from "../../../folders/src/models/folders.model.js"
import {
  getAvailableSpace,
  getDriveHealth,
} from "../services/driveInfo.service.js";

// controllers for the setup drives

// 1) get all drives
export const getDrives = async (req, res) => {
  try {
    const drives = await Drive.find({ userId: req.userId }).sort({
      createdAt: 1,
    });

    const enrichedDrives = await Promise.all(
      drives.map(async (drive) => {
        const files = await File.find({
          drive_Id: drive._id,
          userId: req.userId,
        }).select("size");
        const usedSpace = files.reduce(
          (sum, file) => sum + Number(file.size || 0),
          0,
        );

        const health = getDriveHealth(usedSpace, drive.totalSpace);

        return {
          ...drive.toObject(),
          usedSpace,
          health,
        };
      }),
    );

    return res.status(200).json({
      count: enrichedDrives.length,
      drives: enrichedDrives,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch drives",
      error: error.message,
    });
  }
};

// 2) set settings of app
export const setDrive = async (req, res) => {
  try {
    const { name, type, drivePath, totalSpace } = req.body;

    // Required fields validation
    if (!name || !type || !drivePath || totalSpace == null) {
      return res.status(400).json({
        success: false,
        message: "name, type, drivePath and totalSpace are required",
      });
    }

    // Validate totalSpace
    const requestedSpace = Number(totalSpace);

    if (!Number.isFinite(requestedSpace) || requestedSpace <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalSpace must be a positive number",
      });
    }

    // Get actual available space for this filesystem
    const availableSpace = await getAvailableSpace(drivePath);

    if (availableSpace == null) {
      return res.status(400).json({
        success: false,
        message: "Invalid drive path or filesystem not found",
      });
    }

    // Prevent over-allocation
    if (requestedSpace > availableSpace) {
      return res.status(400).json({
        success: false,
        message: "Insufficient available space on the selected drive",
        data: {
          requestedSpace,
          availableSpace,
          shortage: requestedSpace - availableSpace,
        },
      });
    }

    // Create drive
    const newDrive = await Drive.create({
      name,
      userId: req.userId,
      drivePath,
      type,
      totalSpace: requestedSpace,
    });

    return res.status(201).json({
      success: true,
      message: "Drive registered successfully",
      data: {
        ...newDrive.toObject(),
        remainingSpaceAfterCreation: availableSpace - requestedSpace,
      },
    });
  } catch (error) {
    console.error("setDrive error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 3) Set a drive active

export const setActiveDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    // If drive is currently active → deactivate it
    if (drive.isActive) {
      drive.isActive = false;
      await drive.save();

      return res.json({
        success: true,
        message: "Drive deactivated successfully",
        data: drive,
      });
    }

    // If drive is inactive → activate it and deactivate others
    await Drive.updateMany({ userId: req.userId }, { isActive: false });

    drive.isActive = true;
    await drive.save();

    const io = req.app.get("io");
    io.emit("file:list:updated");
    io.emit("drive:list:updated");

    res.json({
      success: true,
      message: "Drive activated successfully",
      data: drive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4) rename a specific drive

export const renameDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Drive name is required",
      });
    }

    const drive = await Drive.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    drive.name = name.trim();
    await drive.save();

    res.status(200).json({
      success: true,
      message: "Drive renamed successfully",
      data: drive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to rename drive",
      error: error.message,
    });
  }
};

// 5) delete a particular drive

export const deleteDrive = async (req, res) => {
  try {
    const { id } = req.params;

    const drive = await Drive.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    await drive.deleteOne();

    res.status(200).json({
      success: true,
      message: "Drive deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete drive",
      error: error.message,
    });
  }
};

// 6) get health of the system

export const getHealth = async (req, res) => {
  res.status(500).json({ msg: "health" });
};


// 7) get the summary of the storage

export const getStorageStatus = async (req, res) => {
  try {
    const userId = req.userId;

    const [drives, files, folders] = await Promise.all([
      Drive.find({ userId }).sort({ createdAt: 1 }),
      File.find({ userId, isDeleted: false }),
      Folder.find({ userId, isDeleted: false }),
    ]);

    const enrichedDrives = await Promise.all(
      drives.map(async (drive) => {
        const driveFiles = await File.find({
          drive_Id: drive._id,
          userId,
          isDeleted: false,
        }).select("size");

        const usedSpace = driveFiles.reduce(
          (sum, file) => sum + Number(file.size || 0),
          0
        );

        const health = getDriveHealth(usedSpace, drive.totalSpace);

        return {
          ...drive.toObject(),
          usedSpace,
          health,
        };
      })
    );

    return res.status(200).json({
      success: true,
      drives: enrichedDrives,
      files,
      folders,
    });
  } catch (error) {
    console.error("Storage Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch storage summary.",
    });
  }
};
