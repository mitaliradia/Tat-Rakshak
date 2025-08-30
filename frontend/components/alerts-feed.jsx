"use client"

import { useState } from "react"
import AlertItem from "./alert-item"

export default function AlertsFeed({ initialItems }) {
  const [items] = useState(initialItems ?? [])
  return (
    <section aria-label="Recent alerts" className="mt-4">
      <div className="h-[520px] overflow-y-auto rounded border bg-background">
        <ul className="divide-y">
          {items.map((a) => (
            <AlertItem key={a.id} alert={a} />
          ))}
        </ul>
      </div>
    </section>
  )
}
