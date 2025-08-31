"use client"

import AuthorityNavbar from "@/components/authority-navbar"
import Link from "next/link"
import { useState } from "react"
import { Map, ListChecks as ListCheck, Activity, Waves, CloudLightning, Satellite, BarChart3 } from "lucide-react"
import { useDashboardStats } from "@/hooks/useApi"
import { geeService } from "@/services"
import { Button } from "@/components/ui/button"

function CardLink({ href, title, desc, icon }) {
  const Icon = icon
  return (
    <Link
      href={href}
      className="rounded-lg border p-5 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-700 transition bg-sky-50 hover:bg-sky-100"
    >
      <div className="flex items-center gap-3">
        <Icon className="text-emerald-500" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </Link>
  )
}

export default function DashboardPage() {
  const { data: stats, loading, error } = useDashboardStats()
  const [geeLoading, setGeeLoading] = useState(false)
  const [geeResults, setGeeResults] = useState(null)
  const [geeError, setGeeError] = useState('')
  
  const runGeeAnalysis = async () => {
    setGeeLoading(true)
    setGeeError('')
    setGeeResults(null) // Clear previous results
    
    try {
      console.log('Starting GEE analysis...')
      const result = await geeService.runAnalysis()
      
      if (result.success) {
        setGeeResults(result.data)
        console.log('GEE Analysis completed successfully:', result.data)
        // Use a more user-friendly notification instead of alert
        // alert('GEE Analysis completed successfully! Check results below.')
      } else {
        const errorMsg = result.message || 'GEE analysis failed'
        console.error('GEE Analysis failed:', errorMsg)
        setGeeError(`Analysis failed: ${errorMsg}`)
      }
    } catch (err) {
      console.error('GEE Analysis error:', err)
      let errorMessage = 'Failed to run GEE analysis'
      
      // Provide more specific error messages based on error type
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Analysis timed out. The backend may still be processing - please try checking results in a few minutes.'
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error during analysis. Please check if the Python environment is properly configured.'
      } else if (err.response?.status === 408) {
        errorMessage = 'Analysis timed out on the server (5 minute limit exceeded).'
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`
      }
      
      setGeeError(errorMessage)
    }
    
    setGeeLoading(false)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <AuthorityNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-8 text-center">Authority Dashboard</h1>
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-8 mb-8">
          <h2 className="text-xl font-bold text-sky-800 mb-2">Overview</h2>
          <p className="text-slate-700 mb-4">
            Welcome to your dashboard. Here you can monitor alerts, manage reports, and view analytics.
          </p>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700 mx-auto"></div>
              <p className="text-sky-700 mt-2">Loading stats...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              Error loading dashboard stats: {error}
            </div>
          )}
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
                <span className="text-2xl font-bold text-sky-700 mb-2">{stats.activeAlerts || 0}</span>
                <span className="text-sky-800 font-medium">Active Alerts</span>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
                <span className="text-2xl font-bold text-sky-700 mb-2">{stats.pendingRequests || 0}</span>
                <span className="text-sky-800 font-medium">Pending Requests</span>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex flex-col items-center shadow-sm">
                <span className="text-2xl font-bold text-sky-700 mb-2">{stats.resolvedIssues || 0}</span>
                <span className="text-sky-800 font-medium">Resolved Issues</span>
              </div>
            </div>
          )}
        </section>
        
        {/* GEE Analysis Section */}
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-sky-800">Google Earth Engine Analysis</h2>
            <Button 
              onClick={runGeeAnalysis}
              disabled={geeLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            >
              <Satellite size={16} />
              {geeLoading ? 'Running Analysis...' : 'Run GEE Analysis'}
            </Button>
          </div>
          
          <p className="text-slate-700 mb-4">
            Run AI-powered coastal analysis using Google Earth Engine and GROQ AI models.
            This will analyze Sundarbans, Pulicat Lake, Goa Coast, and Kochi for environmental threats.
          </p>
          
          {geeLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
              <p className="text-emerald-700 mt-4 font-medium">Running Python GEE analysis...</p>
              <p className="text-emerald-600 text-sm mt-2">This process takes 3-5 minutes to analyze 4 coastal regions.</p>
              <p className="text-slate-500 text-xs mt-2">Please wait while we process satellite data from Google Earth Engine.</p>
            </div>
          )}
          
          {geeError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              <strong>GEE Analysis Error:</strong> {geeError}
            </div>
          )}
          
          {geeResults && !geeLoading && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
              <strong>✅ Analysis Complete!</strong> Successfully analyzed {geeResults.processed_locations?.length || 0} coastal regions.
            </div>
          )}
          
          {geeResults && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Analysis Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-sky-700">{geeResults.total_analyses || 0}</div>
                  <div className="text-sm text-sky-600">Locations Analyzed</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-emerald-700">{geeResults.processed_locations?.length || 0}</div>
                  <div className="text-sm text-emerald-600">Regions Processed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-yellow-700">
                    {geeResults.analysis_results?.reduce((sum, result) => sum + (result.anomaly_count || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-yellow-600">Total Anomalies</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-purple-700">
                    {geeResults.analysis_results?.filter(result => result.threat_level === 'high' || result.threat_level === 'critical').length || 0}
                  </div>
                  <div className="text-sm text-purple-600">High Risk Areas</div>
                </div>
              </div>
              
              {geeResults.analysis_results?.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sky-800">Location Analysis Summary:</h4>
                  {geeResults.analysis_results.map((result, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-slate-900">{result.location}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.threat_level === 'critical' ? 'bg-red-100 text-red-800' :
                          result.threat_level === 'high' ? 'bg-orange-100 text-orange-800' :
                          result.threat_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {result.threat_level?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        <span className="font-medium">Data Points:</span> {result.data_points} | 
                        <span className="font-medium">Anomalies:</span> {result.anomaly_count || 0} |
                        <span className="font-medium">Last Updated:</span> {new Date(result.timestamp).toLocaleDateString()}
                      </div>
                      {result.insights && (
                        <div className="bg-slate-50 rounded p-3 mt-2">
                          <p className="text-xs text-slate-700 font-mono whitespace-pre-wrap">
                            {result.insights.substring(0, 300)}...
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
        
        <section className="rounded-2xl border border-sky-100 bg-white shadow p-8">
          <h2 className="text-xl font-bold text-sky-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <CardLink
              href="/authority/add"
              title="Post New Alert"
              desc="Report a new incident or hazard."
              icon={Activity}
            />
            <CardLink
              href="/requests"
              title="View Reports"
              desc="See all user reports."
              icon={ListCheck}
            />
            <CardLink
              href="/algae"
              title="Algal Bloom"
              desc="View algae heat map and analysis."
              icon={Waves}
            />
            <CardLink
              href="/calamity"
              title="Natural Calamity"
              desc="See calamity heat map and reports."
              icon={CloudLightning}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
