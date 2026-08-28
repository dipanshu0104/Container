import User from "../models/user.model.js";
import Session from "../models/session.model.js";

import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import crypto from "crypto";
import getDeviceInfo from "../services/deviceInfo.service.js";
import { getLocalIPv4 } from "../services/ipaddr.service.js";
import generateTokenAndSetCookie from "../services/token.service.js";

import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mail/emails.js";

// controllers for the user

// 1)  controller to register the user
export const userSignup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required.");
    }

    const userAlreadyExists = await User.findOne({ email });
    //    console.log(userAlreadyExists)
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ sucess: "false", message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });

    await user.save();

    // now we get the device data
    const deviceInfo = getDeviceInfo(req);

    // create a session in db
    const session = await Session.create({
      user: user._id,

      ipAddress: deviceInfo.ipAddress,

      userAgent: deviceInfo.userAgent,

      browser: {
        name: deviceInfo.browser?.name,
        version: deviceInfo.browser?.version,
      },

      os: {
        name: deviceInfo.os?.name,
        version: deviceInfo.os?.version,
      },

      device: {
        type: deviceInfo.device?.type,
        model: deviceInfo.device?.model,
        vendor: deviceInfo.device?.vendor,
      },

      cpu: {
        architecture: deviceInfo.cpu?.architecture,
      },

      engine: {
        name: deviceInfo.engine?.name,
        version: deviceInfo.engine?.version,
      },

      lastActive: new Date(),
    });

    await session.save();

    // socket flag
    const io = req.app.get("io");
    io.emit("session:list:updated");

    // Create user folder
    const userFolderPath = path.join(
      process.cwd(),
      process.env.UPLOAD_DIR,
      user._id.toString(),
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    generateTokenAndSetCookie(res, user._id, session.sessionId);

    //    send mail

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: "false", message: error.message });
  }
};

// 2)   controller to verify the user
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: "false",
        message: "Invalid and expired verification code.",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: "true",
      message: "Email verified successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: "false", message: error.message });
  }
};

// 3)  controller to logout the user
export const logout = async (req, res) => {
  await Session.findOneAndDelete({ sessionId: req.sessionId });

  const io = req.app.get("io");
  io.emit("session:list:updated");
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: "true", message: "Logged out successfully." });
};

// 4)  controller to login the user
export const userLogin = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ name: identifier }, { email: identifier }],
    });
    // console.log(user)
    if (!user) {
      return res
        .status(400)
        .json({ success: "false", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: "false", message: "password credentials" });
    }

    // now we get the device data
    const deviceInfo = getDeviceInfo(req);

    // create a session in db
    const session = await Session.create({
      user: user._id,

      ipAddress: deviceInfo.ipAddress,

      userAgent: deviceInfo.userAgent,

      browser: {
        name: deviceInfo.browser?.name,
        version: deviceInfo.browser?.version,
      },

      os: {
        name: deviceInfo.os?.name,
        version: deviceInfo.os?.version,
      },

      device: {
        type: deviceInfo.device?.type,
        model: deviceInfo.device?.model,
        vendor: deviceInfo.device?.vendor,
      },

      cpu: {
        architecture: deviceInfo.cpu?.architecture,
      },

      engine: {
        name: deviceInfo.engine?.name,
        version: deviceInfo.engine?.version,
      },

      lastActive: new Date(),
    });

    await session.save();

    // socket flag
    const io = req.app.get("io");
    io.emit("session:list:updated");

    // Create user folder
    const userFolderPath = path.join(
      process.cwd(),
      process.env.UPLOAD_DIR,
      user._id.toString(),
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    generateTokenAndSetCookie(res, user._id, session.sessionId);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: "true",
      message: "Logged in successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(400).json({ success: "false", message: error.message });
  }
};

// 5)  controller to forget password recovery
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token.
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //Get the correct local IPv4 address dynamically
    const localIP = await getLocalIPv4();

    await sendPasswordResetEmail(
      user.email,
      `http://${localIP}:5173/reset-password/${resetToken}`,
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 6)  controller to reset the password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.save();

    // Send the email
    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("Error to send password reset success email", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 7)  controller to check the authentication status
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in check auth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 8)  controller to set the sessions
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const currentSessionId = req.sessionId; // Extracted from your JWT via middleware

    // Find all sessions for this user
    const sessions = await Session.find({ user: userId }).lean();

    // Mark the current session
    const formattedSessions = sessions.map((session) => ({
      ...session,
      isCurrent: session.sessionId === currentSessionId,
    }));

    res.status(200).json({
      success: true,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching sessions.",
    });
  }
};

// 9)  controller to terminate a session
export const terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId._id;

    // Ensure the session belongs to the logged-in user
    const sessionToDelete = await Session.findOne({ sessionId, userId });
    if (!sessionToDelete) {
      return res
        .status(404)
        .json({ message: "Session not found or does not belong to you" });
    }

    await Session.findOneAndDelete({ sessionId });
    const sessions = await Session.find({ userId });

        // socket flag
    const io = req.app.get("io");
    io.emit("terminate:list:updated");
    res
      .status(200)
      .json({ sessions: sessions, message: "Session terminated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 10) controller to update the user info with verification
export const UpdateProfile = async (req, res) => {
  const { username, newPassword, currentPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect current password. Profile update failed.",
      });
    }

    if (username !== undefined && username !== null) {
      user.name = username;
    }

    if (newPassword) {
      // Generate a salt (random string) for hashing.
      const salt = await bcrypt.genSalt(10);
      // Hash the new password with the generated salt.
      user.password = await bcrypt.hash(newPassword, salt);
    }
    // Save the updated user document to the database.
    await user.save();

    res.status(200).json({
      success: "true",
      message: "User Updated successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to update profile" });
  }
};

// 11)  controller to upload the avatar to the user account
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  DELETE OLD AVATAR (IF NOT DEFAULT)
    if (user.avatar && user.avatar !== "/uploads/default-avatar.png") {
      const oldAvatarPath = path.join(
        process.cwd(),
        "..",
        "uploads",
        user.avatar,
      );

      // check file exists before deleting
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // SAVE NEW AVATAR
    const avatarPath = `/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      avatarUrl: avatarPath,
      user,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
