"use client"

import { useState } from "react"
import { MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

export default function AlertItem({ alert }) {
  const [comment, setComment] = useState("")

  return (
    <li className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-slate-500">{alert.time}</div>
          <h3 className="text-base font-semibold">{alert.type}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-700">
            <MapPin size={16} className="text-emerald-500" />
            <span className="truncate">{alert.location}</span>
          </div>
          <p className="mt-2 text-sm text-slate-800 leading-relaxed">{alert.description}</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Comment">
              <MessageCircle size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add a comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="min-h-24"
              />
              <Button
                onClick={() => {
                  setComment("")
                }}
                className="bg-sky-700 hover:bg-sky-800 text-white"
              >
                Submit
              </Button>
              <p className="text-xs text-slate-500">Click outside to close.</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </li>
  )
}
