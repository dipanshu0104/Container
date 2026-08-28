import React, { useEffect } from "react";
import { useFileStore } from "../store/useFileStore";
import { useFolderStore } from "../store/useFolderStore";
import { useDriveStore } from "../store/useDriveStore";
import useSocket from "../hooks/useSocket";

import StorageBar from "../components/dashboard/StorageBar";
import OptionsCards from "../components/dashboard/OptionsCards";
import DragAndDrop from "../components/dashboard/DragAndDrop";
import RecentFiles from "../components/dashboard/RecentFiles";
import StorageBarSkeleton from "../components/dashboard/StorageBarSkeleton"

const StatusDot = ({ color }) => (
  <span className="relative flex h-3 w-3">
    <span
      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}
    />
    <span
      className={`relative inline-flex h-3 w-3 rounded-full ${color.replace(
        "400",
        "500",
      )}`}
    />
  </span>
);

const Dashboard = () => {
  const files = useFileStore((s) => s.files);
  const getFiles = useFileStore((s) => s.getFiles);

  const getFolders = useFolderStore((s) => s.getFolders);

  const { drives, getDrives, Driveloading } = useDriveStore();

  useEffect(() => {
    getFolders();
    getFiles();
    getDrives();
  }, []);

  const activeDrive = drives.find((d) => d.isActive);

  const { isConnected } = useSocket({
    "file:list:updated": () => {
      getFolders();
      getFiles();
    },
  });

  useSocket({
    "drive:list:updated": async () => {
      await getDrives();
    },
  });

  console.log("drives:", drives);
  console.log("activeDrive:", activeDrive);

  return (
    <div className="flex flex-col text-white p-6 overflow-y-auto custom-scrollbar">
      <div className="mb-4 flex items-center gap-2 text-sm">
        <StatusDot color={isConnected ? "bg-green-400" : "bg-red-400"} />

        <span className={isConnected ? "text-green-400" : "text-red-400"}>
          {isConnected ? "Synced" : "Unsynced"}
        </span>
      </div>

      {activeDrive ? <StorageBar files={files} activeDrive={activeDrive} /> : <StorageBarSkeleton />}

      <OptionsCards />
      <DragAndDrop />
      <RecentFiles files={files} limit={12} />
    </div>
  );
};

export default Dashboard;
