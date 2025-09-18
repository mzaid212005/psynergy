'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
  categories: any[]
}

export function CreatePostModal({ 
  isOpen, 
  onClose, 
  onPostCreated, 
  categories 
}: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isAnonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCrisisWarning, setShowCrisisWarning] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          isAnonymous: formData.isAnonymous,
          userId: 'current_user' // TODO: Get from auth context
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.crisisDetected) {
          setShowCrisisWarning(true)
          return
        }
        throw new Error(data.error || 'Failed to create post')
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        isAnonymous: false
      })

      onPostCreated()
      
      if (data.requiresModeration) {
        toast.success('Post submitted for review')
      } else {
        toast.success('Post created successfully!')
      }

    } catch (error: any) {
      console.error('Error creating post:', error)
      toast.error(error.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCrisisSupport = () => {
    setShowCrisisWarning(false)
    onClose()
    // TODO: Redirect to crisis support or open crisis intervention modal
    window.open('tel:91529-87821', '_self')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">Create New Post</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {showCrisisWarning ? (
                <motion.div
                  key="crisis-warning"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    We're Here to Help
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    It seems like you might be going through a difficult time. Please know that you're not alone, 
                    and there are people who want to help you right now.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Immediate Support Available:
                      </h4>
                      <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
                        <div>🆘 Emergency: 112</div>
                        <div>📞 Crisis Helpline: 91529-87821</div>
                        <div>🏥 Campus Counseling: Available 24/7</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={handleCrisisSupport}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        Get Help Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCrisisWarning(false)}
                        className="flex-1"
                      >
                        Continue with Post
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="create-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What would you like to discuss?"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      maxLength={200}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/200 characters
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts, experiences, or questions..."
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      maxLength={5000}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.content.length}/5000 characters
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="anxiety, stress, study tips (separate with commas)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Add relevant tags to help others find your post
                    </div>
                  </div>

                  {/* Anonymous Option */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                        <EyeSlashIcon className="h-4 w-4" />
                        <span>Post anonymously</span>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Your identity will be hidden from other users
                      </p>
                    </div>
                  </div>

                  {/* Community Guidelines Reminder */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Community Guidelines Reminder
                    </h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Be respectful and supportive to all community members</li>
                      <li>• Share your experiences to help others, but avoid giving medical advice</li>
                      <li>• Respect privacy and maintain confidentiality</li>
                      <li>• If you're in crisis, please seek immediate professional help</li>
                    </ul>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Posting...</span>
                        </div>
                      ) : (
                        'Create Post'
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
