'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'
  }

  return (
    <nav className="glass-navbar mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/')}`}
            >
              Public Form
            </Link>
            <Link 
              href="/dashboard" 
              className={`flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/leads" 
              className={`flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard/leads')}`}
            >
              Leads
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className={`flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard/analytics')}`}
            >
              Analytics
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="glass-button text-sm">
              Settings
            </button>
            <button className="glass-button text-sm bg-primary/20 hover:bg-primary/30">
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 