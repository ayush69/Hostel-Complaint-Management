import { useState } from 'react'
import {
  UserCircleIcon,
  ChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
// import { User } from '../../types' // Removed TypeScript type import for JS file

// Mock data for demonstration
const mockWorkers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'worker',
    department: 'Electrical',
    specialization: 'General Electrical',
    activeComplaints: 3,
    completedComplaints: 45,
    rating: 4.5,
  },
  // Add more mock workers
]

export default function WorkerManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  const filteredWorkers = mockWorkers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (departmentFilter ? worker.department === departmentFilter : true)
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Worker Management</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Search and Filter */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">All Departments</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>

          {/* Workers Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    <UserCircleIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{worker.name}</h3>
                    <p className="text-sm text-gray-500">{worker.department}</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Active Complaints</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {worker.activeComplaints}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {worker.completedComplaints}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <div className="flex items-center">
                    <StarIcon
                      className={`h-5 w-5 ${
                        worker.rating && worker.rating >= 4
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {worker.rating} out of 5
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}