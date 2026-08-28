import { useEffect, useMemo } from "react";
import { useDriveStore } from "../../store/useDriveStore";
import useSocket from "../../hooks/useSocket"
import { formatSize, calculateFileStats } from "../../utils/formatters";

const BREAKDOWN_CONFIG = [
  { key: "images", label: "Images", color: "bg-blue-500" },
  { key: "videos", label: "Videos", color: "bg-pink-500" },
  { key: "audio", label: "Audio", color: "bg-green-500" },
  { key: "docs", label: "Documents", color: "bg-yellow-500" },
  { key: "other", label: "Other", color: "bg-purple-500" },
];

const getPercent = (value, total) =>
  total > 0 ? (value / total) * 100 : 0;

export default function StorageSummary() {
  const { storageStatus, fetchStorageStatus } = useDriveStore();

  useEffect(() => {
    fetchStorageStatus();
  }, [fetchStorageStatus]);

  useSocket({
    "file:list:updated": async () => {
      await fetchStorageStatus();
    },
  });

  const drives = storageStatus?.drives ?? [];
  const files = storageStatus?.files ?? [];
  const folders = storageStatus?.folders ?? [];

  const {
    totalSpace,
    usedSpace,
    availableSpace,
    usedPercent,
    availablePercent,
    breakdown,
    stats,
  } = useMemo(() => {
    const storage = drives.reduce(
      (acc, drive) => {
        acc.total += drive.totalSpace || 0;
        acc.used += drive.usedSpace || 0;
        return acc;
      },
      { total: 0, used: 0 }
    );

    const totalSpace = storage.total;
    const usedSpace = storage.used;
    const availableSpace = Math.max(0, totalSpace - usedSpace);

    const usedPercent = getPercent(usedSpace, totalSpace);
    const availablePercent = getPercent(availableSpace, totalSpace);

    const fileStats = calculateFileStats(files);

    const breakdown = BREAKDOWN_CONFIG.map((item) => ({
      name: item.label,
      size: formatSize(fileStats[item.key]),
      percent: getPercent(fileStats[item.key], fileStats.total),
      color: item.color,
    }));

    const stats = [
      {
        title: "Drives",
        value: drives.length,
        color: "text-white",
      },
      {
        title: "Files",
        value: files.length.toLocaleString(),
        color: "text-white",
      },
      {
        title: "Folders",
        value: folders.length.toLocaleString(),
        color: "text-white",
      },
      {
        title: "Storage Used",
        value: `${usedPercent.toFixed(1)}%`,
        color: "text-orange-400",
      },
    ];

    return {
      totalSpace,
      usedSpace,
      availableSpace,
      usedPercent,
      availablePercent,
      breakdown,
      stats,
    };
  }, [drives, files, folders]);

  return (
    <section className="w-full">
      <h1 className="text-3xl font-bold text-white mb-8">
        Storage Summary
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Total */}
        <div className="rounded-xl border border-sky-900 bg-blue-500/10 p-6">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
            Total Capacity
          </p>

          <h2 className="text-3xl font-bold text-white mb-2">
            {formatSize(totalSpace)}
          </h2>

          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div className="h-full w-full bg-sky-500 rounded-full" />
          </div>

          <p className="mt-2 text-[12px] text-neutral-500">
            All connected drives
          </p>
        </div>

        {/* Used */}
        <div className="rounded-xl border border-yellow-900 bg-yellow-600/10 p-6">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
            Used Space
          </p>

          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            {formatSize(usedSpace)}
          </h2>

          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${usedPercent}%` }}
            />
          </div>

          <p className="mt-2 text-[12px] text-neutral-500">
            {usedPercent.toFixed(1)}% utilized
          </p>
        </div>

        {/* Available */}
        <div className="rounded-xl border border-green-900 bg-green-500/10 p-6">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
            Available
          </p>

          <h2 className="text-3xl font-bold text-emerald-400 mb-2">
            {formatSize(availableSpace)}
          </h2>

          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${availablePercent}%` }}
            />
          </div>

          <p className="mt-2 text-[12px] text-neutral-500">
            {availablePercent.toFixed(1)}% free space
          </p>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Storage Breakdown */}
        <div className="rounded-xl border border-neutral-800 bg-[#050505] p-6">
          <h3 className="text-md font-semibold text-white mb-5">
            Storage Breakdown
          </h3>

          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-neutral-400">
                    {item.name}
                  </span>

                  <span className="font-semibold text-white">
                    {item.size}
                  </span>
                </div>

                <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Stats */}
        <div className="rounded-xl border border-neutral-800 bg-[#050505] p-6">
          <h3 className="text-md font-semibold text-white mb-5">
            Storage Stats
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-lg bg-[#010101] border border-neutral-900/60 p-5"
              >
                <p className="text-sm text-neutral-500 mb-1">
                  {stat.title}
                </p>

                <h4 className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}