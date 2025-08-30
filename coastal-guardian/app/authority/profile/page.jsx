"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthorityProfilePage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
  })
  const [showAlert, setShowAlert] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add API call to update profile
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
      <main className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-sky-100 relative">
        <Link
          href="/authority"
          className="inline-flex items-center gap-2 text-sky-700 font-semibold hover:underline mb-4"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-sky-700 mb-6 text-center">Edit Profile</h1>
        {showAlert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-3 rounded-lg shadow transition-all animate-fade-in z-10">
            <span className="font-semibold">Profile updated!</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Change Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              required
              placeholder="Enter new username"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Change Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="Enter new phone number"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-800 transition"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  )
}