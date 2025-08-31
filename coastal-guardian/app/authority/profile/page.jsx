"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { authService } from "@/services"

export default function AuthorityProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    organization: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  
  // Load current user data
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.organization || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const result = await authService.updateProfile({
        username: form.username,
        phone: form.phone,
        organization: form.organization
      })
      
      if (result.success) {
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 2500)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    }
    
    setLoading(false)
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
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Email (Read-only)</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full border border-gray-200 bg-gray-50 px-4 py-2 rounded-lg text-gray-600"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              required
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Organization</label>
            <input
              type="text"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              className="w-full border border-sky-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="Enter organization"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-800 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}