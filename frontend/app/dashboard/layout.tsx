import Navigation from '../../components/dashboard/Navigation'
import { ReactNode } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <main className="responsive-padding py-6 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
} 