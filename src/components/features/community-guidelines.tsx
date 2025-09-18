'use client'

import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { communityGuidelines } from '@/data/forum'

interface CommunityGuidelinesProps {
  isOpen: boolean
  onClose: () => void
}

export function CommunityGuidelines({ isOpen, onClose }: CommunityGuidelinesProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl">Community Guidelines</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Introduction */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Welcome to Our Supportive Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our community is a safe space for students to share experiences, seek support, and help one another. 
                These guidelines help us maintain a respectful and supportive environment for everyone.
              </p>
            </div>

            {/* Guidelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityGuidelines.map((guideline, index) => (
                <motion.div
                  key={guideline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{guideline.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {guideline.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {guideline.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Crisis Support Section */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center space-x-2">
                <span>🆘</span>
                <span>Crisis Support</span>
              </h4>
              <div className="space-y-3 text-red-700 dark:text-red-300">
                <p className="text-sm">
                  If you or someone you know is in immediate danger or having thoughts of self-harm, 
                  please seek help immediately:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white dark:bg-red-900/40 p-3 rounded">
                    <div className="font-medium">Emergency Services</div>
                    <div>📞 112</div>
                  </div>
                  <div className="bg-white dark:bg-red-900/40 p-3 rounded">
                    <div className="font-medium">Crisis Helpline</div>
                    <div>📞 91529-87821</div>
                  </div>
                  <div className="bg-white dark:bg-red-900/40 p-3 rounded">
                    <div className="font-medium">Campus Counseling</div>
                    <div>🏥 Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reporting and Moderation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                Reporting and Moderation
              </h4>
              <div className="space-y-3 text-blue-700 dark:text-blue-300 text-sm">
                <p>
                  Our community is moderated by trained volunteers and mental health professionals. 
                  If you see content that violates these guidelines:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Use the report button on posts or replies</li>
                  <li>• Contact moderators directly for urgent concerns</li>
                  <li>• Do not engage in arguments - let moderators handle it</li>
                  <li>• Remember that moderation decisions are made to keep everyone safe</li>
                </ul>
              </div>
            </div>

            {/* Volunteer Program */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                Become a Community Volunteer
              </h4>
              <div className="space-y-3 text-green-700 dark:text-green-300 text-sm">
                <p>
                  Help make our community even better by becoming a peer supporter. Volunteers can:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Earn recognition badges for helpful contributions</li>
                  <li>• Participate in special training sessions</li>
                  <li>• Help moderate discussions and support newcomers</li>
                  <li>• Access exclusive volunteer resources and events</li>
                </ul>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                    Learn More About Volunteering
                  </Button>
                </div>
              </div>
            </div>

            {/* Badge System Preview */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
                Community Recognition Badges
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">Community Helper</div>
                  <div className="text-yellow-700 dark:text-yellow-300">10+ helpful responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💝</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">Peer Supporter</div>
                  <div className="text-yellow-700 dark:text-yellow-300">Consistent support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🌟</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">Student Mentor</div>
                  <div className="text-yellow-700 dark:text-yellow-300">Guides newcomers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">Mental Health Advocate</div>
                  <div className="text-yellow-700 dark:text-yellow-300">Promotes awareness</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">Community Guardian</div>
                  <div className="text-yellow-700 dark:text-yellow-300">Maintains safety</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">Source of Inspiration</div>
                  <div className="text-yellow-700 dark:text-yellow-300">Shares success stories</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Questions or Concerns?
              </h4>
              <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <p>If you have questions about these guidelines or need to report an issue:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Email: community@psynergy.edu</li>
                  <li>• Use the "Contact Moderators" feature in the community</li>
                  <li>• Visit the campus counseling center</li>
                </ul>
              </div>
            </div>

            {/* Agreement */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By participating in our community, you agree to follow these guidelines and help create 
                a safe, supportive environment for all students.
              </p>
              <Button onClick={onClose} className="min-w-[120px]">
                I Understand
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
