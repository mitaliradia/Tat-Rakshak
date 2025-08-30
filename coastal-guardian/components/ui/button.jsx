"use client"

export function Button({ children, variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center px-4 py-2 rounded font-medium transition-colors focus:outline-none"
  const variants = {
    default: "bg-sky-700 text-white hover:bg-sky-800",
    outline: "border border-sky-700 text-sky-700 bg-white hover:bg-sky-50",
  }
  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  )
}