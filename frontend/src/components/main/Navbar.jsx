import { Bell } from "lucide-react";

import SearchBar from "./SearchBar";
import UploadButton from "../files/UploadButton";
import FileLayoutButton from "./FileLayoutButton";
import UserButton from "../authentication/UserButton";

export default function Navbar() {
  return (
    <header className="relative h-17 border-b border-neutral-800 bg-black text-white flex items-center px-4 py-4.5">

      {/* Desktop Search */}
      <div className="hidden md:flex w-full max-w-md">
        <SearchBar />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-3 relative">

        <SearchBar isMobileTrigger />

        <UploadButton />

        <FileLayoutButton />

        <button className="p-2 rounded-md hover:bg-neutral-800 transition">
          <Bell size={18} />
        </button>

        {/* User Dropdown */}
        <UserButton />

      </div>
    </header>
  );
}