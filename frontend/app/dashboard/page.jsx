"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import Link from "next/link"
import { Map, ListChecks as ListCheck, Activity } from "lucide-react"

function CardLink({ href, title, desc, icon }) {
  const Icon = icon
  return (
    <Link
      href={href}
      className="rounded-lg border p-5 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-700"
    >
      <div className="flex items-center gap-3">
        <Icon className="text-emerald-500" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </Link>
  )
}

export default function DashboardPage() {
  return (
    <>
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardLink href="/algae" title="Algal Blooms Map" desc="Drill into hotspots and locations." icon={Map} />
          <CardLink
            href="/requests"
            title="Pending Reports Queue"
            desc="Review community-reported issues."
            icon={ListCheck}
          />
          <CardLink
            href="/calamity"
            title="Natural Calamity Visualization"
            desc="Model-driven sensed data charts."
            icon={Activity}
          />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Settings</h2>
          <div className="mt-3 rounded border p-4">
            <p className="text-sm text-slate-600">Basic settings can be added here.</p>
          </div>
        </section>
      </main>
    </>
  )
}
