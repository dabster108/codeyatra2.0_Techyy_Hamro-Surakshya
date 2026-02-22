"use client";

import { useState } from "react";
import { UserPlus, Plus, ShieldCheck } from "lucide-react";
import { useRelational } from "@/components/providers/relational-provider";
import { fiscalYearData } from "@/lib/data";
import { NEPAL_DISTRICT_MAP } from "@/lib/nepal-districts";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BeneficiaryRegistrationProps {
  defaultProvinceId?: string;
  defaultDistrictId?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function BeneficiaryRegistration({ 
  defaultProvinceId = "", 
  defaultDistrictId = "", 
  onSuccess,
  compact = false
}: BeneficiaryRegistrationProps) {
  const { fiscalYear } = useDashboard();
  const { addBeneficiary, addReliefDistribution } = useRelational();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    citizenshipNumber: "",
    provinceId: defaultProvinceId,
    districtId: defaultDistrictId,
    wardNumber: 1,
    disasterType: "Fire",
    reliefType: "Emergency Cash",
    amount: "",
    officerId: "",
    officerName: ""
  });

  const provinces = Object.keys(fiscalYearData[fiscalYear].provinces);
  const districts = formData.provinceId ? NEPAL_DISTRICT_MAP[formData.provinceId] : [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.citizenshipNumber || !formData.provinceId || !formData.districtId || !formData.amount) {
      toast.error("Please fill all required operational fields.");
      return;
    }

    const benId = `ben-${Date.now()}`;
    
    addBeneficiary({
      fullName: formData.fullName,
      citizenshipNumber: formData.citizenshipNumber,
      provinceId: formData.provinceId,
      districtId: formData.districtId,
      wardNumber: Number(formData.wardNumber),
    });

    addReliefDistribution({
      beneficiaryId: benId,
      districtAllocationId: `alloc-${formData.districtId}`,
      disasterType: formData.disasterType,
      reliefType: formData.reliefType,
      amount: Number(formData.amount),
      officerId: formData.officerId || "OFF-999",
      officerName: formData.officerName || "Duty Officer",
      provinceId: formData.provinceId,
      districtId: formData.districtId,
    });

    toast.success("Registration successful.");
    setShowForm(false);
    if (onSuccess) onSuccess();
    
    setFormData({
      ...formData,
      fullName: "",
      citizenshipNumber: "",
      amount: ""
    });
  };

  return (
    <div className="space-y-4">
      {!showForm && (
        <button 
          onClick={() => setShowForm(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-[#003893] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#002d75] transition-all shadow-md",
            compact && "w-full justify-center"
          )}
        >
          <UserPlus size={16} /> New Entry
        </button>
      )}

      {showForm && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#003893] text-white flex items-center justify-center rounded">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase leading-none">Operational Registration</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Direct Entry System</p>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(false)}
              className="text-[10px] font-bold text-slate-400 hover:text-[#DC143C] uppercase"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Citizenship No.</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.citizenshipNumber}
                  onChange={e => setFormData({...formData, citizenshipNumber: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Relief Amount</label>
                <input 
                  type="number" 
                  required
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Province</label>
                <select 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.provinceId}
                  onChange={e => setFormData({...formData, provinceId: e.target.value, districtId: ""})}
                >
                  <option value="">Select</option>
                  {provinces.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">District</label>
                <select 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.districtId}
                  disabled={!formData.provinceId}
                  onChange={e => setFormData({...formData, districtId: e.target.value})}
                >
                  <option value="">Select</option>
                  {districts.map(d => <option key={d} value={d.toLowerCase().replace(/ /g, "-")}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Disaster</label>
                <select 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.disasterType}
                  onChange={e => setFormData({...formData, disasterType: e.target.value})}
                >
                  <option value="Fire">Fire</option>
                  <option value="Flood">Flood</option>
                  <option value="Landslide">Landslide</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Officer Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.officerName}
                  onChange={e => setFormData({...formData, officerName: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase">Officer ID</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-[#003893]"
                  value={formData.officerId}
                  onChange={e => setFormData({...formData, officerId: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="px-8 py-3 bg-[#003893] text-white rounded text-xs font-black uppercase tracking-widest shadow-lg hover:translate-y-[-1px] transition-all"
              >
                Submit Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
