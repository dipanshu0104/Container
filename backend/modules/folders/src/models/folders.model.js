import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
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

    color: {
      type: String,
      default: "#3B82F6",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Folder support
    parent_Id: {
      type: String,
      index: true,
      default: "root",
    },

    drive_Id: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);
const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
