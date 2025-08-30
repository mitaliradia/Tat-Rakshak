"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import AlertsFeed from "@/components/alerts-feed"
import FloatingAction from "@/components/floating-action"
import { cloneAlerts } from "@/lib/data"

export default function AuthorityHomePage() {
  const alerts = cloneAlerts()
  return (
    <>
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="rounded-lg border p-6">
          <h1 className="text-xl font-semibold">Coastal Guardian</h1>
          <p className="text-sm text-slate-600">Issue official alerts and monitor community reports in real time.</p>
        </section>

        <h2 className="mt-6 text-lg font-semibold">Recent Alerts</h2>
        <AlertsFeed initialItems={alerts} />
      </main>

      <FloatingAction href="/authority/add" label="Post an Issue" variant="authority" />
    </>
  )
}
