"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-sky-100 p-8">
          <h1 className="text-2xl font-extrabold text-sky-700 mb-6 text-center">Authority Login</h1>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              router.push("/authority")
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-sky-800">Email</Label>
              <Input id="email" type="email" placeholder="you@coastal.gov" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw" className="font-semibold text-sky-800">Password</Label>
              <Input id="pw" type="password" required />
            </div>
            <Button className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg py-2 transition">
              Login
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
