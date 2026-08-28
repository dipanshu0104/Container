import { ArrowRight, HardDrive, Folder, Settings } from "lucide-react";

export default function Step1({ nasName, setNasName, next }) {
  return (
    <div className=" flex flex-col items-center">
      {/* Progress Indicator */}
      <div className="text-neutral-500 text-xs mb-8">Step 1 of 4</div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-[#0d0d0d81] border border-neutral-900 rounded-xl p-6">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-blue-500/10 p-3 rounded-full mb-4">
            <HardDrive className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome to NAS Setup</h2>
          <p className="text-neutral-400">
            Let's configure your personal NAS storage solution
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-10 bg-[#0d0d0d] p-5 rounded-xl">
          <label className="block text-sm font-semibold mb-3">
            Setup your NAS Name
          </label>
          <input
            value={nasName}
            onChange={(e) => setNasName(e.target.value)}
            placeholder="My NAS"
            className="w-full text-sm bg-black border border-neutral-900 rounded-lg p-2 text-white focus:outline-none"
          />
          <p className="text-neutral-500 text-xs mt-2">
            This name will identify your NAS on your network
          </p>
        </div>

        {/* Setup List */}
        <div className="space-y-4 mb-12">
          <p className="text-sm font-semibold">What you'll setup:</p>
          <div className="flex items-center gap-3">
            <HardDrive size={18} className="text-blue-500" />
            <span className="text-neutral-300 text-sm">
              Configure storage drives
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Folder size={18} className="text-blue-500" />
            <span className="text-neutral-300 text-sm">
              Create folder structure
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-blue-500" />
            <span className="text-neutral-300 text-sm">
              Enable sharing and security
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-neutral-900">
          <button className="bg-neutral-800 text-neutral-500 px-6 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
            Back
          </button>
          <button
            onClick={next}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
