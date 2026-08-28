import { HardDrive } from "lucide-react";
import CustomSelect from "../settings/CustomSelect";

export default function EditDriveModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  loading
}) {
  const driveTypes = ["HDD", "SSD", "NVMe"];
  const units = ["MB", "GB", "TB", "PB"];

  const UNIT_MULTIPLIERS = {
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
  };

  const toBytes = (value, unit) => {
    return Number(value || 0) * UNIT_MULTIPLIERS[unit];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="
          relative
          w-full
          max-w-115
          rounded-2xl
          border
          border-neutral-900
          bg-black
          shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_50px_rgba(0,0,0,0.7)]
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            text-neutral-500
            hover:text-white
            transition
          "
        >
          ✕
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <HardDrive
                size={18}
                className="text-blue-400"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Optimize Drive
              </h2>

              <p className="text-sm text-neutral-400">
                Optimize the existed storage drive of your NAS
              </p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-5"
          >
            {/* Drive Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Drive Name
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g., Backup Storage, Archive Drive"
                className="
                  w-full
                  py-1.5
                  px-4
                  rounded-lg
                  border
                  border-neutral-900
                  bg-[#0e0e0e]
                  text-white
                  text-sm
                  placeholder:text-neutral-500
                  outline-none
                  focus:border-[#0b8fff]
                "
              />

              <p className="mt-2 text-xs text-neutral-500">
                A friendly name to identify this drive
              </p>
            </div>

            {/* Mount Path */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Mount Path
              </label>

              <input
                type="text"
                value={formData.drivePath}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    drivePath: e.target.value,
                  }))
                }
                placeholder="e.g., /mnt/storage2, /media/backup"
                className="
                  w-full
                  py-1.5
                  px-4
                  rounded-lg
                  border
                  border-neutral-900
                  bg-[#0e0e0e]
                  text-white
                  text-sm
                  placeholder:text-neutral-500
                  outline-none
                  focus:border-[#0b8fff]
                "
              />

              <p className="mt-2 text-xs text-neutral-500">
                The mount point for this drive on your NAS
              </p>
            </div>

            {/* Capacity + Unit + Type */}
            <div className="grid grid-cols-[1fr_110px_1fr] gap-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Capacity
                </label>

                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => {
                    const capacity = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      capacity,
                      totalSpace: toBytes(capacity, prev.unit),
                    }));
                  }}
                  className="
    w-full
    py-1.5
    px-4
    rounded-lg
    border
    border-neutral-900
    bg-[#0e0e0e]
    text-white
    text-sm
    outline-none
    focus:border-[#0b8fff]
  "
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Unit
                </label>

                <CustomSelect
                  value={formData.unit}
                  options={units}
                  onChange={(unit) =>
                    setFormData((prev) => ({
                      ...prev,
                      unit,
                      totalSpace: toBytes(prev.capacity, unit),
                    }))
                  }
                />
              </div>

              {/* Drive Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Drive Type
                </label>

                <CustomSelect
                  value={formData.type}
                  options={driveTypes}
                  onChange={(type) =>
                    setFormData((prev) => ({
                      ...prev,
                      type,
                    }))
                  }
                />
              </div>
            </div>

            {/* Note */}
            <div className="rounded-xl border border-neutral-900 bg-[#0e0e0e] p-4">
              <p className="text-sm text-neutral-400">
                <span className="font-semibold text-white">
                  Note:
                </span>{" "}
                Ensure the drive is properly connected and
                mounted before adding it to the NAS.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="
                  py-1.5
                  px-4  
                  rounded-lg
                  border
                  border-neutral-800
                  text-white
                  text-sm
                  hover:bg-neutral-900
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  py-1.5
                  px-4
                  rounded-lg
                  bg-[#0b8fff]
                  text-white
                  text-sm
                  font-medium
                  hover:bg-[#1c9cff]
                  transition
                "
              >
                {loading ? "Editing...":"Edit drive"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}