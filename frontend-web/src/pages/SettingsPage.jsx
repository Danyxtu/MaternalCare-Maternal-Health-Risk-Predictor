import React from "react";
import { Settings, Bell, Lock, Eye, Globe, Database, ShieldCheck, Laptop } from "lucide-react";

const SettingsPage = () => {
  const sections = [
    {
      title: "General Settings",
      description: "Manage your account preferences and platform localization.",
      icon: <Globe className="text-blue-500" size={20} />,
      options: ["Language & Region", "Timezone", "Date Format"]
    },
    {
      title: "Notifications",
      description: "Configure how you receive alerts and system updates.",
      icon: <Bell className="text-amber-500" size={20} />,
      options: ["Email Notifications", "In-App Alerts", "System Status Updates"]
    },
    {
      title: "Security & Privacy",
      description: "Enhance your account security and data protection.",
      icon: <Lock className="text-rose-500" size={20} />,
      options: ["Change Password", "Two-Factor Authentication", "Active Sessions"]
    },
    {
      title: "Data Management",
      description: "Control how medical data is processed and stored.",
      icon: <Database className="text-emerald-500" size={20} />,
      options: ["Audit Logs Retention", "Data Export", "Backup Settings"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 text-[16px] font-medium">Configure the Maternal Care platform to your needs.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-[13px] font-bold">
          <ShieldCheck size={16} />
          System Optimal
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">{section.title}</h3>
                <p className="text-slate-400 text-[12px] font-medium italic">Available soon</p>
              </div>
            </div>
            <p className="text-slate-500 text-[14px] leading-relaxed mb-6">
              {section.description}
            </p>
            <div className="space-y-2">
              {section.options.map((opt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 opacity-60 grayscale cursor-not-allowed">
                  <span className="text-[13px] font-semibold text-slate-600">{opt}</span>
                  <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
            <Laptop size={32} />
          </div>
          <div>
            <h3 className="text-[20px] font-bold">Developer Mode</h3>
            <p className="text-slate-400 text-[14px]">Access advanced debugging and API configuration tools.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg active:scale-95 whitespace-nowrap">
          Enable Advanced Tools
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
