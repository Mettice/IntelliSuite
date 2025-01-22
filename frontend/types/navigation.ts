export type NavItem = {
  name: string
  href: string
  icon?: any
  current?: boolean
  badge?: 'new' | 'soon'
}

export const navigationItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Lead Intelligence', href: '/dashboard/leads' },
  { name: 'Content Studio', href: '/dashboard/content', badge: 'soon' },
  { name: 'Market Intel', href: '/dashboard/market', badge: 'soon' }
] 