import { useState, useEffect } from "react";
import { DriveCard, AddDriveCard, SystemCard } from "../DriveCards";
import StorageSummary from "../StorageSummary";
import AddDriveModal from "../../popups/AddDriveModal";

import { useDriveStore } from "../../../store/useDriveStore";
import { useAuthStore } from "../../../store/useAuthStore";
import socket from "../../../api/socket";
import useSocket from "../../../hooks/useSocket";

export default function AdvancedSection() {
  const {
    drives,
    getDrives,
    loading,
    toggleActiveDrive,
    createDrive,
  } = useDriveStore();

  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    drivePath: "",
    capacity: "1",
    totalSpace: 0,
    unit: "TB",
    type: "SSD",
  });

  // Fetch drives
  useEffect(() => {
    getDrives();
  }, [getDrives]);

  useSocket({
    "drive:list:updated": async () => {
      await getDrives();
    },
  });


  console.log(drives)

  // -------------------------------
  // CREATE DRIVE
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let totalSpace = 0;

      switch (formData.unit) {
        case "TB":
          totalSpace = Number(formData.capacity) * 1024 ** 4;
          break;
        case "GB":
          totalSpace = Number(formData.capacity) * 1024 ** 3;
          break;
        case "MB":
          totalSpace = Number(formData.capacity) * 1024 ** 2;
          break;
        default:
          totalSpace = Number(formData.capacity);
      }

      await createDrive({
        name: formData.name,
        drivePath: formData.drivePath,
        totalSpace,
        type: formData.type,
      });

      setFormData({
        name: "",
        drivePath: "",
        capacity: "1",
        totalSpace: 0,
        unit: "TB",
        type: "SSD",
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-14 pb-10">
      {/* STORAGE DRIVES */}
      <section>
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white mb-2">Storage Drives</h1>
          <p className="text-neutral-500 text-[15px]">
            Monitor and manage all connected drives
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {drives.map((drive) => (
            <DriveCard
              key={drive._id}
              drive={drive}
              onClick={() => toggleActiveDrive(drive._id)}
            />
          ))}

          <AddDriveCard onClick={() => setIsModalOpen(true)} />
        </div>
      </section>

      {/* SYSTEM STATUS */}
      <section className="border-t border-neutral-900 pt-10">
        <h1 className="text-2xl font-bold text-white mb-7">System Status</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SystemCard
            title="NAS Status"
            value="14 days"
            subtitle="Uptime"
            rightText="Online"
            progressTitle="CPU Load"
            progressValue="42%"
          />

          <SystemCard
            title="Temperature"
            value="42°C"
            subtitle="Average across all drives"
            rightText="Monitor"
            progressTitle="Memory Usage"
            progressValue="2.4 GB / 8 GB"
            warning
          />
        </div>
      </section>

      {/* STORAGE SUMMARY */}
       <StorageSummary />

      <AddDriveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
