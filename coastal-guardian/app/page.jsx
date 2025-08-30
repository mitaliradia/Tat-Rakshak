"use client"

import Image from "next/image"
import Navbar from "@/components/navbar"
import AlertsFeed from "@/components/alerts-feed"
import FloatingAction from "@/components/floating-action"
import { cloneAlerts } from "@/lib/data"

export default function HomePage() {
  const alerts = cloneAlerts()
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="relative overflow-hidden rounded-lg border">
          <div className="absolute inset-0">
            <Image src="/sea-ecosystem-background.png" alt="" fill className="object-cover opacity-70" priority />
          </div>
          <div className="relative p-8 md:p-12">
            <h1 className="text-balance text-2xl md:text-3xl font-semibold text-white drop-shadow">Coastal Guardian</h1>
            <p className="mt-2 max-w-prose text-pretty text-white drop-shadow">
              Community-powered coastal threat reporting and authority alerts.
            </p>
          </div>
        </section>

        <h2 className="mt-6 text-lg font-semibold">Recent Alerts</h2>
        <AlertsFeed initialItems={alerts} />
      </main>

      <FloatingAction href="/user/report" label="Report an Issue" variant="user" />
    </>
  )
}
