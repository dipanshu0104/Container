import fs from "fs";
import path from "path";
import archiver from "archiver";
import { pipeline } from "stream";
import File from "../models/files.model.js";
import Drive from "../../../drive/src/models/drive.model.js";

// controllers

// 1) controller to get all files

export const getFiles = async (req, res) => {
  try {
    const activeDrive = await Drive.findOne({ userId: req.userId, isActive: true,});
    if (!activeDrive) {
      return res.status(400).json({
        message: "No active drive found",
      });
    }

    const files = await File.find({ userId: req.userId, drive_Id: activeDrive._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

// 2) controller to upload files

export const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const activeDrive = await Drive.findOne({ userId: req.userId, isActive: true, });

    if (!activeDrive) {
      return res.status(400).json({
        message: "No active drive found. Please activate a drive first.",
      });
    }

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        return File.create({
          userId: req.userId,
          name: file.originalname,
          path: file.path, // e.g. uploads/abc.pdf
          extension: path
            .extname(file.originalname)
            .slice(1)
            .toLocaleLowerCase(),
          size: file.size,
          mimeType: file.mimetype,
          parent_Id: req.body.parentId || "root",
          drive_Id: activeDrive._id,
        });
      }),
    );

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.status(201).json({
      message: "Files uploaded successfully",
      count: savedFiles.length,
      files: savedFiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};

// 3) controller to preview file

export const previewFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) return res.status(404).json({ message: "File not found" });
    if (!fs.existsSync(file.path))
      return res.status(404).json({ message: "File missing on server" });

    const stat = fs.statSync(file.path);
    const fileSize = stat.size;
    const mimeType = file.mimeType || "application/octet-stream";
    const range = req.headers.range;

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);

    // Handle video/audio streaming
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(file.path, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Length": chunkSize,
      });

      // pipeline with proper error handling
      pipeline(stream, res, (err) => {
        if (err) {
          if (err.code === "ERR_STREAM_PREMATURE_CLOSE") {
            console.log("Client closed connection prematurely");
          } else {
            console.error("Stream error:", err);
            if (!res.headersSent) res.status(500).end("Stream failed");
          }
        }
      });

      // Abort handling if client closes
      req.on("close", () => {
        stream.destroy();
      });
    } else {
      // Non-range files
      const stream = fs.createReadStream(file.path);
      res.writeHead(200, { "Content-Length": fileSize });

      pipeline(stream, res, (err) => {
        if (err) {
          if (err.code === "ERR_STREAM_PREMATURE_CLOSE") {
            console.log("Client closed connection prematurely");
          } else {
            console.error("Stream error:", err);
            if (!res.headersSent) res.status(500).end("Stream failed");
          }
        }
      });

      req.on("close", () => {
        stream.destroy();
      });
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Preview failed", error: error.message });
    }
  }
};

// 4) controller to download file

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file || file.isDeleted) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(file.path, file.name);
  } catch (error) {
    res.status(500).json({
      message: "Download failed",
      error: error.message,
    });
  }
};

// 5) controller to rename file

export const renameFile = async (req, res) => {
  const { newName } = req.body;
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Get current directory of the file
    const dir = path.dirname(file.path);

    // Build new path inside the same directory
    const newPath = path.join(dir, newName);

    // Prevent overwrite
    if (fs.existsSync(newPath)) {
      return res
        .status(400)
        .json({ message: "A file with this name already exists" });
    }

    // Rename file on disk
    fs.renameSync(file.path, newPath);

    // Update DB
    file.name = newName;
    file.path = newPath;
    file.extension = path.extname(newName);

    await file.save();

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.json({
      message: "File renamed successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      message: "Rename failed",
      error: error.message,
    });
  }
};

// 6) controller to delete file

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Delete the file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Remove the file from database
    await File.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.json({
      message: "File successfully deleted from filesystem and database",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

// 7) controller to download selected files

export const downloadSelected = async (req, res) => {
  try {
    const { ids } = req.body; // Array of MongoDB _id strings
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No files selected" });
    }

    const files = await File.find({ _id: { $in: ids } });
    if (files.length === 0)
      return res.status(404).json({ message: "Files not found" });

    const zipName = `files_${Date.now()}.zip`;
    res.setHeader("Content-Disposition", `attachment; filename=${zipName}`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const file of files) {
      if (fs.existsSync(file.path)) {
        archive.file(file.path, { name: file.name });
      }
    }

    await archive.finalize();
  } catch (error) {
    res.status(500).json({
      message: "Download failed",
      error: error.message,
    });
  }
};

// 8) controller to delete selected files

export const deleteSelected = async (req, res) => {
  try {
    const { ids } = req.body; // Array of MongoDB _id strings
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No files selected" });
    }

    const files = await File.find({ _id: { $in: ids } });
    if (files.length === 0)
      return res.status(404).json({ message: "Files not found" });

    for (const file of files) {
      // Delete from filesystem if exists
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    // Remove from DB
    await File.deleteMany({ _id: { $in: ids } });

    const io = req.app.get("io");
    io.emit("file:list:updated");

    res.json({
      message: "Selected files deleted successfully",
      count: files.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Bulk delete failed",
      error: error.message,
    });
  }
};

// 9) controller to toggle the Favorite files

export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    const file = await File.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            isFavorite: { $not: "$isFavorite" },
          },
        },
      ],
      { new: true, updatePipeline: true },
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const io = req.app.get("io");
    io.emit("file:list:updated");

    return res.status(200).json({
      success: true,
      message: `Favorite ${file.isFavorite ? "added" : "removed"}`,
      isFavorite: file.isFavorite,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 10) Controller to trash the file (togglable)

export const toggleTrashFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find file owned by user
    const file = await File.findOne({ _id: id, userId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Toggle isDeleted
    file.isDeleted = !file.isDeleted;
    await file.save();

    const io = req.app.get("io");
    io.emit("file:list:updated");

    return res.status(200).json({
      success: true,
      message: file.isDeleted
        ? "File moved to trash"
        : "File restored successfully",
      file,
    });
  } catch (error) {
    console.error("Toggle Trash Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 11) controller to copy the file to a folder

export const copyFiles = async (req, res) => {
  try {
    const { fileIds, folderId } = req.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "fileIds must be a non-empty array",
      });
    }

    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "folderId is required",
      });
    }

    //  Ownership protection
    const result = await File.updateMany(
      {
        _id: { $in: fileIds },
        userId: req.userId,
      },
      {
        $set: { parent_Id: folderId },
      },
    );

    const io = req.app.get("io");
    io.emit("file:list:updated");

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} files moved successfully`,
    });
  } catch (error) {
    console.error("Move Files Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
