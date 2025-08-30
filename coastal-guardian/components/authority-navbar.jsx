"use client"

import AuthorityProfileButton from "./AuthorityProfileButton"
import Link from "next/link"
import { useState } from "react"
import { Bell, ArrowRight, UserCircle2, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const mockNotifications = [
  { id: "n1", type: "Pollution", desc: "Oil sheen reported near pier." },
  { id: "n2", type: "Illegal Dumping", desc: "Bags thrown from vessel." },
]

export default function AuthorityNavbar() {
  const [items] = useState(mockNotifications)

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
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center">
                    {items.length}
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
                {items.map((n) => (
                  <div key={n.id} className="rounded border p-2">
                    <div className="text-sm font-medium">{n.type}</div>
                    <div className="text-xs text-slate-600">{n.desc}</div>
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
