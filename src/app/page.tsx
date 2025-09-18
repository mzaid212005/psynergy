import Link from 'next/link'
import {
  ArrowRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Psynergy</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Your Mental Health{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Companion
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A comprehensive digital psychological intervention system designed specifically for Indian college students. 
              Get AI-guided support, connect with counselors, access resources, and join a supportive community - all in your preferred language.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/resources"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-lg font-semibold transition-colors"
              >
                Explore Resources
              </Link>
            </div>
          </div>

          {/* Quick Access Features */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Access All Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore all the tools and resources available to support your mental health journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* AI Chat */}
              <Link
                href="/chat"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get instant support from our AI counselor</p>
              </Link>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dashboard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Track your mental health progress</p>
              </Link>

              {/* Assessments */}
              <Link
                href="/assessments"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Assessments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Take mental health screening tests</p>
              </Link>

              {/* Resources */}
              <Link
                href="/resources"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <BookOpenIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Resources</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Access educational materials and guides</p>
              </Link>

              {/* Appointments */}
              <Link
                href="/appointments"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <CalendarDaysIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Appointments</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Book sessions with counselors</p>
              </Link>

              {/* Community */}
              <Link
                href="/community"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Connect with peer support groups</p>
              </Link>

              {/* Learning */}
              <Link
                href="/learning"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <AcademicCapIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Explore mental health courses</p>
              </Link>

              {/* Mood Tracking */}
              <Link
                href="/mood"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <FaceSmileIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mood Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Log and monitor your daily mood</p>
              </Link>

              {/* Admin Panel */}
              <Link
                href="/admin"
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600"
              >
                <div className="flex items-center justify-center h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <CogIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Admin Panel</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">College administration dashboard</p>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <HeartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">AI-Guided Support</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Get instant, empathetic support from our AI chatbot trained in psychological first aid and crisis intervention.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Confidential Counseling</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Book secure, anonymous appointments with verified counselors and mental health professionals.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <UsersIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Peer Community</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Connect with fellow students in moderated forums and support groups for shared experiences and mutual support.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                <div className="mt-2 text-gray-600 dark:text-gray-300">AI Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">13+</div>
                <div className="mt-2 text-gray-600 dark:text-gray-300">Regional Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                <div className="mt-2 text-gray-600 dark:text-gray-300">Confidential & Secure</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
