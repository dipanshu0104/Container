import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Basic info
    name: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
      unique: true,
    },

    extension: {
      type: String,
    },

    size: {
      type: Number, // bytes
      required: true,
    },

    mimeType: {
      type: String,
    },

    // Folder support
    parent_Id: {
      type: String, // "/storage/docs"
      index: true,
    },

    drive_Id: {
      type: String,
      index: true,
    },

    // NAS features
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Soft delete (optional but recommended)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // DB createdAt / updatedAt
  },
);
const File = mongoose.model("File", fileSchema);
export default File;
