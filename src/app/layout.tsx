import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from 'react-hot-toast'
import { ConditionalNavigation } from '@/components/layout/conditional-navigation'
import { ModernConditionalNavigation } from '@/components/layout/modern-conditional-navigation'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Psynergy - Digital Psychological Intervention System',
  description: 'A comprehensive mental health platform for Indian college students providing AI-guided support, counseling, resources, and peer community.',
  keywords: 'mental health, psychology, counseling, students, India, AI support, peer support',
  authors: [{ name: 'Psynergy Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Psynergy - Digital Psychological Intervention System',
    description: 'Comprehensive mental health support for college students',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <ModernConditionalNavigation />
              {children}
            </div>
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
