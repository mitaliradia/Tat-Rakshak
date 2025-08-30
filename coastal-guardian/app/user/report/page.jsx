"use client"

import Navbar from "@/components/navbar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ReportIssuePage() {
  const [type, setType] = useState("Pollution")
  const [other, setOther] = useState("")
  const [location, setLocation] = useState("")
  const [desc, setDesc] = useState("")
  const [files, setFiles] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-sky-700 mb-2">Report an Issue</h1>
        <p className="text-sm text-slate-600 mb-6">No login required. Your report will be anonymous.</p>

        <form
          className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Submitted! (Demo) — Thank you for your report.")
          }}
        >
          <div className="space-y-2">
            <Label className="font-semibold text-sky-800">Threat Type</Label>
            <RadioGroup value={type} onValueChange={setType} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Shrimp farming", "Pollution", "Illegal Dumping", "Other"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 rounded border p-3 text-sm bg-sky-50 hover:bg-sky-100 transition cursor-pointer">
                  <RadioGroupItem value={opt} />
                  {opt}
                </label>
              ))}
            </RadioGroup>
            {type === "Other" && (
              <Input
                placeholder="Specify other threat"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                className="border-sky-200 focus:ring-sky-400"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="font-semibold text-sky-800">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Chennai Marina Beach"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-sky-200 focus:ring-sky-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="font-semibold text-sky-800">Description</Label>
            <Textarea
              id="desc"
              placeholder="Describe the issue..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-28 border-sky-200 focus:ring-sky-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media" className="font-semibold text-sky-800">Upload Photos/Videos</Label>
            <Input
              id="media"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="border-sky-200 focus:ring-sky-400"
            />
            <p className="text-xs text-slate-500">{files.length} file(s) selected</p>
          </div>

          <Button className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg py-2 transition">
            Submit
          </Button>
        </form>
      </main>
    </div>
  )
}