"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useState } from "react"

const hotspots = [
  { id: "h1", name: "Gulf of Kutch", x: 35, y: 42, severity: "High" },
  { id: "h2", name: "Chilika Lake", x: 62, y: 58, severity: "Medium" },
  { id: "h3", name: "Bay of Bengal Shelf", x: 78, y: 30, severity: "Low" },
]

export default function AlgaeMapPage() {
  const [active, setActive] = useState(hotspots[0])

  return (
    <>
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">Algal Blooms Map</h1>
        <p className="text-sm text-slate-600">Click a hotspot to drill down into location details.</p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="relative aspect-[4/3] rounded border bg-[url('/coastline-map.png')] bg-cover">
            {hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => setActive(h)}
                className="absolute h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={`Hotspot ${h.name}`}
                title={`${h.name} (${h.severity})`}
              />
            ))}
          </div>
          <div className="lg:col-span-2 rounded border p-4">
            <h2 className="font-semibold">{active.name}</h2>
            <p className="text-sm text-slate-600">Severity: {active.severity}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded border p-3">
                <div className="text-xs text-slate-500">Chlorophyll</div>
                <div className="font-semibold">Elevated</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-xs text-slate-500">Temperature</div>
                <div className="font-semibold">31.2°C</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-xs text-slate-500">Turbidity</div>
                <div className="font-semibold">Moderate</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-xs text-slate-500">DO</div>
                <div className="font-semibold">6.1 mg/L</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
