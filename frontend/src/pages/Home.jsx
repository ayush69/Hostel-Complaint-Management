// import { Link } from 'react-router-dom'
// import {
//   ClipboardDocumentCheckIcon,
//   ShieldCheckIcon,
//   ChartBarIcon,
//   ChatBubbleBottomCenterTextIcon,
//   ArrowPathIcon,
//   UserGroupIcon,
// } from '@heroicons/react/24/outline'

// const features = [
//   {
//     name: 'Quick Complaint Registration',
//     description: 'Submit complaints effortlessly with our streamlined process.',
//     icon: ClipboardDocumentCheckIcon,
//   },
//   {
//     name: 'Real-time Tracking',
//     description: 'Stay updated with the status of your complaints at all times.',
//     icon: ArrowPathIcon,
//   },
//   {
//     name: 'Secure & Anonymous',
//     description: 'Option to submit complaints anonymously with complete privacy.',
//     icon: ShieldCheckIcon,
//   },
//   {
//     name: 'Analytics Dashboard',
//     description: 'View your complaint history and resolution statistics.',
//     icon: ChartBarIcon,
//   },
//   {
//     name: 'Community Support',
//     description: 'Connect with hostel management for better resolution.',
//     icon: UserGroupIcon,
//   },
//   {
//     name: 'Feedback System',
//     description: 'Share your experience and help us improve our services.',
//     icon: ChatBubbleBottomCenterTextIcon,
//   },
// ]

// const categories = [
//   {
//     name: 'Maintenance',
//     description: 'Report issues with facilities and infrastructure',
//     href: '/register-complaint?category=maintenance',
//     color: 'bg-blue-500',
//   },
//   {
//     name: 'Cleanliness',
//     description: 'Report cleaning and hygiene related concerns',
//     href: '/register-complaint?category=cleaning',
//     color: 'bg-green-500',
//   },
//   {
//     name: 'Security',
//     description: 'Report security concerns and incidents',
//     href: '/register-complaint?category=security',
//     color: 'bg-red-500',
//   },
//   {
//     name: 'Room Issues',
//     description: 'Report problems with your room',
//     href: '/register-complaint?category=room',
//     color: 'bg-purple-500',
//   },
// ]

// const faqs = [
//   {
//     question: 'How do I register a complaint?',
//     answer:
//       'Click on the "Register Complaint" button, fill in the required details about your issue, and submit the form. You\'ll receive a confirmation with a tracking number.',
//   },
//   {
//     question: 'How can I track my complaint status?',
//     answer:
//       'Visit the "Current Complaints" section to view all your active complaints and their current status. Each complaint will show its progress and any updates from the staff.',
//   },
//   {
//     question: 'Can I submit an anonymous complaint?',
//     answer:
//       'Yes, you can choose to submit complaints anonymously. Simply check the "Submit Anonymously" option when registering your complaint.',
//   },
// ]

// export default function Home() {
//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <div className="relative isolate overflow-hidden">
//         <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
//           <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
//             <div className="mt-24 sm:mt-32 lg:mt-16">
//               <a href="#" className="inline-flex space-x-6">
//                 <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
//                   What's new
//                 </span>
//                 <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
//                   <span>Just shipped v1.0</span>
//                 </span>
//               </a>
//             </div>
//             <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//               Seamless Complaint Resolution at Your Fingertips
//             </h1>
//             <p className="mt-6 text-lg leading-8 text-gray-600">
//               Submit and track your complaints easily, anytime, anywhere. We're here to ensure your
//               hostel experience is comfortable and hassle-free.
//             </p>
//             <div className="mt-10 flex items-center gap-x-6">
//               <Link
//                 to="/register-complaint"
//                 className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Register a Complaint
//               </Link>
//               <Link to="/current-complaints" className="text-sm font-semibold leading-6 text-gray-900">
//                 View Complaints <span aria-hidden="true">→</span>
//               </Link>
//             </div>
//           </div>
//           <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
//             <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
//               <img
//                 src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
//                 alt="App screenshot"
//                 width={2432}
//                 height={1442}
//                 className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Feature section */}
//       <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
//         <div className="mx-auto max-w-2xl lg:text-center">
//           <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster Resolution</h2>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Everything you need to manage hostel complaints
//           </p>
//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             Our platform provides a comprehensive solution for managing and tracking all your hostel-related
//             concerns efficiently.
//           </p>
//         </div>
//         <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
//           <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
//             {features.map((feature) => (
//               <div key={feature.name} className="flex flex-col">
//                 <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
//                   <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
//                   {feature.name}
//                 </dt>
//                 <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
//                   <p className="flex-auto">{feature.description}</p>
//                 </dd>
//               </div>
//             ))}
//           </dl>
//         </div>
//       </div>

