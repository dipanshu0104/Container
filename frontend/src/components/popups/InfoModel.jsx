import Model from "./Model";
import { formatDate, formatSize } from "../../utils/formatters";
import { getFileIconConfig } from "../../utils/fileIconUtil";

const InfoModal = ({ file, open, onClose }) => {
    if (!file) return null;

    const { icon: Icon, color, bgColor } = getFileIconConfig(file.mimeType);

    return (
        <Model isOpen={open} onClose={onClose} title="File Details" width="max-w-md">
            <div className="space-y-5">

                {/* File Header */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">

                    <div className={`w-10 h-10 flex items-center justify-center rounded-md ${bgColor}`}>
                        <Icon size={20} className={color} />
                    </div>

                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate text-white">
                            {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {file.mimeType || "Unknown file"}
                        </p>
                    </div>

                </div>

                {/* File Info */}
                <div className="space-y-3 text-sm">

                    <InfoRow label="Name" value={file.name} />

                    <InfoRow
                        label="Type"
                        value={file.mimeType || "Unknown"}
                    />

                    <InfoRow
                        label="Size"
                        value={formatSize(file.size)}
                    />

                    <InfoRow
                        label="Owner"
                        value={file.owner || "You"}
                    />

                    <InfoRow
                        label="Created"
                        value={formatDate(file.createdAt || file.date)}
                    />

                    <InfoRow
                        label="Last Modified"
                        value={formatDate(file.updatedAt || file.date)}
                    />

                </div>
            </div>
        </Model>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start gap-3 text-gray-300">
        <span className="text-gray-400">{label}</span>

        <span className="text-white font-medium text-right truncate max-w-[60%]">
            {value}
        </span>
    </div>
);

export default InfoModal;