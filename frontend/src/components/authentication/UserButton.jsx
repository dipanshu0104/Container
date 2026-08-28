import {
  ChevronDown,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import useSocket from "../../hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/useAuthStore";

export default function UserButton() {
  const [open, setOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout, sessions, getSessions } = useAuthStore();

  useEffect(() => {
    getSessions();
  }, []);

  useSocket({
    "session:list:updated": () => {
      getSessions();
    },
  });
  const sessionCount = sessions.length;

  /* Close Dropdown */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSessionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Device Icon */

  const getDeviceIcon = (type) => {
    if (type === "mobile") return <Smartphone size={14} />;
    if (type === "tablet") return <Tablet size={14} />;
    return <Monitor size={14} />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button onClick={() => setOpen((prev) => !prev)} className="relative">
        <img
          src={
              user?.avatar
                ? `${import.meta.env.VITE_API_BASE}${user.avatar}`
                : "https://i.pravatar.cc/40"
            }
          alt="User"
          className="w-10 h-10 rounded-full border border-neutral-700 hover:border-neutral-500 transition"
        />

        {/* Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-64 bg-neutral-950 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-neutral-800">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-neutral-400">{user?.email}</p>
            </div>

            {/* Menu */}
            <div className="flex flex-col text-sm p-2">
              <button className="px-4 py-2 text-left hover:bg-blue-400 hover:text-black rounded-lg transition">
                Profile
              </button>

              <button
                className="px-4 py-2 text-left hover:bg-blue-400 hover:text-black rounded-lg transition"
                onClick={() => navigate("/settings")}
              >
                Settings
              </button>

              {/* Sessions Collapse */}
              <button
                onClick={() => setSessionsOpen(!sessionsOpen)}
                className="flex items-center justify-between px-4 py-2 hover:bg-neutral-900 rounded-lg transition"
              >
                <span className="flex items-center gap-2">
                  Active Sessions
                  <span className="text-xs bg-blue-500 px-3 py-0.5 rounded-full">
                    {sessionCount}
                  </span>
                </span>

                {sessionsOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              <AnimatePresence>
                {sessionsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col mt-1 px-3 py-2 bg-neutral-900 rounded-lg gap-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center gap-2 text-xs text-neutral-300 px-3 py-1.5 rounded-md"
                        >
                          {getDeviceIcon(session.device?.type || "desktop")}
                          <span className="truncate capitalize">
                            {session.device?.type || "desktop"}
                          </span>
                          -
                          <span className="truncate">
                            {session.os?.name} {session.os?.version}
                          </span>
                          {(() => {
                            const isCurrent = session.isCurrent;

                            return isCurrent ? (
                              <span className="ml-auto px-1 py-1 rounded-full bg-green-500">
                              </span>
                            ) : null;
                          })()}
                        </div>
                      ))}

                      <button
                        onClick={() => navigate("/settings/sessions")}
                        className="text-xs text-blue-400 hover:underline text-left mt-1 ml-3.5"
                      >
                        More
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-t border-neutral-800 my-1"></div>

              <button
                className="px-4 py-2.5 text-left text-red-500 hover:bg-red-400/20 hover:text-white rounded-lg transition"
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
