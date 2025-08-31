"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { alertsService } from "@/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AuthorityAddIssuePage() {
  const router = useRouter()
  const [type, setType] = useState("Pollution")
  const [location, setLocation] = useState("")
  const [desc, setDesc] = useState("")
  const [severity, setSeverity] = useState("Medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-sky-700 mb-8 text-center">Post New Alert</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form
          className="bg-white rounded-2xl shadow-xl border border-sky-100 p-8 space-y-6"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setLoading(true)
            
            try {
              const alertData = {
                type,
                location,
                description: desc,
                severity,
                status: 'active'
              }
              
              const result = await alertsService.createAlert(alertData)
              
              if (result.success) {
                alert('Alert posted successfully!')
                // Reset form
                setType('Pollution')
                setLocation('')
                setDesc('')
                setSeverity('Medium')
                router.push('/authority')
              } else {
                setError(result.message)
              }
            } catch (err) {
              setError('Failed to post alert. Please try again.')
            }
            
            setLoading(false)
          }}
        >
          <div className="space-y-2">
            <Label className="font-semibold text-sky-800">Alert Type</Label>
            <RadioGroup value={type} onValueChange={setType} className="grid grid-cols-2 gap-3">
              {['Pollution', 'Illegal Dumping', 'Shrimp farming', 'Oil Spill', 'Algae Bloom', 'Natural Calamity'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 rounded border p-3 text-sm bg-sky-50 hover:bg-sky-100 transition cursor-pointer">
                  <RadioGroupItem value={opt} />
                  {opt}
                </label>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label className="font-semibold text-sky-800">Severity Level</Label>
            <RadioGroup value={severity} onValueChange={setSeverity} className="flex gap-4">
              {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                <label key={level} className="flex items-center gap-2 rounded border p-2 text-sm bg-sky-50 hover:bg-sky-100 transition cursor-pointer">
                  <RadioGroupItem value={level} />
                  <span className={`font-medium ${
                    level === 'Critical' ? 'text-red-600' :
                    level === 'High' ? 'text-orange-600' :
                    level === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{level}</span>
                </label>
              ))}
            </RadioGroup>
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
          <Button 
            type="submit"
            disabled={loading || !location || !desc}
            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg py-2 transition disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Alert'}
          </Button>
        </form>
      </main>
    </div>
  )
}