"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import { useAlgaeAnalysis } from "@/hooks/useApi"

export default function AlgaePage() {
  const { data: algaeData, loading, error } = useAlgaeAnalysis()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-8 text-center">Algae Bloom Analysis</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700 mx-auto"></div>
            <p className="text-sky-700 mt-4">Loading algae analysis...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            Error loading algae data: {error}
          </div>
        )}
        
        {/* Heat Map Section */}
        <section className="mb-8 rounded-2xl border border-sky-100 bg-white shadow p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Regional Heat Map</h2>
          {algaeData?.heatMapUrl ? (
            <img
              src={algaeData.heatMapUrl}
              alt="Algae Heat Map"
              className="w-full max-h-96 object-contain rounded-lg border"
            />
          ) : (
            <div className="w-full h-96 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-center">
              <p className="text-sky-700">Heat map data not available</p>
            </div>
          )}
        </section>
        
        {/* Visual Graphs Section */}
        <section className="mb-8 rounded-2xl border border-sky-100 bg-white shadow p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Visual Graphs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algaeData?.graphs?.length > 0 ? (
              algaeData.graphs.map((graph, index) => (
                <img
                  key={index}
                  src={graph.url}
                  alt={graph.title || `Algae Graph ${index + 1}`}
                  className="w-full object-contain rounded-lg border"
                />
              ))
            ) : (
              <>
                <div className="w-full h-48 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-center">
                  <p className="text-sky-700">Graph data not available</p>
                </div>
                <div className="w-full h-48 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-center">
                  <p className="text-sky-700">Graph data not available</p>
                </div>
              </>
            )}
          </div>
        </section>
        
        {/* Detailed Analysis Section */}
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Detailed Analysis</h2>
          <textarea
            className="w-full min-h-[120px] border border-sky-200 rounded-lg p-3 text-slate-800 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Enter or view detailed analysis here..."
            readOnly
            value={algaeData?.analysis || "Loading algae bloom analysis..."}
          />
        </section>
      </main>
    </div>
  )
}