// config/fileMenuActions.js
import {
  Eye,
  Move,
  Download,
  Pencil,
  Info,
  Trash2,
} from "lucide-react";


export const ACTIONS = [
  { id: "preview", label: "Preview", icon: Eye, iconColor: "text-cyan-500" },
  { id: "move", label: "Move", icon: Move, iconColor: "text-purple-500" },
  { id: "download", label: "Download", icon: Download, iconColor: "text-blue-500" },
  { id: "rename", label: "Rename", icon: Pencil, iconColor: "text-green-500" },
  { id: "detail", label: "Detail", icon: Info, iconColor: "text-yellow-500" },
  { id: "delete", label: "Delete", icon: Trash2, iconColor: "text-red-500", danger: true },
];
