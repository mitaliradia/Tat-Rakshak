"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AuthorityAddIssuePage() {
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [desc, setDesc] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-sky-700 mb-8 text-center">Add an Issue</h1>
        <form
          className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Issue posted! (Demo)")
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold text-sky-800">Threat Type (Title)</Label>
            <Input
              id="title"
              placeholder="e.g., Pollution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-sky-200 focus:ring-sky-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc" className="font-semibold text-sky-800">Location</Label>
            <Input
              id="loc"
              placeholder="e.g., Visakhapatnam Coast"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-sky-200 focus:ring-sky-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc" className="font-semibold text-sky-800">Description</Label>
            <Textarea
              id="desc"
              placeholder="Brief description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-28 border-sky-200 focus:ring-sky-400"
            />
          </div>
          <Button className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg py-2 transition">
            Publish
          </Button>
        </form>
      </main>
    </div>
  )
}