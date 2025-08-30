"use client"

import AuthorityNavbar from "@/components/authority-navbar"

export default function NaturalCalamityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-8 text-center">Natural Calamities Predictor</h1>
        
        {/* Heat Map Section */}
        <section className="mb-8 rounded-2xl border border-sky-100 bg-white shadow p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Regional Heat Map</h2>
          <img
            src="/images/algae-heatmap.png"
            alt="Algae Heat Map"
            className="w-full max-h-96 object-contain rounded-lg border"
          />
        </section>
        
        {/* Visual Graphs Section */}
        <section className="mb-8 rounded-2xl border border-sky-100 bg-white shadow p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Visual Graphs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src="/images/algae-graph1.png"
              alt="Algae Graph 1"
              className="w-full object-contain rounded-lg border"
            />
            <img
              src="/images/algae-graph2.png"
              alt="Algae Graph 2"
              className="w-full object-contain rounded-lg border"
            />
          </div>
        </section>
        
        {/* Detailed Analysis Section */}
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Detailed Analysis</h2>
          <textarea
            className="w-full min-h-[120px] border border-sky-200 rounded-lg p-3 text-slate-800 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Enter or view detailed analysis here..."
            readOnly
            value="Algae bloom activity is concentrated in the northern region, with a significant increase over the past week. Environmental factors such as temperature and nutrient levels are contributing to the spread. Immediate monitoring and mitigation are recommended."
          />
        </section>
      </main>
    </div>
  )
}
