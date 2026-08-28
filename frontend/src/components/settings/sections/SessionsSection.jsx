import { useEffect } from "react";

import Card from "../../../components/settings/Card";
import useSocket from "../../../hooks/useSocket";

import { LogOut } from "lucide-react";

import { useAuthStore } from "../../../store/useAuthStore";

export default function SessionsSection() {
  const { sessions, getSessions, deleteSession, isSessionsLoading, isLoading } =
    useAuthStore();

  useEffect(() => {
    getSessions();
  }, []);

  useSocket({
    "session:list:updated": () => {
      getSessions();
    },
  });

  const handleLogout = async (id) => {
    try {
      await deleteSession(id);
    } catch (error) {
      console.log(error);
    }
  };

  const deviceBadgeColors = {
    desktop: "bg-blue-500/10 text-blue-400 border-blue-500/20",

    mobile: "bg-pink-500/10 text-pink-400 border-pink-500/20",

    laptop: "bg-violet-500/10 text-violet-400 border-violet-500/20",

    tablet: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  const formatLastActive = (date) => {
    const now = new Date();

    const last = new Date(date);

    const diffMs = now - last;

    const minutes = Math.floor(diffMs / 60000);

    const hours = Math.floor(diffMs / 3600000);

    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "Just now";

    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card
        title="Sessions"
        subtitle="Manage devices currently logged into your account"
      >
        {sessions.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No active sessions found
          </div>
        ) : (
          sessions.map((session) => {
            const deviceType = session.device?.type || "desktop";

            const isCurrent = session.isCurrent;

            return (
              <div
                key={session._id}
                className="flex items-center justify-between py-5 border-b last:border-b-0 border-neutral-800"
              >
                <div className="space-y-2">
                  {/* Top Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white capitalize">
                      {/* {session.browser?.name || "Unknown"} on{" "} */}
                      {session.os?.name || "Unknown"}
                    </p>

                    {/* Device Badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded-md border capitalize ${
                        deviceBadgeColors[deviceType]
                      }`}
                    >
                      {deviceType}
                    </span>

                    {/* Current Badge */}
                    {isCurrent && (
                      <span className="text-xs px-2 py-1 rounded-md border border-green-500/20 bg-green-500/10 text-green-400">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Browser + OS Pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-neutral-800 text-gray-300 px-2 py-1 rounded-md">
                      {session.browser?.name} {session.browser?.version}
                    </span>

                    <span className="text-xs bg-neutral-800 text-gray-300 px-2 py-1 rounded-md">
                      {session.os?.name} {session.os?.version}
                    </span>

                    <span className="text-xs bg-neutral-800 text-gray-300 px-2 py-1 rounded-md">
                      {session.cpu?.architecture}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>IP: {session.ipAddress}</p>

                    <p className="text-gray-500">
                      Last active: {formatLastActive(session.lastActive)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleLogout(session.sessionId)}
                  disabled={isCurrent || isLoading}
                  className={`flex items-center gap-2 text-sm px-2 py-2 rounded-lg transition font-medium ${
                    isCurrent
                      ? "hidden border border-red-500/30 text-red-400 opacity-60 cursor-not-allowed"
                      : "border border-neutral-700 text-gray-300 hover:bg-neutral-800"
                  }`}
                >
                  <LogOut size={16} />
                </button>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}
