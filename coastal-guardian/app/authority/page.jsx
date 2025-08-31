"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import AlertsFeed from "@/components/alerts-feed"
import FloatingAction from "@/components/floating-action"
import { useAlerts } from "@/hooks/useApi"

export default function AuthorityHomePage() {
  const { data: alerts, loading, error } = useAlerts({ limit: 10 })
  
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
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
              <p className="text-sky-700 mt-4">Loading alerts...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              Error loading alerts: {error}
            </div>
          )}
          
          {alerts && <AlertsFeed initialItems={alerts} />}
        </section>
      </main>

      <FloatingAction href="/authority/add" label="Post an Issue" variant="authority" />
    </div>
  )
}