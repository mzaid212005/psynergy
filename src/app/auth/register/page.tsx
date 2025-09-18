'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HeartIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { RegistrationForm } from '@/components/forms/registration-form'
import { motion } from 'framer-motion'

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  collegeName: z.string().min(1, 'Please select your college'),
  usn: z.string().min(1, 'USN is required').regex(/^[0-9][A-Z]{2}[0-9]{2}[A-Z]{3}[0-9]{3}$/, 'Invalid USN format'),
  yearOfStudy: z.string().min(1, 'Please select your year of study'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  preferredLanguage: z.string().min(1, 'Please select your preferred language'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  gender: z.string().optional(),
  pronouns: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual registration logic
      console.log('Registration data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to dashboard or verification page
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Psynergy</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <main className="relative px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">Join Psynergy</h1>
              <p className="text-blue-100 mt-2">Create your account to access mental health support</p>
            </div>

            {/* Progress Indicator */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Step {step} of 3</span>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-6">
              <RegistrationForm
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                isLoading={isLoading}
                step={step}
                setStep={setStep}
                watch={watch}
                setValue={setValue}
              />
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span>Your data is encrypted and secure</span>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
