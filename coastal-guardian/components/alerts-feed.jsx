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
            <li key={a.id} className="p-4">
              <AlertItem alert={a} />
              {a.comments && a.comments.length > 0 && (
                <div className="mt-3 ml-8">
                  <h4 className="text-sm font-semibold text-sky-700 mb-1">Comments:</h4>
                  <ul className="space-y-2">
                    {a.comments.map((c, idx) => (
                      <li key={idx} className="bg-sky-50 rounded px-3 py-2 text-sm text-slate-800 border">
                        <span className="font-semibold">{c.user}:</span> {c.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}