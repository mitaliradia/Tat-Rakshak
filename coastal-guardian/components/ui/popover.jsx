"use client"

import { useState, cloneElement } from "react"

export function Popover({ children }) {
  return <div className="relative">{children}</div>
}

export function PopoverTrigger({ asChild, children, ...props }) {
  const [open, setOpen] = useState(false)
  const child = cloneElement(children, {
    onClick: () => setOpen((o) => !o),
    ...props,
  })
  return child
}

export function PopoverContent({ children, className = "" }) {
  return (
    <div className={`absolute right-0 mt-2 z-10 bg-white border rounded shadow-lg p-4 ${className}`}>
      {children}
    </div>
  )
}