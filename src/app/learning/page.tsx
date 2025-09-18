'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  AcademicCapIcon, 
  PlayIcon, 
  BookOpenIcon, 
  ClockIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const courses = [
  {
    id: 'stress-management',
    title: 'Stress Management for Students',
    description: 'Learn effective techniques to manage academic and personal stress.',
    duration: '4 weeks',
    lessons: 12,
    level: 'Beginner',
    rating: 4.8,
    enrolled: 1250,
    category: 'Stress Management',
    color: 'blue'
  },
  {
    id: 'mindfulness-basics',
    title: 'Mindfulness and Meditation Basics',
    description: 'Introduction to mindfulness practices for mental well-being.',
    duration: '3 weeks',
    lessons: 9,
    level: 'Beginner',
    rating: 4.9,
    enrolled: 980,
    category: 'Mindfulness',
    color: 'green'
  },
  {
    id: 'anxiety-coping',
    title: 'Coping with Anxiety',
    description: 'Practical strategies to understand and manage anxiety symptoms.',
    duration: '5 weeks',
    lessons: 15,
    level: 'Intermediate',
    rating: 4.7,
    enrolled: 750,
    category: 'Anxiety',
    color: 'yellow'
  },
  {
    id: 'emotional-intelligence',
    title: 'Building Emotional Intelligence',
    description: 'Develop skills to understand and manage emotions effectively.',
    duration: '6 weeks',
    lessons: 18,
    level: 'Intermediate',
    rating: 4.6,
    enrolled: 650,
    category: 'Emotional Health',
    color: 'purple'
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene and Mental Health',
    description: 'Learn how proper sleep habits impact mental well-being.',
    duration: '2 weeks',
    lessons: 6,
    level: 'Beginner',
    rating: 4.5,
    enrolled: 890,
    category: 'Sleep Health',
    color: 'indigo'
  },
  {
    id: 'peer-support',
    title: 'Peer Support and Communication',
    description: 'Develop skills to support friends and build healthy relationships.',
    duration: '4 weeks',
    lessons: 12,
    level: 'Beginner',
    rating: 4.8,
    enrolled: 560,
    category: 'Social Skills',
    color: 'pink'
  }
]

const categories = ['All', 'Stress Management', 'Mindfulness', 'Anxiety', 'Emotional Health', 'Sleep Health', 'Social Skills']

export default function LearningPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
      case 'green': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
      case 'pink': return 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mental Health Learning Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enhance your mental health knowledge with our comprehensive courses. 
            Learn practical skills, coping strategies, and evidence-based techniques.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getColorClasses(course.color)} mb-4`}>
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  {course.category} • {course.level}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpenIcon className="h-4 w-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{course.enrolled} enrolled</span>
                  </div>
                </div>

                <Button className="w-full">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Choose Our Learning Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AcademicCapIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expert-Designed</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Courses created by licensed mental health professionals and educators
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ClockIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Self-Paced</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Learn at your own pace with flexible scheduling and lifetime access
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserGroupIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community Support</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect with fellow learners and share experiences in course forums
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to start your mental health learning journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
