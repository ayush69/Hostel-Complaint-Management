import { Link } from 'react-router-dom'
import {
//   ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    id: 1,
    name: 'Open Complaints',
    stat: '3',
    icon: ExclamationCircleIcon,
    change: '2 new today',
    changeType: 'increase',
  },
  {
    id: 2,
    name: 'In Progress',
    stat: '4',
    icon: ClockIcon,
    change: '1 updated recently',
    changeType: 'increase',
  },
  {
    id: 3,
    name: 'Resolved',
    stat: '12',
    icon: CheckCircleIcon,
    change: '3 this week',
    changeType: 'increase',
  },
]

const announcements = [
  {
    id: 1,
    title: 'Scheduled Maintenance',
    content: 'Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance work.',
    priority: 'high',
    date: '2024-02-20',
  },
  {
    id: 2,
    title: 'New Cleaning Schedule',
    content: 'Common areas will now be cleaned twice daily at 9 AM and 4 PM.',
    priority: 'medium',
    date: '2024-02-19',
  },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.id}
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
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <span className="text-gray-500">{item.change}</span>
                </p>
              </dd>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Announcements</h2>
        <div className="mt-4 space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-lg bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  announcement.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {announcement.priority}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{announcement.content}</p>
              <div className="mt-4 text-xs text-gray-500">
                Posted on {new Date(announcement.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/register-complaint"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Register New Complaint
        </Link>
      </div>
    </div>
  )
}