import { io } from "socket.io-client";

const BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000`;

const socket = io(BASE_URL, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

export default socket;