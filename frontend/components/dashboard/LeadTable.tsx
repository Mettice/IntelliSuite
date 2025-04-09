'use client'

import { Lead } from '../../types'

export default function LeadTable({ leads, loading }: { leads: Lead[], loading: boolean }) {
  if (loading) {
    return <div className="glass-card p-8 animate-pulse">Loading...</div>
  }

  return (
    <div className="glass-card p-8 space-y-8 animate-fadeIn bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 backdrop-blur-lg rounded-2xl shadow-2xl">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-200">
          Lead Management
        </h2>
        <button className="glass-button flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600/50 hover:bg-indigo-600/70 transition-all duration-300 hover:scale-105 active:scale-95">
          <span className="text-indigo-100 font-medium">Export Leads</span>
          <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      {/* Table Section */}
      <div className="glass-table w-full overflow-hidden rounded-xl border border-indigo-500/20">
        <table className="min-w-full divide-y divide-indigo-500/10">
          <thead className="bg-indigo-600/20">
            <tr>
              <th scope="col" className="px-8 py-5 text-left text-sm font-semibold text-indigo-200 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-8 py-5 text-left text-sm font-semibold text-indigo-200 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-8 py-5 text-left text-sm font-semibold text-indigo-200 uppercase tracking-wider">Score</th>
              <th scope="col" className="px-8 py-5 text-left text-sm font-semibold text-indigo-200 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-8 py-5 text-left text-sm font-semibold text-indigo-200 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {leads?.map((lead, index) => (
              <tr key={index} className="hover:bg-indigo-500/10 transition-colors duration-200">
                <td className="px-8 py-5 text-sm font-medium text-indigo-100">{lead.name}</td>
                <td className="px-8 py-5 text-sm text-indigo-200">{lead.company?.trim()}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="w-24 bg-indigo-500/10 rounded-full h-2.5 mr-3">
                      <div 
                        className="h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-300" 
                        style={{ width: `${(lead.score || 0) * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-indigo-100">
                      {lead.score || 'N/A'}/10
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    lead.category === 'HOT' ? 'bg-red-500/20 text-red-300' :
                    lead.category === 'COLD' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {lead.category || 'WARM'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <button className="text-indigo-300 hover:text-indigo-200 transition-colors duration-200">
                    {lead.action || 'Follow up required'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}