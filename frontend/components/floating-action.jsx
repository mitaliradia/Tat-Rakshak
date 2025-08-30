"use client"

import Link from "next/link"
import { Plus, Flag } from "lucide-react"

export default function FloatingAction({ href = "/", label = "Report an Issue", variant = "user" }) {
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-lg text-white bg-sky-700 hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-700"
      aria-label={label}
    >
      {variant === "user" ? <Flag size={18} /> : <Plus size={18} />}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
