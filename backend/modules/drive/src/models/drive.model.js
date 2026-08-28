import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    drivePath: {
      type: String,
      required: true,
    },
    
    type: {
      type: String,
      enum: ["SSD", "HDD", "NVMe"],
      default: "HDD",
    },

    totalSpace: {
      type: Number, // Store in bytes
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Drive = mongoose.models.Drive || mongoose.model("Drive", driveSchema);
export default Drive;