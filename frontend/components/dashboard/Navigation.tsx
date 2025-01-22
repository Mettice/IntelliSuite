'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Public Form
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/leads" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Leads
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 