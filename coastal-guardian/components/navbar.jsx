"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-sky-700">
          Coastal Guardian
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-sky-700 hover:bg-sky-800 text-white">Sign up</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
