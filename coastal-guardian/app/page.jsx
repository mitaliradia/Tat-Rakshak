"use client"

import Image from "next/image"
import Navbar from "@/components/navbar"
import AlertsFeed from "@/components/alerts-feed"
import FloatingAction from "@/components/floating-action"
import { cloneAlerts } from "@/lib/data"

export default function HomePage() {
  const alerts = cloneAlerts()
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
        <AlertsFeed initialItems={alerts} />
      </main>

      <FloatingAction href="/user/report" label="Report an Issue" variant="user" />
    </div>
  )
}
