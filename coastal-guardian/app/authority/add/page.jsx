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
    <>
      <AuthorityNavbar />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-xl font-semibold">Add an Issue</h1>
        <form
          className="mt-6 space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Issue posted! (Demo)")
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Threat Type (Title)</Label>
            <Input id="title" placeholder="e.g., Pollution" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc">Location</Label>
            <Input
              id="loc"
              placeholder="e.g., Visakhapatnam Coast"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              placeholder="Brief description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-28"
            />
          </div>
          <Button className="bg-sky-700 hover:bg-sky-800 text-white">Publish</Button>
        </form>
      </main>
    </>
  )
}
