import { useEffect, useState } from "react";
import socket from "../api/socket";

/**
 * Reusable Socket Hook
 * @param {Object} events - { eventName: handlerFunction }
 * @param {boolean} autoConnect - default true
 */
export default function useSocket(events = {}, autoConnect = true) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!autoConnect) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [autoConnect]);

  useEffect(() => {
    // Register custom events
    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [events]);

  return { socket, isConnected };
}