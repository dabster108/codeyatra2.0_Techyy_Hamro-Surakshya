"use client";

import { useMemo } from "react";
import { 
  History, 
  User, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Database, 
  TrendingUp, 
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRelational } from "@/components/providers/relational-provider";
import { cn } from "@/lib/utils";

export default function ActivityLogPage() {
  const { activities } = useRelational();

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString("en-NP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "Financial": return <TrendingUp size={14} className="text-[#003893]" />;
      case "Data Entry": return <Database size={14} className="text-emerald-600" />;
      default: return <Activity size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Activity Log</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Internal System Audit & Accountability Trail</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-[#003893] uppercase">
          <History size={12} />
          Session History
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">System Activity Trail</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                  <CheckCircle2 size={10} /> Live Monitoring
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase w-48">Timestamp</th>
                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Actor</th>
                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Action type</th>
                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase text-right">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2 opacity-30">
                          <History size={48} />
                          <p className="text-xs font-bold uppercase italic">No activity recorded in the current session.</p>
                        </div>
                      </td>
                    </tr>
                  ) : activities.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600 tabular-nums">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                            <User size={12} className="text-slate-500" />
                          </div>
                          <span className="text-xs font-black text-slate-900 uppercase">{log.actor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1 px-1.5 rounded bg-slate-50 border border-slate-200">
                            {getIcon(log.type)}
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{log.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-slate-700">{log.action}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-[10px] font-black text-[#003893] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                          {log.target}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Historical Placeholder Log */}
                  <tr className="bg-slate-50/50 opacity-60 italic">
                    <td className="px-4 py-4 text-[10px] font-bold text-slate-400">--- END OF SESSION ---</td>
                    <td colSpan={4} className="px-4 py-4 text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                      Historical archival data is stored in the central NDRRMA vault
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-300 p-5 rounded shadow-sm">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#003893]" /> Integrity Shield
            </h4>
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter">System Integrity</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-black text-emerald-600">VERIFIED</span>
                  <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded">
                <p className="text-[10px] font-black text-blue-800 uppercase tracking-tighter">Audit Frequency</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-black text-[#003893]">REAL-TIME</span>
                  <TrendingUp size={12} className="text-[#003893]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded shadow-lg border border-white/10">
            <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-[#DC143C]" /> Operational Alert
            </h4>
            <p className="text-[10px] font-bold leading-relaxed text-slate-400 mb-4">
              Unusual activity or unauthorized fund manipulation is flagged automatically and reported to the ministerial security tier.
            </p>
            <button className="w-full py-2 bg-white/10 border border-white/10 rounded text-[9px] font-black uppercase hover:bg-white/20 transition-all">
              Download Session Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
