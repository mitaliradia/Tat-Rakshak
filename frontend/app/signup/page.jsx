"use client"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-sm px-4 py-10">
        <h1 className="text-xl font-semibold">Create an Account</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Account created! Please log in.")
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@coastal.gov" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" required />
          </div>
          <Button className="w-full bg-sky-700 hover:bg-sky-800 text-white">Sign up</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-700 underline">
            Login
          </Link>
        </p>
      </main>
    </>
  )
}
