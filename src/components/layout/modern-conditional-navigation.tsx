'use client'

import { usePathname } from 'next/navigation'
import { ModernNavigation, FloatingActionButton } from './modern-navigation'

export function ModernConditionalNavigation() {
  const pathname = usePathname()
  
  // Hide navigation on auth pages
  const hideNavigation = pathname?.startsWith('/auth')
  
  if (hideNavigation) {
    return null
  }

  return (
    <>
      <ModernNavigation />
      <FloatingActionButton />
    </>
  )
}
