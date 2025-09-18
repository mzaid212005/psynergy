'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './navigation'

export function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Don't show navigation on homepage, auth pages, or other pages with custom headers
  const hideNavigation = pathname === '/' || pathname.startsWith('/auth/')
  
  if (hideNavigation) {
    return null
  }
  
  return <Navigation />
}
