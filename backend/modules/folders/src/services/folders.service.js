import File from "../../../files/src/models/files.model.js"
import Folder from "../models/folders.model.js"
import fs from "fs"
import mongoose from "mongoose"
import archiver from "archiver";
import path from "path"

export const deleteSelectedPermanent = async (ids) => {
  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

  //  Separate folders & files
  const folders = await Folder.find({ _id: { $in: objectIds } }).select("_id");
  const files = await File.find({ _id: { $in: objectIds } }).select("_id path");

  const folderIds = folders.map(f => f._id);
  const fileIds = files.map(f => f._id);

  //  Recursively get ALL child folders
  const getAllChildFolders = async (parentIds, collected = []) => {
    const children = await Folder.find({
      parent_Id: { $in: parentIds }
    }).select("_id");

    if (children.length === 0) return collected;

    const childIds = children.map(c => c._id);

    collected.push(...childIds);

    return await getAllChildFolders(childIds, collected);
  };

  let allFolderIds = [...folderIds];

  if (folderIds.length > 0) {
    const childFolders = await getAllChildFolders(folderIds);
    allFolderIds.push(...childFolders);
  }

  //  Remove duplicates
  allFolderIds = [
    ...new Set(allFolderIds.map(id => id.toString()))
  ].map(id => new mongoose.Types.ObjectId(id));

  //  Get all files inside ALL folders
  const filesInsideFolders = await File.find({
    parent_Id: { $in: allFolderIds }
  }).select("_id path");

  const allFilesToDelete = [...files, ...filesInsideFolders];

  //  Delete from filesystem (SAFE)
  for (const file of allFilesToDelete) {
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      console.error("File delete error:", err.message);
    }
  }

  //  Delete file records
  await File.deleteMany({
    $or: [
      { _id: { $in: fileIds } },
      { parent_Id: { $in: allFolderIds } }
    ]
  });

  //  Delete folders
  await Folder.deleteMany({
    _id: { $in: allFolderIds }
  });

  return {
    foldersDeleted: allFolderIds.length,
    filesDeleted: allFilesToDelete.length
  };
};




export const toggletrash = async (ids) => {
  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

  //  Get selected folders & files
  const folders = await Folder.find({ _id: { $in: objectIds } }).select("_id isDeleted");
  const files = await File.find({ _id: { $in: objectIds } }).select("_id isDeleted");

  const folderIds = folders.map(f => f._id);
  const fileIds = files.map(f => f._id);

  let allFolderIds = [...folderIds];

  //  Recursively get all descendant folders
  const getAllChildFolders = async (parentIds, collected = []) => {
    const children = await Folder.find({ parent_Id: { $in: parentIds } }).select("_id");
    if (children.length === 0) return collected;

    const childIds = children.map(c => c._id);
    collected.push(...childIds);

    return await getAllChildFolders(childIds, collected);
  };

  if (folderIds.length > 0) {
    const childFolders = await getAllChildFolders(folderIds);
    allFolderIds.push(...childFolders);
  }

  //  Remove duplicates
  allFolderIds = [...new Set(allFolderIds.map(id => id.toString()))].map(id => new mongoose.Types.ObjectId(id));

  //  Determine toggle direction (restore if all selected items are trashed)
  const shouldRestore = [...folders, ...files].every(item => item.isDeleted === true);
  const newState = shouldRestore ? false : true;

  //  Toggle folders
  if (allFolderIds.length > 0) {
    await Folder.updateMany(
      { _id: { $in: allFolderIds } },
      { $set: { isDeleted: newState } }
    );

    // Toggle files inside all folders recursively
    await File.updateMany(
      { parent_Id: { $in: allFolderIds } },
      { $set: { isDeleted: newState } }
    );
  }

  //  Toggle individually selected files (not inside folders)
  if (fileIds.length > 0) {
    await File.updateMany(
      { _id: { $in: fileIds } },
      { $set: { isDeleted: newState } }
    );
  }

  return {
    action: shouldRestore ? "restored" : "trashed",
    foldersAffected: allFolderIds.length,
    filesAffected: fileIds.length
  };
};



