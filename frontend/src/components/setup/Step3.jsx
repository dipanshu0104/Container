import { Plus, Trash2, ArrowRight, Folder } from "lucide-react";
import { useState } from "react";

export default function Step3({ folders, setFolders, next, back }) {
  const [newFolder, setNewFolder] = useState("");

  const addFolder = () => {
    if (!newFolder) return;
    setFolders([
      ...folders,
      { name: newFolder, path: `/mnt/storage/${newFolder}` },
    ]);
    setNewFolder("");
  };

  return (
    <div className=" flex flex-col items-center">
      <div className="text-neutral-500 text-xs mb-8">Step 3 of 4</div>
      <div className="max-w-lg w-full mx-auto text-white p-8 bg-[#0d0d0d81] border border-neutral-900 rounded-xl">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-1">Folder Structure</h2>
        <p className="text-sm mb-8 text-zinc-400">
          Create and organize your folder structure
        </p>

        {/* Add New Folder Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-tight">
            Add New Folder
          </h3>
          <div className="space-y-3">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Folder name (e.g., Documents, Photos)"
              className="w-full bg-[#0a0a0a] border border-neutral-900 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-700"
            />
            <button
              onClick={addFolder}
              className="w-full bg-black border border-neutral-900 py-2.5 rounded-lg flex justify-center items-center gap-2 text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              <Plus size={16} /> Add Folder
            </button>
          </div>
        </div>

        {/* Existing Folders Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-tight">
            Existing Folders
          </h3>
          <div className="space-y-3">
            {folders.map((f, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-black/20 border border-neutral-800 p-4 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <Folder size={20} className="text-blue-500 fill-blue-500" />
                  <div>
                    <div className="font-semibold text-sm">{f.name || f}</div>
                    <div className="text-neutral-500 text-[11px] mt-0.5">
                      {f.path || `/mnt/storage/${f}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFolders(folders.filter((_, idx) => idx !== i))
                  }
                  className="p-2 border border-neutral-800 rounded-lg group hover:border-red-900/50 transition-colors"
                >
                  <Trash2
                    size={16}
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
            className="bg-transparent border border-neutral-800 text-white px-6 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
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
