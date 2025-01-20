import { useEffect } from 'react'
import { useRouter } from 'next/router'

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = false // Replace with your auth logic

  useEffect(() => {
    if (!isAuthenticated && router.pathname.startsWith('/dashboard')) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return { isAuthenticated }
} 