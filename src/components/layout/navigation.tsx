'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CogIcon,
  HeartIcon as DoctorIcon,
  FaceSmileIcon,
  ClockIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

const studentNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Mood Log', href: '/mood', icon: FaceSmileIcon },
  { name: 'Book Counseling', href: '/book-counseling', icon: CalendarDaysIcon },
  { name: 'Assessments', href: '/assessments', icon: ClipboardDocumentCheckIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
  { name: 'Appointments', href: '/appointments', icon: CalendarDaysIcon },
  { name: 'Community', href: '/community', icon: UserGroupIcon },
  { name: 'Learning', href: '/learning', icon: AcademicCapIcon },
]

const doctorNavigation = [
  { name: 'Doctor Dashboard', href: '/doctor', icon: DoctorIcon },
  { name: 'Patient Management', href: '/doctor/patients', icon: UsersIcon },
  { name: 'Patient Moods', href: '/doctor/moods', icon: FaceSmileIcon },
  { name: 'Counseling Slots', href: '/doctor/slots', icon: ClockIcon },
  { name: 'Appointments', href: '/doctor/appointments', icon: CalendarDaysIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
]

const instituteNavigation = [
  { name: 'Institute Dashboard', href: '/institute', icon: CogIcon },
  { name: 'Student Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Mood Monitoring', href: '/admin/moods', icon: FaceSmileIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getNavigation = () => {
    if (!user) return studentNavigation

    switch (user.role) {
      case 'doctor':
        return doctorNavigation
      case 'institute':
      case 'admin':
        return instituteNavigation
      case 'student':
      default:
        return studentNavigation
    }
  }

  const navigation = getNavigation()

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
                <HeartIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Psynergy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.slice(0, 8).map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Auth buttons for desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.name} ({user.role})
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={logout}
                    className="flex items-center space-x-1"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* Mobile auth buttons */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2 px-3">
                {user ? (
                  <>
                    <div className="text-gray-600 dark:text-gray-300 text-base font-medium">
                      {user.name} ({user.role})
                    </div>
                    <Button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-base font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button asChild className="w-full">
                      <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
