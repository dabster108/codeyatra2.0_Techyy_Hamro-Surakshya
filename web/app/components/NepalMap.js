"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PREDICTIONS } from "../data/predictions";

const RISK_COLORS = {
  extreme:  { fill: "#ef4444", stroke: "#b91c1c" }, // Red for extreme
  high:     { fill: "#f97316", stroke: "#c2410c" }, // Orange for high
  medium:   { fill: "#f59e0b", stroke: "#d97706" }, // Amber for medium
  // low:      { fill: "#3b82f6", stroke: "#1d4ed8" }, // Blue for low
  minimal:  { fill: "#9ca3af", stroke: "#4b5563" }, // Gray for minimal
  // Backwards compatibility with old severity names
  critical: { fill: "#ef4444", stroke: "#b91c1c" }, // Map to extreme
  moderate: { fill: "#f59e0b", stroke: "#d97706" }, // Map to medium
};

export default function NepalMap({ onSelect, selected, predictions, data, onMarkerClick }) {
  const mapData = data || predictions || PREDICTIONS;
  const handleSelect = onSelect || onMarkerClick || (() => {});

  return (
    <MapContainer
      center={[28.1, 84.1]}
      zoom={7}
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "#f8fafc", position: "relative", zIndex: 1 }}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Light map tiles
      />
      {mapData.map((p) => {
        const col = RISK_COLORS[p.severity] || RISK_COLORS.minimal; // Fallback to minimal if undefined
        const radius = 7 + (p.risk / 100) * 5;
        const isSelected = selected?.id === p.id;
        return (
          <CircleMarker key={p.id} center={[p.lat, p.lng]}
            radius={isSelected ? radius + 5 : radius}
            pathOptions={{
              fillColor: col.fill, fillOpacity: isSelected ? 0.95 : 0.6,
              color: col.stroke, weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => handleSelect(p) }}>
            <Tooltip permanent={false} direction="top" offset={[0, -6]}>
              <div className="text-xs font-semibold text-slate-800">
                <span className="block font-bold">{p.name}</span>
                <span className="text-slate-500">{p.type}</span>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
