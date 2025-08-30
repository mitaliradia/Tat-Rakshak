"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const data = [
  { time: "00:00", tide: 1.2, wave: 0.5 },
  { time: "03:00", tide: 1.5, wave: 0.8 },
  { time: "06:00", tide: 2.1, wave: 1.1 },
  { time: "09:00", tide: 2.4, wave: 1.6 },
  { time: "12:00", tide: 2.8, wave: 2.1 },
  { time: "15:00", tide: 2.3, wave: 1.8 },
  { time: "18:00", tide: 1.7, wave: 1.0 },
  { time: "21:00", tide: 1.3, wave: 0.6 },
]

export default function CalamityPage() {
  return (
    <>
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">Natural Calamity Visualization</h1>
        <p className="text-sm text-slate-600">Model-sensed data over the last 24 hours.</p>

        <div className="mt-6 rounded border p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tide" stroke="#0369a1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="wave" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </>
  )
}
