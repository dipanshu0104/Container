import React from "react";
import { FolderPlus, Cast, Link, UserPlus } from "lucide-react";

const OPTIONS = [
  {
    id: "folder",
    label: "New Folder",
    icon: FolderPlus,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    hover: "hover:bg-blue-500/20",
  },
  {
    id: "cast",
    label: "Cast",
    icon: Cast,
    color: "text-green-400",
    bg: "bg-green-500/10",
    hover: "hover:bg-green-500/20",
  },
  {
    id: "share",
    label: "Share Link",
    icon: Link,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    hover: "hover:bg-yellow-500/20",
  },
  {
    id: "invite",
    label: "Invite",
    icon: UserPlus,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    hover: "hover:bg-pink-500/20",
  },
];

const OptionsCards = () => {
  return (
    <div
      className="
        grid gap-4 py-6
        grid-cols-2
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {OPTIONS.map(({ id, ...option }) => (
        <Card key={id} {...option} />
      ))}
    </div>
  );
};

const Card = ({ label, icon: Icon, color, bg, hover }) => {
  return (
    <button
      className={`
        group w-full
        flex items-center justify-center gap-3
        h-20 sm:h-20
        rounded-xl
        border border-white/5
        ${bg} ${hover}
        transition-all duration-200
        hover:scale-[1.02]
        active:scale-95
      `}
    >
      <Icon
        size={22}
        className={`${color} transition-transform duration-200 group-hover:scale-110`}
      />
      <span className={`text-sm sm:text-base font-medium ${color}`}>
        {label}
      </span>
    </button>
  );
};

export default OptionsCards;
