"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Simple role-based users for demo
const USERS = {
  user: { id: 1, name: "Ram Sharma", role: "user", email: "ram@hamrosuraksha.np" },
  government: { id: 2, name: "Ministry of Home Affairs", role: "government", email: "moha@gov.np" },
  koshi: { id: 3, name: "Koshi Province Office", role: "province", province: "Koshi", email: "admin@koshi.gov.np" },
  bagmati: { id: 4, name: "Bagmati Province Office", role: "province", province: "Bagmati", email: "admin@bagmati.gov.np" },
  gandaki: { id: 5, name: "Gandaki Province Office", role: "province", province: "Gandaki", email: "admin@gandaki.gov.np" },
  lumbini: { id: 6, name: "Lumbini Province Office", role: "province", province: "Lumbini", email: "admin@lumbini.gov.np" },
  karnali: { id: 7, name: "Karnali Province Office", role: "province", province: "Karnali", email: "admin@karnali.gov.np" },
  madhesh: { id: 8, name: "Madhesh Province Office", role: "province", province: "Madhesh", email: "admin@madhesh.gov.np" },
  sudurpashchim: { id: 9, name: "Sudurpashchim Province Office", role: "province", province: "Sudurpashchim", email: "admin@sudurpashchim.gov.np" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("hamro_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (key) => {
    const u = USERS[key];
    if (u) {
      setUser(u);
      localStorage.setItem("hamro_user", JSON.stringify(u));
      return u;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hamro_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
