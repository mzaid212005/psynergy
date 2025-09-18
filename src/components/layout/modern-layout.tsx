'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

interface ModernLayoutProps {
  children: React.ReactNode
}

export function ModernLayout({ children }: ModernLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Mood Tracker', href: '/mood', icon: HeartIcon },
    { name: 'Appointments', href: '/appointments', icon: CalendarDaysIcon },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 shadow-xl lg:hidden"
            >
              <SidebarContent navigation={navigation} pathname={pathname} user={user} logout={logout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:overflow-y-auto lg:bg-white lg:dark:bg-slate-800 lg:shadow-xl">
        <SidebarContent navigation={navigation} pathname={pathname} user={user} logout={logout} />
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400" />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 sm:text-sm bg-transparent"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5"
                >
                  <UserCircleIcon className="h-8 w-8 text-slate-400" />
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {user?.name || 'Guest'}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation, pathname, user, logout }: any) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <HeartIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Psynergy
          </span>
        </motion.div>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item: any) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-10 w-10 text-slate-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user?.name || 'Guest'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.role || 'Not logged in'}
                  </p>
                </div>
              </div>
              {user && (
                <button
                  onClick={logout}
                  className="mt-3 w-full text-left text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Sign out
                </button>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
