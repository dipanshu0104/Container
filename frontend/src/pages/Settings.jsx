import { Routes, Route, Navigate } from "react-router-dom";

import Tabs from "../components/settings/Tabs";

import GeneralSection from "../components/settings/sections/GeneralSection";
import SecuritySection from "../components/settings/sections/SecuritySection";
import SessionsSection from "../components/settings/sections/SessionsSection";
import AdvancedSection from "../components/settings/sections/AdvancedSection";

export default function SettingsPage() {
  return (
    <div className="bg-black text-white p-4 md:p-8 overflow-auto custom-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>

        <p className="text-gray-400 text-sm">
          Manage your NAS and preferences
        </p>
      </div>

      <Tabs />

      <Routes>
        <Route path="/" element={<Navigate to="general" replace />} />

        <Route path="general" element={<GeneralSection />} />

        <Route path="security" element={<SecuritySection />} />

        <Route path="sessions" element={<SessionsSection />} />

        <Route path="advanced" element={<AdvancedSection />} />
      </Routes>
    </div>
  );
}