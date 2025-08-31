"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(formData)
    
    if (result.success) {
      if (result.user.role === 'authority') {
        router.push('/authority')
      } else {
        router.push('/')
      }
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-sky-100 p-8">
          <h1 className="text-2xl font-extrabold text-sky-700 mb-6 text-center">Authority Login</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-sky-800">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@coastal.gov" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw" className="font-semibold text-sky-800">Password</Label>
              <Input 
                id="pw" 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required 
              />
            </div>
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-600">
            Not an authority?{" "}
            <Link href="/" className="text-sky-700 hover:underline font-medium">
              Go to User Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
