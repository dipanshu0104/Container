import React from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock
} from "lucide-react";

const getDeviceIcon = (device) => {
  switch (device?.toLowerCase()) {
    case "mobile":
      return <Smartphone size={20} />;
    case "tablet":
      return <Tablet size={20} />;
    default:
      return <Monitor size={20} />;
  }
};

const SessionCard = ({ session, onLogout }) => {
  return (
    <div className="
      w-full
      bg-black
      border border-neutral-800
      rounded-2xl
      hover:border-neutral-700
      hover:bg-neutral-900
      transition-all
      duration-200
      p-4
      flex flex-col sm:flex-row sm:items-center sm:justify-between
      gap-4
    ">

      {/* LEFT */}
      <div className="flex items-start gap-4">

        {/* Icon */}
        <div className="
          p-3
          bg-black
          border border-neutral-800
          font-bold
          rounded-xl
          text-blue-500
        ">
          {getDeviceIcon(session.device)}
        </div>

        {/* Info */}
        <div className="space-y-1">

          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-200 tracking-tight">
              {session.browser} • {session.os}
            </h3>

            {session.isCurrent ? (
              <span className="
                text-xs
                bg-green-500/10
                text-green-400
                border border-green-500/20
                px-2 py-1
                rounded-full
                font-medium
              ">
                Current Device
              </span>
            ): (
              <span className="
                text-xs
                bg-yellow-500/10
                text-yellow-400
                border border-yellow-500/20
                px-2 py-1
                rounded-full
                font-medium
              ">
                Active Device
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400 flex items-center gap-1">
            <MapPin size={14} />
            {session.ipAddress}
          </p>

          <p className="text-sm text-gray-400 flex items-center gap-1">
            <Clock size={14} />
            Last active {session.lastActive}
          </p>

        </div>
      </div>

      {/* RIGHT */}
      {!session.isCurrent && (
        <button
          onClick={() => onLogout(session._id)}
          className="
            w-full sm:w-auto
            bg-red-600/90
            hover:bg-red-600
            text-white
            px-3 py-1
            rounded-xl
            font-md
            transition
            shadow-lg shadow-red-600/10
          "
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default SessionCard;
