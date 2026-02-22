export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Settings</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">System Configuration & User Preferences</p>
        </div>
      </div>

      <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg text-center">
        <p className="text-slate-500 text-sm italic">Administrative configuration panel is restricted to authorized NDRRMA personnel.</p>
      </div>
    </div>
  );
}
