import { useState } from 'react'
import { format } from 'date-fns'
import { StarIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

// Mock data for demonstration
const mockComplaints = [
  {
    id: '1',
    title: 'Broken Window Handle',
    category: 'others',
    description: 'The window handle in room 302 was broken and needed replacement.',
    status: 'resolved',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    assignedStaffId: 'staff-2',
    userId: 'user-1',
    rating: 4,
  },
  {
    id: '2',
    title: 'AC Not Cooling',
    category: 'electrical',
    description: 'The AC unit was not cooling properly and required servicing.',
    status: 'resolved',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
    assignedStaffId: 'staff-3',
    userId: 'user-1',
    rating: 5,
  },
  // Add more mock complaints as needed
]

const categoryStyles = {
  electrical: 'bg-blue-100 text-blue-800',
  plumbing: 'bg-purple-100 text-purple-800',
  cleaning: 'bg-green-100 text-green-800',
  others: 'bg-gray-100 text-gray-800',
}

export default function PreviousComplaints() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [feedback, setFeedback] = useState({})
  const [hoveredRating, setHoveredRating] = useState(null)

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch = complaint.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory
      ? complaint.category === selectedCategory
      : true
    const matchesRating = selectedRating
      ? complaint.rating === parseInt(selectedRating)
      : true
    return matchesSearch && matchesCategory && matchesRating
  })

  const handleRatingSubmit = (complaintId, rating) => {
    // Handle rating submission
    console.log('Submitting rating:', {
      complaintId,
      rating,
      feedback: feedback[complaintId],
    })
    // Clear feedback after submission
    setFeedback((prev) => ({ ...prev, [complaintId]: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">
              Previous Complaints
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of your resolved complaints and their ratings.
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
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Ratings</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Complaints Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
            >
              <div className="flex items-center justify-between">
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
              <p className="mt-2 text-sm text-gray-600">{complaint.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>
                  Resolved:{' '}
                  {format(new Date(complaint.updatedAt), 'MMM d, yyyy')}
                </span>
                {complaint.assignedStaffId && (
                  <span>Resolved by: Staff #{complaint.assignedStaffId}</span>
                )}
              </div>

              {/* Rating Section */}
              <div className="mt-6">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">Rating</p>
                  <div className="ml-4 flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={clsx(
                          'h-5 w-5 cursor-pointer',
                          (hoveredRating?.complaintId === complaint.id &&
                            hoveredRating.rating >= rating) ||
                            (complaint.rating && complaint.rating >= rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        )}
                        onMouseEnter={() =>
                          setHoveredRating({
                            complaintId: complaint.id,
                            rating,
                          })
                        }
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleRatingSubmit(complaint.id, rating)}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-4">
                  <textarea
                    rows={2}
                    placeholder="Add your feedback (optional)"
                    value={feedback[complaint.id] || ''}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [complaint.id]: e.target.value,
                      }))
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}