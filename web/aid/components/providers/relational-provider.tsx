"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { fiscalYearData, Province, District } from '@/lib/data';
import { useDashboard } from './dashboard-provider';

interface Beneficiary {
  id: string;
  fullName: string;
  citizenshipNumber: string;
  provinceId: string;
  districtId: string;
  wardNumber: number;
  createdAt: string;
}

interface ReliefDistribution {
  id: string;
  beneficiaryId: string;
  districtAllocationId: string;
  disasterType: string;
  reliefType: string;
  amount: number;
  officerId: string;
  officerName: string;
  createdAt: string;
  provinceId: string;
  districtId: string;
}

interface Activity {
  id: string;
  type: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

interface RelationalContextType {
  beneficiaries: Beneficiary[];
  reliefDistributions: ReliefDistribution[];
  activities: Activity[];
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'createdAt'>) => void;
  addReliefDistribution: (distribution: Omit<ReliefDistribution, 'id' | 'createdAt'>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getDistrictFinancials: (districtId: string) => { used: number; remaining: number };
  getProvinceFinancials: (provinceId: string) => { used: number; remaining: number };
}

const RelationalContext = createContext<RelationalContextType | undefined>(undefined);

export function RelationalProvider({ children }: { children: React.ReactNode }) {
  const { fiscalYear } = useDashboard();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [reliefDistributions, setReliefDistributions] = useState<ReliefDistribution[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBeneficiaries = localStorage.getItem('beneficiaries');
    const savedDistributions = localStorage.getItem('reliefDistributions');
    const savedActivities = localStorage.getItem('activities');
    if (savedBeneficiaries) setBeneficiaries(JSON.parse(savedBeneficiaries));
    if (savedDistributions) setReliefDistributions(JSON.parse(savedDistributions));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
    localStorage.setItem('reliefDistributions', JSON.stringify(reliefDistributions));
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [beneficiaries, reliefDistributions, activities]);

  const addActivity = (data: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...data,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addBeneficiary = (data: Omit<Beneficiary, 'id' | 'createdAt'>) => {
    const newBeneficiary: Beneficiary = {
      ...data,
      id: `ben-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBeneficiaries(prev => [newBeneficiary, ...prev]);
    addActivity({
      type: "Data Entry",
      actor: "Government Officer",
      action: "Registered Beneficiary",
      target: data.fullName
    });
  };

  const addReliefDistribution = (data: Omit<ReliefDistribution, 'id' | 'createdAt'>) => {
    const newDistribution: ReliefDistribution = {
      ...data,
      id: `relief-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReliefDistributions(prev => [newDistribution, ...prev]);
    addActivity({
      type: "Financial",
      actor: data.officerName,
      action: "Allocated Relief Funds",
      target: `NPR ${data.amount} to ${data.districtId.toUpperCase()}`
    });
  };

  const getDistrictFinancials = (districtId: string) => {
    const relevantDistributions = reliefDistributions.filter(d => d.districtId === districtId);
    const newUsed = relevantDistributions.reduce((sum, d) => sum + d.amount, 0);
    
    let initialAllocation = 0;
    let baseUsed = 0;
    
    Object.values(fiscalYearData[fiscalYear].provinces).forEach(p => {
      const d = p.districts.find(dist => dist.id === districtId);
      if (d) {
        initialAllocation = d.allocated;
        baseUsed = d.used;
      }
    });

    const totalUsed = baseUsed + newUsed;

    return {
      used: totalUsed,
      remaining: initialAllocation - totalUsed
    };
  };

  const getProvinceFinancials = (provinceId: string) => {
    const relevantDistributions = reliefDistributions.filter(d => d.provinceId === provinceId);
    const newUsed = relevantDistributions.reduce((sum, d) => sum + d.amount, 0);
    
    const p = fiscalYearData[fiscalYear].provinces[provinceId];
    const initialAllocation = p ? p.allocatedToDistricts : 0;
    const baseUsed = p ? p.used : 0;

    const totalUsed = baseUsed + newUsed;

    return {
      used: totalUsed,
      remaining: initialAllocation - totalUsed
    };
  };

  return (
    <RelationalContext.Provider value={{ 
      beneficiaries, 
      reliefDistributions, 
      activities,
      addBeneficiary, 
      addReliefDistribution,
      addActivity,
      getDistrictFinancials,
      getProvinceFinancials
    }}>
      {children}
    </RelationalContext.Provider>
  );
}

export const useRelational = () => {
  const context = useContext(RelationalContext);
  if (!context) throw new Error('useRelational must be used within a RelationalProvider');
  return context;
};
