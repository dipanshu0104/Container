import {
  House,
  FolderOpen,
  Star,
  Clock,
  Share2,
  Trash2,
  Image,
  Video,
  Music,
  FileText,
  FileArchive,
} from "lucide-react";

export const MAIN_NAV = [
  { key: "home", label: "Home", icon: House , path:"/"},
  { key: "files", label: "My Files", icon: FolderOpen , path:"/MyFiles"},
  { key: "starred", label: "Starred", icon: Star, path:"/Starred"},
  { key: "recent", label: "Recent", icon: Clock, path:"/Recent"},
  { key: "shared", label: "Shared", icon: Share2, path:"/Shared" },
  { key: "trash", label: "Trash", icon: Trash2, path:"/Trash" },
];

export const CATEGORY_NAV = [
  {
    key: "images",
    label: "Images",
    icon: Image,
    color: "text-blue-500",
    path: "/images"
  },
  {
    key: "videos",
    label: "Videos",
    icon: Video,
    color: "text-pink-500",
    path: "/videos"
  },
  {
    key: "audio",
    label: "Audio",
    icon: Music,
    color: "text-green-500",
    path: "/audios"
  },
  {
    key: "docs",
    label: "Docs",
    icon: FileText,
    color: "text-yellow-500",
    path: "/documents"
  },
  {
    key: "other",
    label: "Others",
    icon: FileArchive,
    color: "text-purple-500",
    path: "/others"
  },
];
