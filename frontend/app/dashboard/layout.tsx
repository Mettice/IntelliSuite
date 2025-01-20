import Navigation from '../../components/dashboard/Navigation'
import { ReactNode } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  )
} 