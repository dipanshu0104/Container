import { ArrowRight, Check } from "lucide-react";

const CustomCheckbox = ({ checked, onChange, label, description }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        {/* The Custom Box */}
        <div className="w-4 h-4 rounded border border-neutral-700 bg-black transition-all 
          peer-checked:bg-blue-600 peer-checked:border-blue-600 
          group-hover:border-neutral-500 peer-focus:ring-2 peer-focus:ring-blue-500/50">
        </div>
        {/* The Checkmark Icon */}
        <Check 
          size={12} 
          className="absolute left-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100 stroke-[3px]" 
        />
      </div>
      <div>
        {label && <span className="font-semibold text-white block leading-tight">{label}</span>}
        {description && <p className="text-neutral-500 text-sm mt-1">{description}</p>}
      </div>
    </label>
  );
};

export default function Step4({ back, next }) {
  return (
    <div className=" flex flex-col items-center">
      <div className="text-neutral-500 text-xs mb-8">Step 4 of 4</div>
    <div className="max-w-2xl mx-auto text-white p-8 bg-[#0d0d0d81] border border-neutral-900 rounded-xl">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-1">Sharing & Security</h2>
      <p className="text-sm mb-8 text-zinc-400">
        Configure access and sharing settings
      </p>

      {/* Network Sharing Card */}
      <div className="bg-black/20 border border-neutral-900 rounded-xl p-6 mb-4">
        <CustomCheckbox 
          defaultChecked 
          label="Enable Network Sharing" 
          description="Allow other devices on your network to access your NAS"
        />
      </div>

      {/* Security Settings Card */}
      <div className="bg-black/20 border border-neutral-900 rounded-xl p-6 mb-10">
        <h3 className="text-sm font-bold mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-white mb-3 uppercase tracking-tight">
              Default User Permissions
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="w-4 h-4 rounded border border-neutral-700 bg-black peer-checked:bg-blue-600 peer-checked:border-blue-600"></div>
                  <Check size={12} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3px]" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">Read</span>
              </label>

              <label className="flex items-center gap-3 text-sm cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="w-4 h-4 rounded border border-neutral-700 bg-black peer-checked:bg-blue-600 peer-checked:border-blue-600"></div>
                  <Check size={12} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3px]" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">Write</span>
              </label>

              <label className="flex items-center gap-3 text-sm cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 rounded border border-neutral-700 bg-black peer-checked:bg-blue-600 peer-checked:border-blue-600"></div>
                  <Check size={12} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3px]" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">Delete</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={back}
          className="bg-transparent border border-neutral-800 text-white px-6 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={next}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          Next <ArrowRight size={18} />
        </button>
      </div>
    </div>
    </div>
  );
}