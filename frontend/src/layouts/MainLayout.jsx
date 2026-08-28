import { Outlet } from "react-router-dom";
import Sidebar from "../components/main/Sidebar";
import Navbar from "../components/main/Navbar.jsx";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-black">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
