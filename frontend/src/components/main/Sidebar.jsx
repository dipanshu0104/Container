import { useState, useMemo } from "react";
import { Settings, HelpCircle, X, ChevronDown } from "lucide-react";

import { useFileStore } from "../../store/useFileStore";
import { calculateFileStats } from "../../utils/formatters";
import { MAIN_NAV, CATEGORY_NAV } from "../../config/sidebar.config";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Container.png"

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const files = useFileStore((state) => state.files);

  const fileCounts = useMemo(() => calculateFileStats(files, "count"), [files]);

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-4 text-xl z-50 md:hidden rounded-lg px-3 py-2 text-white hover:bg-neutral-800"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 bg-black
          border-r border-neutral-800
          flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        {/* Header */}
        <div className="flex items-center text-white justify-between h-17 px-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <img src={logo} alt="logo" />
            </div>
            <span className="text-xl font-semibold">Container</span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 rounded-md hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="space-y-2">
            {MAIN_NAV.map(({ key, ...item }) => (
              <NavItem key={key} {...item} onClick={closeSidebar} />
            ))}
          </div>

          {/* Categories */}
          <div className="mt-6">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-300"
            >
              <span className="text-[14.5px]">Categories</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`mt-4 space-y-1 transition-all duration-200 ${
                categoriesOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {CATEGORY_NAV.map(({ key, ...cat }) => (
                <NavItem
                  key={key}
                  {...cat}
                  right={fileCounts[key]}
                  onClick={closeSidebar}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-3 space-y-3">
          <NavItem
            icon={Settings}
            label="Settings"
            path="/Settings"
            onClick={closeSidebar}
          />
          <NavItem
            icon={HelpCircle}
            label="Help & Support"
            onClick={closeSidebar}
          />
        </div>
      </aside>
    </>
  );
}

/* ---------------- NavItem ---------------- */

function NavItem({ icon: Icon, label, right, color, path, onClick }) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => `
        group flex w-full items-center justify-between
        rounded-xl px-3 py-2 text-sm transition
        ${
          isActive
            ? "bg-neutral-900 text-white"
            : "text-neutral-300 hover:bg-neutral-900"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={21}
          className={`${color || "text-neutral-300 group-hover:text-white"}`}
        />
        <span className="font-semibold text-[14.5px] group-hover:text-white">
          {label}
        </span>
      </div>

      {right && (
        <span className="text-md text-neutral-500 group-hover:text-neutral-300">
          {right}
        </span>
      )}
    </NavLink>
  );
}
