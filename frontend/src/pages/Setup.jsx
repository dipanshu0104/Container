import { useState } from "react";
// import ProgressBar from "./ProgressBar";
import Step1 from "../components/setup/Step1";
import Step2 from "../components/setup/Step2";
import Step3 from "../components/setup/Step3";
import Step4 from "../components/setup/Step4";

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const [nasName, setNasName] = useState("My NAS");
  const [drives, setDrives] = useState([{ name: "Storage Drive", path: "/mnt/storage", size: "4 TB" }]);
  const [folders, setFolders] = useState(["Documents", "Photos", "Videos"]);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-black text-white flex justify-center py-4 px-2">
      <div className="w-full max-w-2xl  rounded-2xl p-0 sm:p-6 ">
        <ProgressBar step={step} />

        {step === 1 && <Step1 nasName={nasName} setNasName={setNasName} next={next} />}
        {step === 2 && <Step2 drives={drives} setDrives={setDrives} next={next} back={back} />}
        {step === 3 && <Step3 folders={folders} setFolders={setFolders} next={next} back={back} />}
        {step === 4 && <Step4 back={back} />}
      </div>
    </div>
  );
}

// ================= ProgressBar.jsx =================
function ProgressBar({ step }) {
  return (
    <div className="flex mb-6 gap-2">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded transition-all duration-500 ease-in-out ${
            step >= s ? "bg-blue-500" : "bg-neutral-700"
          }`}
        />
      ))}
    </div>
  );
}