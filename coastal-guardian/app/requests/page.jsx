"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useState } from "react"
import { cloneRequests } from "@/lib/data"
import { Button } from "@/components/ui/button"

function RequestCard({ item, onUpdate }) {
  return (
    <div className="rounded border p-4 flex flex-col gap-2">
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
        <div className="mt-2 grid grid-cols-2 gap-2">
          {item.media.map((m, i) => (
            <img
              key={i}
              src={m.url || "/placeholder.svg?height=96&width=160&query=attached%20media"}
              alt="Attached media"
              className="h-24 w-full object-cover rounded border"
            />
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
  const [items, setItems] = useState(cloneRequests())

  function handleUpdate(id, status) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)))
  }

  return (
    <>
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">Pending Reports Queue</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <RequestCard key={it.id} item={it} onUpdate={handleUpdate} />
          ))}
        </div>
      </main>
    </>
  )
}
