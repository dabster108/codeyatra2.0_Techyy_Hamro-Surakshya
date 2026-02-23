"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  RefreshCw,
  Search,
  Truck,
  Eye,
  Loader2,
  ExternalLink,
  Siren,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS = {
  pending:      { label: "Pending",      color: "text-red-700",    bg: "bg-red-100",    ring: "ring-red-200" },
  acknowledged: { label: "Acknowledged", color: "text-blue-700",   bg: "bg-blue-100",   ring: "ring-blue-200" },
  dispatched:   { label: "Dispatched",   color: "text-purple-700", bg: "bg-purple-100", ring: "ring-purple-200" },
  resolved:     { label: "Resolved",     color: "text-green-700",  bg: "bg-green-100",  ring: "ring-green-200" },
  cancelled:    { label: "Cancelled",    color: "text-gray-700",   bg: "bg-gray-100",   ring: "ring-gray-200" },
};

function timeSince(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ProvinceSOSPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("http://localhost:8005/sos/requests");
      const data = await res.json();
      if (data.success) setRequests(data.requests || []);
    } catch (e) {
      console.error("Failed to fetch SOS requests:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8005/sos/request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...data.request } : r))
        );
      }
    } catch (e) {
      console.error("Failed to update:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return r.full_name.toLowerCase().includes(s) || (r.contact_number || "").includes(s);
    }
    return true;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    acknowledged: requests.filter((r) => r.status === "acknowledged").length,
    dispatched: requests.filter((r) => r.status === "dispatched").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Siren className="h-5 w-5 text-red-600" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-600">
                PROVINCE EMERGENCY CONTROL
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900">
              SOS <span className="text-red-600">Alerts</span>
            </h1>
            {user?.province && (
              <p className="text-sm text-gray-500 mt-1 font-semibold">{user.province} Province</p>
            )}
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-bold transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { key: "all", label: "Total", c: "bg-gray-50 border-gray-200 text-gray-900" },
            { key: "pending", label: "Pending", c: "bg-red-50 border-red-200 text-red-900" },
            { key: "acknowledged", label: "Acknowledged", c: "bg-blue-50 border-blue-200 text-blue-900" },
            { key: "dispatched", label: "Dispatched", c: "bg-purple-50 border-purple-200 text-purple-900" },
            { key: "resolved", label: "Resolved", c: "bg-green-50 border-green-200 text-green-900" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`border rounded-xl p-3 text-left transition-all ${s.c} ${
                filter === s.key ? "ring-2 ring-offset-1 ring-gray-400 shadow" : ""
              }`}
            >
              <div className="text-2xl font-black">{counts[s.key]}</div>
              <div className="text-xs font-bold mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or contact..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Alerts list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Siren className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No SOS alerts</p>
            </div>
          ) : (
            filtered.map((r) => {
              const st = STATUS[r.status] || STATUS.pending;
              const isUpdating = updatingId === r.id;

              return (
                <div
                  key={r.id}
                  className={`border rounded-xl p-5 transition-all ${
                    r.status === "pending"
                      ? "border-red-300 bg-red-50/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {r.full_name}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 ${st.bg} ${st.color} ${st.ring}`}
                        >
                          {st.label}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {timeSince(r.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-5 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="font-mono">{r.contact_number || "N/A"}</span>
                        </div>
                        {r.gps_lat && r.gps_long ? (
                          <a
                            href={`https://www.google.com/maps?q=${r.gps_lat},${r.gps_long}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-blue-600 hover:underline"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="font-mono text-xs">
                              {r.gps_lat.toFixed(4)}, {r.gps_long.toFixed(4)}
                            </span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>No location</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(r.created_at).toLocaleString()}</span>
                        </div>
                      </div>

                      {r.response_team && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-purple-700 font-semibold">
                          <Truck className="h-4 w-4" />
                          {r.response_team}
                        </div>
                      )}
                    </div>

                    {/* Right: action buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {r.status === "pending" && (
                        <button
                          onClick={() => updateStatus(r.id, "acknowledged")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                          Acknowledge
                        </button>
                      )}
                      {r.status === "acknowledged" && (
                        <button
                          onClick={() => updateStatus(r.id, "dispatched")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Truck className="h-3.5 w-3.5" />}
                          Dispatch Team
                        </button>
                      )}
                      {r.status === "dispatched" && (
                        <button
                          onClick={() => updateStatus(r.id, "resolved")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          Resolve
                        </button>
                      )}
                      {r.status === "resolved" && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 text-green-700 text-xs font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