export const downloadSelectedFiles = async (ids, res) => {
  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

  // Separate folders & files
  const folders = await Folder.find({ _id: { $in: objectIds } }).select("_id name parent_Id");
  const files = await File.find({ _id: { $in: objectIds } }).select("_id name path parent_Id");

  const folderIds = folders.map(f => f._id);

  // Recursively get all child folders
  const getAllChildFolders = async (parentIds, collected = []) => {
    const children = await Folder.find({
      parent_Id: { $in: parentIds }
    }).select("_id name parent_Id");

    if (!children.length) return collected;

    collected.push(...children);

    const childIds = children.map(c => c._id);
    return await getAllChildFolders(childIds, collected);
  };

  let allFolders = [...folders];

  if (folderIds.length > 0) {
    const childFolders = await getAllChildFolders(folderIds);
    allFolders.push(...childFolders);
  }

  // Remove duplicate folders
  const uniqueFolderMap = new Map();
  allFolders.forEach(folder => {
    uniqueFolderMap.set(folder._id.toString(), folder);
  });
  allFolders = Array.from(uniqueFolderMap.values());

  const allFolderIds = allFolders.map(f => f._id);

  // Get all files inside all folders
  const filesInsideFolders = await File.find({
    parent_Id: { $in: allFolderIds }
  }).select("_id name path parent_Id");

  const allFiles = [...files, ...filesInsideFolders];

  // Remove duplicate files
  const uniqueFileMap = new Map();
  allFiles.forEach(file => {
    uniqueFileMap.set(file._id.toString(), file);
  });
  const finalFiles = Array.from(uniqueFileMap.values());

  //  Create ZIP stream
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=download.zip");

  const archive = archiver("zip", {
    zlib: { level: 9 }
  });

  archive.pipe(res);

  //  Build folder path map
  const folderPathMap = {};

  const buildFolderPath = (folder) => {
    if (!folder.parent_Id) return folder.name;

    const parent = allFolders.find(f =>
      f._id.toString() === folder.parent_Id?.toString()
    );

    if (!parent) return folder.name;

    if (!folderPathMap[parent._id])
      folderPathMap[parent._id] = buildFolderPath(parent);

    return path.join(folderPathMap[parent._id], folder.name);
  };

  for (const folder of allFolders) {
    folderPathMap[folder._id] = buildFolderPath(folder);
  }

  //  Add files to archive
  for (const file of finalFiles) {
    try {
      if (file.path && fs.existsSync(file.path)) {

        let filePathInZip = file.name;

        if (file.parent_Id && folderPathMap[file.parent_Id]) {
          filePathInZip = path.join(
            folderPathMap[file.parent_Id],
            file.name
          );
        }

        archive.file(file.path, { name: filePathInZip });
      }
    } catch (err) {
      console.error("ZIP add error:", err.message);
    }
  }

  await archive.finalize();
};



export const moveItemsService = async (ids, destinationId, userId) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error("No items selected");
  }

  if (!destinationId) {
    throw new Error("Destination folder required");
  }

  const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
  const destObjectId = new mongoose.Types.ObjectId(destinationId);

  //  Prevent moving folder into itself
  if (ids.includes(destinationId)) {
    throw new Error("Cannot move folder inside itself");
  }

  /* ===============================
      Separate folders & files
  =============================== */

  const folders = await Folder.find({
    _id: { $in: objectIds },
    userId
  }).select("_id");

  const files = await File.find({
    _id: { $in: objectIds },
    userId
  }).select("_id");

  const folderIds = folders.map(f => f._id);
  const fileIds = files.map(f => f._id);

  /* ===============================
      Recursive self-move protection
  =============================== */

  const collectChildrenIds = async (parentIds, collected = []) => {
    const children = await Folder.find({
      parent_Id: { $in: parentIds },
      userId
    }).select("_id");

    if (!children.length) return collected;

    const childIds = children.map(c => c._id);
    collected.push(...childIds);

    return collectChildrenIds(childIds, collected);
  };

  if (folderIds.length > 0) {
    const nestedIds = await collectChildrenIds(folderIds);

    if (nestedIds.map(id => id.toString()).includes(destinationId)) {
      throw new Error("Cannot move folder into its own subfolder");
    }
  }

  /* ===============================
      Move folders
  =============================== */

  if (folderIds.length > 0) {
    await Folder.updateMany(
      { _id: { $in: folderIds }, userId },
      { $set: { parent_Id: destObjectId } }
    );
  }

  /* ===============================
     Move files
  =============================== */

  if (fileIds.length > 0) {
    await File.updateMany(
      { _id: { $in: fileIds }, userId },
      { $set: { parent_Id: destObjectId } }
    );
  }

  return {
    success: true,
    foldersMoved: folderIds.length,
    filesMoved: fileIds.length
  };
};