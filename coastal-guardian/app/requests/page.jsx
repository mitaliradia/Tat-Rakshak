"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useState } from "react"
import { useRequests } from "@/hooks/useApi"
import { requestsService } from "@/services"
import { Button } from "@/components/ui/button"

function RequestCard({ item, onUpdate, updating }) {
  return (
    <div className="rounded border p-4 flex flex-col gap-2 bg-sky-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{item.timeAgo || item.time}</div>
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
      <div className="text-xs text-slate-600">Reporter: {item.reporterName || item.reporter}</div>
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
          disabled={updating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {updating ? 'Updating...' : 'Approve'}
        </Button>
        <Button 
          onClick={() => onUpdate(item.id, "rejected")} 
          disabled={updating}
          variant="outline"
        >
          {updating ? 'Updating...' : 'Reject'}
        </Button>
      </div>
    </div>
  )
}

export default function RequestsPage() {
  const { data: requests, loading, error, refetch } = useRequests()
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async (id, status) => {
    setUpdating(true)
    try {
      const result = await requestsService.updateRequest(id, { status })
      if (result.success) {
        // Refresh the requests list
        refetch()
      } else {
        console.error('Failed to update request:', result.message)
      }
    } catch (error) {
      console.error('Error updating request:', error)
    }
    setUpdating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-8 text-center">Requests & Reports</h1>
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
              <p className="text-sky-700 mt-4">Loading requests...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              Error loading requests: {error}
            </div>
          )}
          
          {requests && requests.length === 0 && !loading ? (
            <p className="text-slate-700 text-center">
              No requests at the moment.
            </p>
          ) : requests && (
            <div className="space-y-6">
              {requests.map((item) => (
                <RequestCard key={item.id} item={item} onUpdate={handleUpdate} updating={updating} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
