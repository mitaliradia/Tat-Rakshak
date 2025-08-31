"use client"

import AuthorityProfileButton from "./AuthorityProfileButton"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, ArrowRight, UserCircle2, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRequests } from "@/hooks/useApi"

export default function AuthorityNavbar() {
  const { data: requests, loading } = useRequests({ status: 'pending', limit: 5 })
  const [recentRequests, setRecentRequests] = useState([])
  
  // Format requests for notification display
  useEffect(() => {
    if (requests && requests.length > 0) {
      const formatted = requests.map(req => ({
        id: req.id,
        type: req.type,
        desc: req.description?.substring(0, 50) + (req.description?.length > 50 ? '...' : '') || 'New report submitted',
        location: req.location
      })).slice(0, 3) // Show only latest 3
      setRecentRequests(formatted)
    } else {
      setRecentRequests([])
    }
  }, [requests])

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/authority" className="font-semibold text-lg text-sky-700">
          TAT - RAKSHAK
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-900">
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative bg-transparent" aria-label="Open reports popover">
                <Bell size={18} />
                {recentRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center">
                    {recentRequests.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Reports</h4>
                <Link href="/requests" className="text-sky-700 text-sm inline-flex items-center gap-1">
                  Open queue <ArrowRight size={14} />
                </Link>
              </div>
              <div className="mt-2 space-y-2">
                {loading && (
                  <div className="text-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-700 mx-auto"></div>
                    <p className="text-xs text-sky-700 mt-1">Loading...</p>
                  </div>
                )}
                
                {!loading && recentRequests.length === 0 && (
                  <div className="text-center py-4 text-sm text-slate-500">
                    No recent reports
                  </div>
                )}
                
                {recentRequests.map((n) => (
                  <div key={n.id} className="rounded border p-2 hover:bg-sky-50 transition-colors">
                    <div className="text-sm font-medium">{n.type}</div>
                    <div className="text-xs text-slate-600">{n.desc}</div>
                    {n.location && (
                      <div className="text-xs text-slate-500 mt-1">📍 {n.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <AuthorityProfileButton />
        </nav>
      </div>
    </header>
  )
}
