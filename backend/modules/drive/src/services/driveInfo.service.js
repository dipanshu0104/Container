import si from "systeminformation";
import path from "path";
import fs from "fs/promises";
import os from "os";
import Drive from "../models/drive.model.js";


  // Get filesystem info for a given drive path
 
export const getFsForPath = async (drivePath) => {
  const fsData = await si.fsSize();

  const normalizedPath = path.resolve(drivePath);

  const targetFs = fsData.find((disk) =>
    normalizedPath.startsWith(disk.mount)
  );

  if (!targetFs) {
    return null;
  }

  return targetFs;
};


  // Get available free space for a drive path
 
export const getAvailableSpace = async (drivePath) => {
  const fs = await getFsForPath(drivePath);

  if (!fs) return null;

  const targetRoot = path.parse(
    path.resolve(drivePath)
  ).root;

  const dbDrives = await Drive.find(
    {},
    { drivePath: 1, totalSpace: 1 }
  );

  const allocatedSpace = dbDrives.reduce((sum, drive) => {
    if (!drive.drivePath) return sum;

    const driveRoot = path.parse(
      path.resolve(drive.drivePath)
    ).root;

    if (driveRoot === targetRoot) {
      return sum + Number(drive.totalSpace || 0);
    }

    return sum;
  }, 0);

  return Math.max(
    0,
    Math.min(fs.available, fs.size - allocatedSpace)
  );
};



export const getDriveHealth = (usedSpace, totalSpace) => {
  const used = Number(usedSpace || 0);
  const total = Number(totalSpace || 0);

  if (total <= 0) return "Unknown";

  const usagePercent = (used / total) * 100;

  if (usagePercent >= 90) return "Critical";
  if (usagePercent >= 70) return "Warning";
  return "Healthy";
};



