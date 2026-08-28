import multer from "multer";
import path from "path";
import fs from "fs";

import Drive from "../../../drive/src/models/Drive.model.js";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userDrive = await Drive.findOne({
        userId: req.userId,
        isActive: true,
      }).sort({ createdAt: -1 });

      if (!userDrive) {
        return cb(new Error("No active drive found for user"));
      }

      cb(null, userDrive.drivePath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
