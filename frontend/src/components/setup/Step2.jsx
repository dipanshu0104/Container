import { Plus, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Step2({ drives, setDrives, next, back }) {
  const [newDrive, setNewDrive] = useState({ name: "", path: "" });

  const addDrive = () => {
    if (!newDrive.name || !newDrive.path) return;
    setDrives([...drives, { ...newDrive, size: "4 TB" }]); // Default size to match image
    setNewDrive({ name: "", path: "" });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-neutral-500 text-xs mb-8">Step 2 of 4</div>
      <div className="max-w-lg w-full mx-auto bg-[#0d0d0d81] p-9 rounded-xl border border-neutral-900">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-1 text-white">Storage Drives</h2>
        <p className="text-neutral-500 text-sm mb-8">
          Add and configure your storage drives
        </p>

        {/* Add New Drive Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold mb-4 text-white uppercase tracking-tight">
            Add New Drive
          </h3>
          <div className="space-y-3">
            <input
              placeholder="Drive name (e.g., Main Storage)"
              value={newDrive.name}
              onChange={(e) =>
                setNewDrive({ ...newDrive, name: e.target.value })
              }
              className="w-full bg-[#0e0e0e] border border-neutral-900 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-700"
            />
            <input
              placeholder="Mount path (e.g., /mnt/storage)"
              value={newDrive.path}
              onChange={(e) =>
                setNewDrive({ ...newDrive, path: e.target.value })
              }
              className="w-full bg-[#0e0e0e] border border-neutral-900 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-700"
            />
            <button
              onClick={addDrive}
              className="w-full border bg-black border-neutral-900 py-2.5 rounded-lg flex justify-center items-center gap-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              <Plus size={16} /> Add Drive
            </button>
          </div>
        </div>

        <div className="border-t border-neutral-900 my-6"></div>

        {/* Configured Drives Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold mb-4 text-white uppercase tracking-tight">
            Configured Drives
          </h3>
          <div className="space-y-3">
            {drives.map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-[#0a0a0a] border border-neutral-800 p-4 rounded-xl"
              >
                <div>
                  <div className="font-semibold text-white">{d.name}</div>
                  <div className="text-neutral-500 text-xs mt-0.5">
                    {d.path}
                  </div>
                  <div className="text-neutral-600 text-xs mt-0.5">
                    {d.size || "4 TB"}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDrives(drives.filter((_, idx) => idx !== i))
                  }
                  className="p-2 border border-neutral-800 rounded-lg group hover:border-red-900/50 transition-colors"
                >
                  <Trash2
                    size={18}
                    className="text-red-900 group-hover:text-red-500 transition-colors"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={back}
            className="bg-[#111] border border-neutral-800 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={next}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all"
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
