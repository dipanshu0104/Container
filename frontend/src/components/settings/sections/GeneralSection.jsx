import { useEffect } from "react";
import useSocket from "../../../hooks/useSocket";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/settings/Card";
import Input from "../../../components/settings/Input";
import InfoRow from "../../../components/settings/InfoRow";
import NotificationItem from "../../../components/settings/NotificationItem";
import UserAvatarUpload from "../../authentication/UserAvatarUpload";
import { useDriveStore } from "../../../store/useDriveStore";

import { formatSize } from "../../../utils/formatters";

const GeneralSection = () => {
  const navigate = useNavigate();
  const { drives, getDrives, getActiveDrive, health } = useDriveStore();

  useEffect(() => {
    if (!drives.length) {
      getDrives();
    }
  }, [drives.length, getDrives]);

  useSocket({
    "file:list:updated": async () => {
      await getDrives();
    },
  });

  const activeDrive = getActiveDrive();

  const totalSpace = activeDrive?.totalSpace || 0;
  const usedSpace = activeDrive?.usedSpace || 0;
  const availableSpace = Math.max(totalSpace - usedSpace, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Profile" subtitle="Update your personal information">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <UserAvatarUpload />
            </div>

            <div>
              <p className="font-medium">Profile Photo</p>

              <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input placeholder="First Name" defaultValue="John" />

            <Input placeholder="Last Name" defaultValue="Doe" />
          </div>

          <Input
            placeholder="Email"
            defaultValue="john@example.com"
            className="w-full mb-4"
          />

          <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-1.5 rounded-lg text-sm font-medium">
            Save Changes
          </button>
        </Card>

        <Card
          title="Notifications"
          subtitle="Configure how you receive notifications"
        >
          <NotificationItem
            title="Email Notifications"
            desc="Receive email updates about your files"
          />

          <NotificationItem
            title="Share Notifications"
            desc="Get notified when someone shares a file with you"
          />

          <NotificationItem
            title="Storage Alerts"
            desc="Alert when storage is almost full"
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Storage Info">
          <div className="space-y-2 text-sm">
            <InfoRow label="Total Capacity" value={formatSize(totalSpace)} />

            <InfoRow label="Used Space" value={formatSize(usedSpace)} />

            <InfoRow
              label="Available"
              value={formatSize(availableSpace)}
              valueClass="text-green-500"
            />
          </div>

          <button 
          onClick={() => navigate("/settings/advanced")}
          className="mt-5 w-full border border-neutral-700 hover:bg-neutral-800 transition py-2 rounded-lg">
            Manage Storage
          </button>
        </Card>

        <Card title="NAS Status">
          <div className="space-y-3 text-sm">
            <InfoRow
              label="Status"
              value="● Online"
              valueClass="text-green-500"
            />

            <InfoRow label="Uptime" value="14 days" />

            <InfoRow label="Temperature" value="42°C" />

            <InfoRow
              label="Drive Health"
              value="Good"
              valueClass="text-green-500"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSection;
