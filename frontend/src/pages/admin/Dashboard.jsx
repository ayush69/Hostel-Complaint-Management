import { useState } from 'react'
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Bar } from 'recharts'

// Mock data for demonstration
const mockStats = [
  {
    name: 'Total Complaints',
    stat: '48',
    icon: ChartBarIcon,
    change: '12% increase',
    changeType: 'increase',
  },
  {
    name: 'Pending Assignment',
    stat: '15',
    icon: ClockIcon,
    change: '3 new today',
    changeType: 'increase',
  },
  {
    name: 'Resolved Today',
    stat: '8',
    icon: CheckCircleIcon,
    change: '10% increase',
    changeType: 'increase',
  },
  {
    name: 'Active Workers',
    stat: '12',
    icon: UserGroupIcon,
    change: 'All available',
    changeType: 'neutral',
  },
]

const mockPerformanceData = [
  { name: 'Electrical', resolved: 25, pending: 10 },
  { name: 'Plumbing', resolved: 18, pending: 8 },
  { name: 'Cleaning', resolved: 30, pending: 5 },
  { name: 'Others', resolved: 15, pending: 7 },
]

export default function AdminDashboard() {
  const [period, setPeriod] = useState('week')

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Stats */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mockStats.map((item) => (
                <div
                  key={item.name}
                  className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                >
                  <dt>
                    <div className="absolute rounded-md bg-indigo-500 p-3">
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                    <p
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'increase'
                          ? 'text-green-600'
                          : item.changeType === 'decrease'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.change}
                    </p>
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mt-8">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Complaint Resolution Performance</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
              <div className="mt-6" style={{ height: '400px' }}>
                {/* Add your chart component here */}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <div className="mt-6 flow-root">
                <ul role="list" className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                            <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              Complaint <span className="font-medium text-gray-900">#1234</span> resolved by{' '}
                              <span className="font-medium text-gray-900">John Doe</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime="2024-02-14T13:00">1 hour ago</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  {/* Add more activity items */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}