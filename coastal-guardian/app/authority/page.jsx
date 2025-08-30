"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import AlertsFeed from "@/components/alerts-feed"
import FloatingAction from "@/components/floating-action"
import { cloneAlerts } from "@/lib/data"

export default function AuthorityHomePage() {
  const alerts = cloneAlerts()
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-sky-700 mb-2">TAT - RAKSHAK</h1>
          <p className="text-base text-slate-700">
            Issue official alerts and monitor community reports in real time.
          </p>
        </section>

        <section className="rounded-xl bg-white border border-sky-100 shadow p-6">
          <h2 className="text-2xl font-bold text-sky-800 mb-4">Recent Alerts</h2>
          <AlertsFeed initialItems={alerts} />
        </section>
      </main>

      <FloatingAction href="/authority/add" label="Post an Issue" variant="authority" />
    </div>
  )
}