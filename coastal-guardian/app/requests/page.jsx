"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useState } from "react"
import { cloneRequests } from "@/lib/data"
import { Button } from "@/components/ui/button"

function RequestCard({ item, onUpdate }) {
  return (
    <div className="rounded border p-4 flex flex-col gap-2 bg-sky-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{item.time}</div>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            item.status === "approved"
              ? "bg-emerald-100 text-emerald-700"
              : item.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {item.status}
        </span>
      </div>
      <div className="text-sm">
        <span className="font-medium">{item.type}</span> · {item.location}
      </div>
      <div className="text-xs text-slate-600">Reporter: {item.reporter}</div>
      <p className="text-sm leading-relaxed">{item.description}</p>
      {item.media?.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-4">
          {item.media.map((m, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-sky-100 bg-white shadow-sm flex items-center justify-center h-32"
            >
              <img
                src={m.url || "/placeholder.svg?height=96&width=160&query=attached%20media"}
                alt="Attached media"
                className="object-cover h-full w-full transition-transform duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex items-center gap-2">
        <Button
          onClick={() => onUpdate(item.id, "approved")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Approve
        </Button>
        <Button onClick={() => onUpdate(item.id, "rejected")} variant="outline">
          Reject
        </Button>
      </div>
    </div>
  )
}

export default function RequestsPage() {
  const [requests, setRequests] = useState(cloneRequests())

  const handleUpdate = (id, status) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-8 text-center">Requests & Reports</h1>
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-6">
          {requests.length === 0 ? (
            <p className="text-slate-700 text-center">
              No requests at the moment.
            </p>
          ) : (
            <div className="space-y-6">
              {requests.map((item) => (
                <RequestCard key={item.id} item={item} onUpdate={handleUpdate} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