//       {/* Categories section */}
//       <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
//         <div className="mx-auto max-w-2xl lg:text-center">
//           <h2 className="text-base font-semibold leading-7 text-indigo-600">Quick Access</h2>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Complaint Categories
//           </p>
//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             Choose the relevant category for your complaint to ensure faster resolution
//           </p>
//         </div>
//         <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
//           <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
//             {categories.map((category) => (
//               <Link
//                 key={category.name}
//                 to={category.href}
//                 className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50"
//               >
//                 <div className={`rounded-lg ${category.color} p-2 w-12 h-12`} />
//                 <h3 className="mt-4 font-semibold text-gray-900">{category.name}</h3>
//                 <p className="mt-2 text-gray-600">{category.description}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FAQ section */}
//       <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
//         <div className="mx-auto max-w-2xl lg:text-center">
//           <h2 className="text-base font-semibold leading-7 text-indigo-600">FAQ</h2>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Frequently Asked Questions
//           </p>
//         </div>
//         <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
//           <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
//             {faqs.map((faq) => (
//               <div key={faq.question} className="flex flex-col">
//                 <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
//                 <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
//                   <p className="flex-auto">{faq.answer}</p>
//                 </dd>
//               </div>
//             ))}
//           </dl>
//         </div>
//       </div>

//       {/* CTA section */}
//       <div className="mx-auto mt-32 max-w-7xl sm:mt-40">
//         <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
//           <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
//             Start using our complaint management system today
//           </h2>
//           <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
//             Join hundreds of students who are already using our platform to make their hostel life better.
//           </p>
//           <div className="mt-10 flex items-center justify-center gap-x-6">
//             <Link
//               to="/register-complaint"
//               className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//             >
//               Get started
//             </Link>
//             <Link to="/suggestions" className="text-sm font-semibold leading-6 text-white">
//               Learn more <span aria-hidden="true">→</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mt-32 sm:mt-40" />
//     </div>
//   )
// }

// import { Link } from 'react-router-dom';
// import {
//   ClipboardDocumentCheckIcon,
//   ShieldCheckIcon,
//   ChartBarIcon,
//   ChatBubbleBottomCenterTextIcon,
//   ArrowPathIcon,
//   UserGroupIcon,
// } from '@heroicons/react/24/outline';

// const features = [
//   {
//     name: 'Quick Complaint Registration',
//     description: 'Submit complaints effortlessly with our streamlined process.',
//     icon: ClipboardDocumentCheckIcon,
//   },
//   {
//     name: 'Real-time Tracking',
//     description: 'Stay updated with the status of your complaints at all times.',
//     icon: ArrowPathIcon,
//   },
//   {
//     name: 'Secure & Anonymous',
//     description: 'Option to submit complaints anonymously with complete privacy.',
//     icon: ShieldCheckIcon,
//   },
//   {
//     name: 'Analytics Dashboard',
//     description: 'View your complaint history and resolution statistics.',
//     icon: ChartBarIcon,
//   },
//   {
//     name: 'Community Support',
//     description: 'Connect with hostel management for better resolution.',
//     icon: UserGroupIcon,
//   },
//   {
//     name: 'Feedback System',
//     description: 'Share your experience and help us improve our services.',
//     icon: ChatBubbleBottomCenterTextIcon,
//   },
// ];

