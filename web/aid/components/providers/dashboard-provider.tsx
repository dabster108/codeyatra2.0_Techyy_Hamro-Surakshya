"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardContextType {
  fiscalYear: string;
  setFiscalYear: (year: string) => void;
  availableYears: string[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [fiscalYear, setFiscalYear] = useState("2080/81");
  const availableYears = ["2080/81", "2079/80"];

  return (
    <DashboardContext.Provider value={{ fiscalYear, setFiscalYear, availableYears }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
