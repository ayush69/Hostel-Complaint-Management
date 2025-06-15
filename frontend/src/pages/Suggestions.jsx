import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import {
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
/* import type { Suggestion } from '../types' */ // Removed for JS compatibility

/**
 * @typedef {Object} SuggestionForm
 * @property {string} title
 * @property {string} description
 * @property {boolean} isAnonymous
 */

// Mock data for demonstration
const mockSuggestions = [
  {
    id: '1',
    title: 'Extended Library Hours',
    description:
      'Consider keeping the library open until midnight during exam periods.',
    isAnonymous: false,
    status: 'reviewed',
    createdAt: '2024-02-01T10:00:00Z',
    userId: 'user-1',
  },
  {
    id: '2',
    title: 'Better Wi-Fi Coverage',
    description:
      'Install additional Wi-Fi routers in the common areas to improve connectivity.',
    isAnonymous: true,
    status: 'implemented',
    createdAt: '2024-01-25T14:30:00Z',
  },
  // Add more mock suggestions as needed
]

const statusStyles = {
  pending: {
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
    icon: ClockIcon,
  },
  reviewed: {
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    icon: CheckCircleIcon,
  },
  implemented: {
    text: 'text-green-700',
    bg: 'bg-green-50',
    icon: CheckCircleIcon,
  },
}

export default function Suggestions() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to submit suggestion
      console.log('Submitting suggestion:', data)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      reset()
      alert('Suggestion submitted successfully!')
    } catch (error) {
      console.error('Error submitting suggestion:', error)
      alert('Failed to submit suggestion. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              Suggestion Box
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Share your ideas to help us improve the hostel experience.
            </p>
          </div>
        </div>

        {/* Suggestion Form */}
        <div className="mt-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 divide-y divide-gray-200 bg-white p-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Suggestion Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="title"
                    {...register('title', {
                      required: 'Title is required',
                      minLength: {
                        value: 5,
                        message: 'Title must be at least 5 characters',
                      },
                    })}
                    className={clsx(
                      'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                      errors.title && 'ring-red-300 focus:ring-red-500'
                    )}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description', {
                      required: 'Description is required',
                      minLength: {
                        value: 20,
                        message: 'Description must be at least 20 characters',
                      },
                    })}
                    className={clsx(
                      'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                      errors.description && 'ring-red-300 focus:ring-red-500'
                    )}
                    placeholder="Please provide detailed information about your suggestion..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="isAnonymous"
                    type="checkbox"
                    {...register('isAnonymous')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="isAnonymous"
                    className="font-medium text-gray-900"
                  >
                    Submit Anonymously
                  </label>
                  <p className="text-gray-500">
                    Your identity will not be revealed with the suggestion.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => reset()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={clsx(
                    'ml-3 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Previous Suggestions */}
        <div className="mt-16">
          <h2 className="text-lg font-medium text-gray-900">
            Previous Suggestions
          </h2>
          <div className="mt-6 space-y-6">
            {mockSuggestions.map((suggestion) => {
              const StatusIcon = statusStyles[suggestion.status].icon
              return (
                <div
                  key={suggestion.id}
                  className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <LightBulbIcon
                        className="h-5 w-5 text-yellow-500"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm font-medium text-gray-900">
                        {suggestion.title}
                      </h3>
                    </div>
                    <div
                      className={clsx(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        statusStyles[suggestion.status].bg,
                        statusStyles[suggestion.status].text
                      )}
                    >
                      <StatusIcon
                        className="mr-1 h-4 w-4"
                        aria-hidden="true"
                      />
                      {suggestion.status}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {suggestion.description}
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    <span>
                      Submitted on{' '}
                      {format(new Date(suggestion.createdAt), 'MMM d, yyyy')}
                    </span>
                    {!suggestion.isAnonymous && suggestion.userId && (
                      <span className="ml-2">by User #{suggestion.userId}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}