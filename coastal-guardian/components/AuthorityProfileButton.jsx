"use client"

import Link from "next/link"
import { UserCircle2, LogOut } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthorityProfileButton() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const router = useRouter()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const handleLogout = () => {
    // TODO: Add real logout logic if needed
    router.push("/login")
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm text-slate-900 focus:outline-none"
        aria-label="Profile"
      >
        <UserCircle2 size={20} />
        <span className="hidden sm:inline">Profile</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-sky-100 rounded-lg shadow-lg z-50">
          <Link
            href="/authority/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-sky-50 text-sky-700"
            onClick={() => setOpen(false)}
          >
            <UserCircle2 size={16} />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-sky-50 text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}