// const categories = [
//   {
//     name: 'Maintenance',
//     description: 'Report issues with facilities and infrastructure',
//     href: '/register-complaint?category=maintenance',
//     color: 'bg-blue-500',
//   },
//   {
//     name: 'Cleanliness',
//     description: 'Report cleaning and hygiene related concerns',
//     href: '/register-complaint?category=cleaning',
//     color: 'bg-green-500',
//   },
//   {
//     name: 'Security',
//     description: 'Report security concerns and incidents',
//     href: '/register-complaint?category=security',
//     color: 'bg-red-500',
//   },
//   {
//     name: 'Room Issues',
//     description: 'Report problems with your room',
//     href: '/register-complaint?category=room',
//     color: 'bg-purple-500',
//   },
// ];

// const faqs = [
//   {
//     question: 'How do I register a complaint?',
//     answer:
//       'Click on the "Register Complaint" button, fill in the required details about your issue, and submit the form. You\'ll receive a confirmation with a tracking number.',
//   },
//   {
//     question: 'How can I track my complaint status?',
//     answer:
//       'Visit the "Current Complaints" section to view all your active complaints and their current status. Each complaint will show its progress and any updates from the staff.',
//   },
//   {
//     question: 'Can I submit an anonymous complaint?',
//     answer:
//       'Yes, you can choose to submit complaints anonymously. Simply check the "Submit Anonymously" option when registering your complaint.',
//   },
// ];

// export default function Home() {
//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <div className="relative isolate overflow-hidden">
//         <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
//           <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
//             <div className="mt-24 sm:mt-32 lg:mt-16">
//               <a href="#" className="inline-flex space-x-6">
//                 <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
//                   What's new
//                 </span>
//                 <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
//                   <span>Just shipped v1.0</span>
//                 </span>
//               </a>
//             </div>
//             <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//               Seamless Complaint Resolution at Your Fingertips
//             </h1>
//             <p className="mt-6 text-lg leading-8 text-gray-600">
//               Submit and track your complaints easily, anytime, anywhere. We're here to ensure your
//               hostel experience is comfortable and hassle-free.
//             </p>
//             <div className="mt-10 flex items-center gap-x-6">
//               <Link
//                 to="/register-complaint"
//                 className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Register a Complaint
//               </Link>
//               <Link to="/current-complaints" className="text-sm font-semibold leading-6 text-gray-900">
//                 View Complaints <span aria-hidden="true">→</span>
//               </Link>
//             </div>
//           </div>
//           <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
//             <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
//               <img
//                 src="https://images.unsplash.com/photo-1608033773496-2c968efb008c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
//                 alt="App screenshot"
//                 width={2432}
//                 height={1442}
//                 className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Feature section */}
//       <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
//         <div className="mx-auto max-w-2xl lg:text-center">
//           <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster Resolution</h2>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Everything you need to manage hostel complaints
//           </p>
//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             Our platform provides a comprehensive solution for managing and tracking all your hostel-related
//             concerns efficiently.
//           </p>
//         </div>
//         <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
//           <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
//             {features.map((feature) => (
//               <div key={feature.name} className="flex flex-col">
//                 <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
//                   <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
//                   {feature.name}
//                 </dt>
//                 <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
//                   <p className="flex-auto">{feature.description}</p>
//                 </dd>
//               </div>
//             ))}
//           </dl>
//         </div>
//       </div>

//       {/* Categories section */}
//       <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
//         <div className="mx-auto max-w-2xl lg:text-center">
//           <h2 className="text-base font-semibold leading-7 text-indigo-600">Quick Access</h2>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Complaint Categories
//           </p>
//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             Choose the relevant category for your complaint to ensure faster resolution
//           </p>
//         </div>
//         <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
//           <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
//             {categories.map((category) => (
//               <Link
//                 key={category.name}
//                 to={category.href}
//                 className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50"
//               >
//                 <div className={`rounded-lg ${category.color} p-2 w-12 h-12`} />
//                 <h3 className="mt-4 font-semibold text-gray-900">{category.name}</h3>
//                 <p className="mt-2 text-gray-600">{category.description}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FAQ section */}
//       <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
//         <div className="mx-auto max-w-2xl lg:text-center">
//           <h2 className="text-base font-semibold leading-7 text-indigo-600">FAQ</h2>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Frequently Asked Questions
//           </p>
//         </div>
//         <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
//           <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
//             {faqs.map((faq) => (
//               <div key={faq.question} className="flex flex-col">
//                 <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
//                 <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
//                   <p className="flex-auto">{faq.answer}</p>
//                 </dd>
//               </div>
//             ))}
//           </dl>
//         </div>
//       </div>

