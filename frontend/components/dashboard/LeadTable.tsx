'use client'

import { Lead, LeadAnalysis } from '../../types'

interface LeadTableProps {
  leads: (Lead & LeadAnalysis)[]
  loading: boolean
}

export default function LeadTable({ leads = [], loading }: LeadTableProps) {
  if (loading) {
    return <div>Loading...</div>
  }

  if (!Array.isArray(leads)) {
    console.error('Leads is not an array:', leads)
    return <div>Error loading leads</div>
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead: Lead & LeadAnalysis, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead['company ']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.score}/10</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 