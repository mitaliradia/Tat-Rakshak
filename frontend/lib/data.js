export const initialAlerts = [
  {
    id: "a1",
    type: "Pollution",
    location: "Bay of Bengal - Cox's Bazar",
    description: "Oil sheen observed near fishing zone.",
    time: "10m ago",
  },
  {
    id: "a2",
    type: "Illegal Dumping",
    location: "Mumbai Harbor",
    description: "Multiple bags thrown from a vessel at night.",
    time: "45m ago",
  },
  {
    id: "a3",
    type: "Shrimp farming",
    location: "Sundarbans Delta",
    description: "Unauthorized expansion near mangrove edges.",
    time: "1h ago",
  },
]

export const initialRequests = [
  {
    id: "r1",
    reporter: "anon-4821",
    type: "Pollution",
    location: "Visakhapatnam Coast",
    time: "2h ago",
    media: [{ type: "image", url: "/coast-photo.png" }],
    description: "Foamy discharge near outlet.",
    status: "pending",
  },
  {
    id: "r2",
    reporter: "anon-1930",
    type: "Illegal Dumping",
    location: "Karachi Port",
    time: "3h ago",
    media: [],
    description: "Night-time dumping reported.",
    status: "pending",
  },
]

// helpers to avoid mutating source data
export function cloneAlerts() {
  return JSON.parse(JSON.stringify(initialAlerts))
}
export function cloneRequests() {
  return JSON.parse(JSON.stringify(initialRequests))
}
