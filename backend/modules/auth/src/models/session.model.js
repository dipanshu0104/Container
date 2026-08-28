import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },

    ipAddress: {
      type: String,
      default: "Unknown",
    },

    userAgent: {
      type: String,
      default: "Unknown",
    },

    browser: {
      name: {
        type: String,
        default: "Unknown",
      },

      version: {
        type: String,
        default: "Unknown",
      },
    },

    os: {
      name: {
        type: String,
        default: "Unknown",
      },

      version: {
        type: String,
        default: "Unknown",
      },
    },

    device: {
      type: {
        type: String,
        default: "desktop",
      },

      model: {
        type: String,
        default: "Unknown",
      },

      vendor: {
        type: String,
        default: "Unknown",
      },
    },

    cpu: {
      architecture: {
        type: String,
        default: "Unknown",
      },
    },

    engine: {
      name: {
        type: String,
        default: "Unknown",
      },

      version: {
        type: String,
        default: "Unknown",
      },
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto delete after 30 days
sessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;