//       {/* CTA section */}
//       <div className="mx-auto mt-32 max-w-7xl sm:mt-40">
//         <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
//           <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
//             Start using our complaint management system today
//           </h2>
//           <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
//             Join hundreds of students who are already using our platform to make their hostel life better.
//           </p>
//           <div className="mt-10 flex items-center justify-center gap-x-6">
//             <Link
//               to="/register-complaint"
//               className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//             >
//               Get started
//             </Link>
//             <Link to="/suggestions" className="text-sm font-semibold leading-6 text-white">
//               Learn more <span aria-hidden="true">→</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mt-32 sm:mt-40" />
//     </div>
//   );
// }

import { Link } from 'react-router-dom'
import {
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Quick Complaint Registration',
    description: 'Submit complaints effortlessly with our streamlined process.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'Real-time Tracking',
    description: 'Stay updated with the status of your complaints at all times.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Secure & Anonymous',
    description: 'Option to submit complaints anonymously with complete privacy.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Analytics Dashboard',
    description: 'View your complaint history and resolution statistics.',
    icon: ChartBarIcon,
  },
  {
    name: 'Community Support',
    description: 'Connect with hostel management for better resolution.',
    icon: UserGroupIcon,
  },
  {
    name: 'Feedback System',
    description: 'Share your experience and help us improve our services.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
]

const categories = [
  {
    name: 'Maintenance',
    description: 'Report issues with facilities and infrastructure',
    href: '/register-complaint?category=maintenance',
    color: 'bg-blue-500',
  },
  {
    name: 'Cleanliness',
    description: 'Report cleaning and hygiene related concerns',
    href: '/register-complaint?category=cleaning',
    color: 'bg-green-500',
  },
  {
    name: 'Security',
    description: 'Report security concerns and incidents',
    href: '/register-complaint?category=security',
    color: 'bg-red-500',
  },
  {
    name: 'Room Issues',
    description: 'Report problems with your room',
    href: '/register-complaint?category=room',
    color: 'bg-purple-500',
  },
]

const faqs = [
  {
    question: 'How do I register a complaint?',
    answer:
      'Click on the "Register Complaint" button, fill in the required details about your issue, and submit the form. You\'ll receive a confirmation with a tracking number.',
  },
  {
    question: 'How can I track my complaint status?',
    answer:
      'Visit the "Current Complaints" section to view all your active complaints and their current status. Each complaint will show its progress and any updates from the staff.',
  },
  {
    question: 'Can I submit an anonymous complaint?',
    answer:
      'Yes, you can choose to submit complaints anonymously. Simply check the "Submit Anonymously" option when registering your complaint.',
  },
]

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v1.0</span>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Seamless Complaint Resolution at Your Fingertips
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Submit and track your complaints easily, anytime, anywhere. We're here to ensure your
              hostel experience is comfortable and hassle-free.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/register-complaint"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register a Complaint
              </Link>
              <Link to="/current-complaints" className="text-sm font-semibold leading-6 text-gray-900">
                View Complaints <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="/api/placeholder/2432/1442"
                alt="Complaint Management Dashboard"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster Resolution</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage hostel complaints
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides a comprehensive solution for managing and tracking all your hostel-related
            concerns efficiently.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Categories section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Quick Access</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Complaint Categories
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the relevant category for your complaint to ensure faster resolution
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative rounded-lg p-6 text-sm leading-6 hover:bg-gray-50"
              >
                <div className={`rounded-lg ${category.color} p-2 w-12 h-12`} />
                <h3 className="mt-4 font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-2 text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">FAQ</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="mx-auto mt-32 max-w-7xl sm:mt-40">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start using our complaint management system today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join hundreds of students who are already using our platform to make their hostel life better.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register-complaint"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </Link>
            <Link to="/suggestions" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-32 sm:mt-40" />
    </div>
  )
}