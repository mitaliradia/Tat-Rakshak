"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import Link from "next/link"
import { Map, ListChecks as ListCheck, Activity, Waves, CloudLightning } from "lucide-react"

function CardLink({ href, title, desc, icon }) {
  const Icon = icon
  return (
    <Link
      href={href}
      className="rounded-lg border p-5 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-700 transition bg-sky-50 hover:bg-sky-100"
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-8 text-center">Authority Dashboard</h1>
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-8 mb-8">
          <h2 className="text-xl font-bold text-sky-800 mb-2">Overview</h2>
          <p className="text-slate-700 mb-4">
            Welcome to your dashboard. Here you can monitor alerts, manage reports, and view analytics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-2xl font-bold text-sky-700 mb-2">12</span>
              <span className="text-sky-800 font-medium">Active Alerts</span>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-2xl font-bold text-sky-700 mb-2">8</span>
              <span className="text-sky-800 font-medium">Pending Requests</span>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-2xl font-bold text-sky-700 mb-2">5</span>
              <span className="text-sky-800 font-medium">Resolved Issues</span>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-8">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <CardLink
              href="/authority/add"
              title="Post New Alert"
              desc="Report a new incident or hazard."
              icon={Activity}
            />
            <CardLink
              href="/requests"
              title="View Reports"
              desc="See all user reports."
              icon={ListCheck}
            />
            <CardLink
              href="/algae"
              title="Algal Bloom"
              desc="View algae heat map and analysis."
              icon={Waves}
            />
            <CardLink
              href="/calamity"
              title="Natural Calamity"
              desc="See calamity heat map and reports."
              icon={CloudLightning}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
