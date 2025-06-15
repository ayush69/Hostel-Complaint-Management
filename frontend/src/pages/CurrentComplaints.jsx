import { useState } from 'react'
import { format } from 'date-fns'
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

// Mock data for demonstration
const mockComplaints = [
  {
    id: '1',
    title: 'Room Light Not Working',
    category: 'electrical',
    description: 'The main light in room 203 is flickering and needs immediate attention.',
    status: 'in_progress',
    createdAt: '2024-02-08T10:00:00Z',
    updatedAt: '2024-02-08T14:30:00Z',
    assignedStaffId: 'staff-1',
    userId: 'user-1',
  },
  {
    id: '2',
    title: 'Water Leakage in Bathroom',
    category: 'plumbing',
    description: 'There is a continuous water leakage from the bathroom sink.',
    status: 'open',
    createdAt: '2024-02-09T09:00:00Z',
    updatedAt: '2024-02-09T09:00:00Z',
    userId: 'user-1',
  },
  // Add more mock complaints as needed
]

const statusStyles = {
  open: {
    text: 'text-red-700',
    bg: 'bg-red-50',
    icon: XCircleIcon,
  },
  in_progress: {
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
    icon: ClockIcon,
  },
  resolved: {
    text: 'text-green-700',
    bg: 'bg-green-50',
    icon: CheckCircleIcon,
  },
}

const categoryStyles = {
  electrical: 'bg-blue-100 text-blue-800',
  plumbing: 'bg-purple-100 text-purple-800',
  cleaning: 'bg-green-100 text-green-800',
  others: 'bg-gray-100 text-gray-800',
}

export default function CurrentComplaints() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch = complaint.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory
      ? complaint.category === selectedCategory
      : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              Current Complaints
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your active complaints and their current status.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="cleaning">Cleaning</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Complaints List */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {filteredComplaints.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <XCircleIcon className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No complaints found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No complaints match your search criteria.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 bg-white">
                    {filteredComplaints.map((complaint) => {
                      const StatusIcon = statusStyles[complaint.status].icon
                      return (
                        <div
                          key={complaint.id}
                          className="p-4 hover:bg-gray-50 sm:p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h2 className="text-lg font-medium text-gray-900">
                                    {complaint.title}
                                  </h2>
                                  <span
                                    className={clsx(
                                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                      categoryStyles[complaint.category]
                                    )}
                                  >
                                    {complaint.category}
                                  </span>
                                </div>
                                <div
                                  className={clsx(
                                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                    statusStyles[complaint.status].bg,
                                    statusStyles[complaint.status].text
                                  )}
                                >
                                  <StatusIcon
                                    className="mr-1 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  {complaint.status.replace('_', ' ')}
                                </div>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">
                                {complaint.description}
                              </p>
                              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                <span>
                                  Submitted:{' '}
                                  {format(
                                    new Date(complaint.createdAt),
                                    'MMM d, yyyy'
                                  )}
                                </span>
                                {complaint.assignedStaffId && (
                                  <span>
                                    Assigned to: Staff #{complaint.assignedStaffId}
                                  </span>
                                )}
                                <span>
                                  Last updated:{' '}
                                  {format(
                                    new Date(complaint.updatedAt),
                                    'MMM d, yyyy'
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          {complaint.status === 'open' && (
                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                                onClick={() => {
                                  // Handle complaint cancellation
                                  console.log('Cancel complaint:', complaint.id)
                                }}
                              >
                                Cancel Complaint
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}