"use client"

import Image from "next/image"
import Navbar from "@/components/navbar"
import AlertsFeed from "@/components/alerts-feed"
import FloatingAction from "@/components/floating-action"
import { useAlerts } from "@/hooks/useApi"

export default function HomePage() {
  const { data: alerts, loading, error } = useAlerts({ limit: 10 })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="relative overflow-hidden rounded-2xl border border-sky-100 shadow-lg mb-10">
          <div className="absolute inset-0">
            <Image
              src="/user-background.jpg"
              alt=""
              fill
              className="object-cover opacity-100"
              priority
            />
          </div>
          <div className="relative p-8 md:p-12 flex flex-col items-start">
            <h1 className="text-balance text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2">
              TAT - RAKSHAK
            </h1>
            <p className="mt-2 max-w-prose text-pretty text-white drop-shadow text-lg font-bold">
              Community-powered coastal threat reporting and authority alerts.
            </p>
          </div>
        </section>

        <h2 className="mt-6 text-2xl font-bold text-sky-800 mb-4">Recent Alerts</h2>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
            <p className="text-sky-700 mt-4">Loading alerts...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            Error loading alerts: {error}
          </div>
        )}
        
        {alerts && <AlertsFeed initialItems={alerts} />}
      </main>

      <FloatingAction href="/user/report" label="Report an Issue" variant="user" />
    </div>
  )
}
