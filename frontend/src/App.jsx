import { useEffect } from "react";
import MainRoutes from "./routes/MainRoutes";
import { useFileStore } from "./store/useFileStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./api/socket";
import useSocket from "./hooks/useSocket";

const App = () => {
  useEffect(() => {
    useFileStore.getState().getFiles();
  }, []);

  useSocket({
    "terminate:list:updated": () => {
      window.location.reload();
    },
  });

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <MainRoutes />
    </div>
  );
};

export default App;
