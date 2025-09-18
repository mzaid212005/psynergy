'use client'

import { useState } from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { colleges } from '@/data/colleges'
import { languages } from '@/data/languages'
import { validateUSN, validateEmail, validatePhoneNumber } from '@/lib/utils'

interface RegistrationFormData {
  fullName: string
  collegeName: string
  usn: string
  yearOfStudy: string
  email: string
  phoneNumber?: string
  preferredLanguage: string
  password: string
  confirmPassword: string
  gender?: string
  pronouns?: string
  agreeToTerms: boolean
}

interface RegistrationFormProps {
  onSubmit: () => void
  register: UseFormRegister<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
  isLoading: boolean
  step: number
  setStep: (step: number) => void
  watch: UseFormWatch<RegistrationFormData>
  setValue: UseFormSetValue<RegistrationFormData>
}

const yearOptions = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
  'Fifth Year',
  'Postgraduate',
]

const genderOptions = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
  'Other',
]

const pronounOptions = [
  'He/Him',
  'She/Her',
  'They/Them',
  'Other',
  'Prefer not to say',
]

export function RegistrationForm({
  onSubmit,
  register,
  errors,
  isLoading,
  step,
  setStep,
  watch,
  setValue,
}: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [collegeSearch, setCollegeSearch] = useState('')
  
  const watchedUSN = watch('usn')
  const watchedEmail = watch('email')
  const watchedPhone = watch('phoneNumber')
  const watchedPassword = watch('password')

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(collegeSearch.toLowerCase())
  )

  const isUSNValid = watchedUSN ? validateUSN(watchedUSN) : null
  const isEmailValid = watchedEmail ? validateEmail(watchedEmail) : null
  const isPhoneValid = watchedPhone ? validatePhoneNumber(watchedPhone) : null

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return { strength, label: labels[strength - 1] || '' }
  }

  const passwordStrength = getPasswordStrength(watchedPassword || '')

  const canProceedToStep2 = () => {
    return watch('fullName') && watch('collegeName') && watch('usn') && 
           watch('yearOfStudy') && isUSNValid
  }

  const canProceedToStep3 = () => {
    return watch('email') && watch('preferredLanguage') && isEmailValid &&
           (!watch('phoneNumber') || isPhoneValid)
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
      
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          {...register('fullName')}
          type="text"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
        )}
      </div>

      {/* College Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          College Name *
        </label>
        <div className="relative">
          <input
            type="text"
            value={collegeSearch}
            onChange={(e) => setCollegeSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="Search for your college"
          />
          {collegeSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredColleges.slice(0, 10).map((college) => (
                <button
                  key={college.id}
                  type="button"
                  onClick={() => {
                    setValue('collegeName', college.name)
                    setCollegeSearch(college.name)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{college.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{college.location}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <input type="hidden" {...register('collegeName')} />
        {errors.collegeName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.collegeName.message}</p>
        )}
      </div>

      {/* USN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          USN (University Seat Number) *
        </label>
        <div className="relative">
          <input
            {...register('usn')}
            type="text"
            className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors uppercase"
            placeholder="e.g., 1XY21MCA099"
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
            }}
          />
          {watchedUSN && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isUSNValid ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors.usn && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.usn.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Format: 1XY21MCA099 (Year + College Code + Course + Roll Number)
        </p>
      </div>

      {/* Year of Study */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Year of Study *
        </label>
        <select
          {...register('yearOfStudy')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
        >
          <option value="">Select your year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        {errors.yearOfStudy && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.yearOfStudy.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!canProceedToStep2()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact & Language</h2>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="your.email@example.com"
          />
          {watchedEmail && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isEmailValid ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number (Optional)
        </label>
        <div className="relative">
          <input
            {...register('phoneNumber')}
            type="tel"
            className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="9876543210"
          />
          {watchedPhone && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isPhoneValid ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Preferred Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Language *
        </label>
        <select
          {...register('preferredLanguage')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
        >
          <option value="">Select your preferred language</option>
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name} ({language.nativeName})
            </option>
          ))}
        </select>
        {errors.preferredLanguage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredLanguage.message}</p>
        )}
      </div>

      {/* Gender (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender (Optional)
        </label>
        <select
          {...register('gender')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
        >
          <option value="">Select gender</option>
          {genderOptions.map((gender) => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      </div>

      {/* Pronouns (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pronouns (Optional)
        </label>
        <select
          {...register('pronouns')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
        >
          <option value="">Select pronouns</option>
          {pronounOptions.map((pronoun) => (
            <option key={pronoun} value={pronoun}>{pronoun}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          disabled={!canProceedToStep3()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security & Terms</h2>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {watchedPassword && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.strength <= 1 ? 'bg-red-500' :
                    passwordStrength.strength <= 2 ? 'bg-yellow-500' :
                    passwordStrength.strength <= 3 ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3">
        <input
          {...register('agreeToTerms')}
          type="checkbox"
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="text-sm text-gray-700 dark:text-gray-300">
          I agree to the{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms.message}</p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </div>
    </motion.div>
  )

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </AnimatePresence>
    </form>
  )
}
