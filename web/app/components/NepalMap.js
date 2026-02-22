"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PREDICTIONS } from "../data/predictions";

const RISK_COLORS = {
  critical: { fill: "#ef4444", stroke: "#b91c1c" },
  high:     { fill: "#f97316", stroke: "#c2410c" },
  moderate: { fill: "#eab308", stroke: "#a16207" },
  low:      { fill: "#22c55e", stroke: "#15803d" },
};

export default function NepalMap({ onSelect, selected, predictions }) {
  const data = predictions || PREDICTIONS;

  return (
    <MapContainer
      center={[28.1, 84.1]}
      zoom={7}
      zoomControl={false}
      style={{ height: "100%", width: "100%", background: "#0B0F19" }}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {data.map((p) => {
        const col = RISK_COLORS[p.severity];
        const radius = 7 + (p.risk / 100) * 8;
        const isSelected = selected?.id === p.id;
        return (
          <CircleMarker key={p.id} center={[p.lat, p.lng]}
            radius={isSelected ? radius + 5 : radius}
            pathOptions={{
              fillColor: col.fill, fillOpacity: isSelected ? 0.95 : 0.7,
              color: col.stroke, weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(p) }}>
            <Tooltip permanent={false} direction="top" offset={[0, -6]}>
              <div className="text-xs font-semibold">
                <span className="block font-bold">{p.name}</span>
                <span>{p.type} — </span>
                <span style={{ color: col.fill }} className="font-black">{p.risk}% risk</span>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
