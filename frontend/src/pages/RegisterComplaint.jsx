// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { PhotoIcon } from '@heroicons/react/24/solid'
// import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
// import { clsx } from 'clsx'
// import type { ComplaintCategory } from '../types'

// interface ComplaintForm {
//   title: string
//   category: ComplaintCategory
//   description: string
//   location: {
//     block: string
//     roomNumber: string
//   }
//   preferredResolutionDate?: string
//   isAnonymous: boolean
//   images: FileList
// }

// const categories: { value: ComplaintCategory; label: string }[] = [
//   { value: 'electrical', label: 'Electrical Issues' },
//   { value: 'plumbing', label: 'Plumbing Problems' },
//   { value: 'cleaning', label: 'Cleaning & Hygiene' },
//   { value: 'others', label: 'Other Issues' },
// ]

// export default function RegisterComplaint() {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm<ComplaintForm>()

//   const onSubmit = async (data: ComplaintForm) => {
//     setIsSubmitting(true)
//     try {
//       // TODO: Implement API call to submit complaint
//       console.log('Submitting complaint:', data)
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       alert('Complaint submitted successfully!')
//     } catch (error) {
//       console.error('Error submitting complaint:', error)
//       alert('Failed to submit complaint. Please try again.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const watchImages = watch('images')
//   const selectedImages = watchImages ? Array.from(watchImages) : []

//   return (
//     <div className="mx-auto max-w-3xl">
//       <div className="space-y-12">
//         <div className="border-b border-gray-900/10 pb-12">
//           <h2 className="text-2xl font-semibold leading-7 text-gray-900">Register a Complaint</h2>
//           <p className="mt-1 text-sm leading-6 text-gray-600">
//             Please provide details about your complaint. The more information you provide, the better we can assist you.
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8">
//             {/* Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
//                 Complaint Title
//               </label>
//               <div className="relative mt-2">
//                 <input
//                   type="text"
//                   id="title"
//                   {...register('title', {
//                     required: 'Title is required',
//                     minLength: {
//                       value: 5,
//                       message: 'Title must be at least 5 characters',
//                     },
//                   })}
//                   className={clsx(
//                     'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
//                     errors.title && 'ring-red-300 focus:ring-red-500'
//                   )}
//                 />
//                 {errors.title && (
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
//                     <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
//                   </div>
//                 )}
//               </div>
//               {errors.title && (
//                 <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
//               )}
//             </div>

//             {/* Category */}
//             <div>
//               <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
//                 Category
//               </label>
//               <select
//                 id="category"
//                 {...register('category', { required: 'Please select a category' })}
//                 className={clsx(
//                   'mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6',
//                   errors.category && 'ring-red-300 focus:ring-red-500'
//                 )}
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category.value} value={category.value}>
//                     {category.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.category && (
//                 <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
//               )}
//             </div>

//             {/* Location */}
//             <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="block" className="block text-sm font-medium leading-6 text-gray-900">
//                   Block/Building
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     id="block"
//                     {...register('location.block', { required: 'Block is required' })}
//                     className={clsx(
//                       'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
//                       errors.location?.block && 'ring-red-300 focus:ring-red-500'
//                     )}
//                   />
//                 </div>
//                 {errors.location?.block && (
//                   <p className="mt-2 text-sm text-red-600">{errors.location.block.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="roomNumber" className="block text-sm font-medium leading-6 text-gray-900">
//                   Room Number
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     id="roomNumber"
//                     {...register('location.roomNumber', { required: 'Room number is required' })}
//                     className={clsx(
//                       'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
//                       errors.location?.roomNumber && 'ring-red-300 focus:ring-red-500'
//                     )}
//                   />
//                 </div>
//                 {errors.location?.roomNumber && (
//                   <p className="mt-2 text-sm text-red-600">{errors.location.roomNumber.message}</p>
//                 )}
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
//                 Description
//               </label>
//               <div className="mt-2">
//                 <textarea
//                   id="description"
//                   rows={4}
//                   {...register('description', {
//                     required: 'Description is required',
//                     minLength: {
//                       value: 20,
//                       message: 'Description must be at least 20 characters',
//                     },
//                   })}
//                   className={clsx(
//                     'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
//                     errors.description && 'ring-red-300 focus:ring-red-500'
//                   )}
//                   placeholder="Please provide detailed information about the issue..."
//                 />
//               </div>
//               {errors.description && (
//                 <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
//               )}
//             </div>

//             {/* Preferred Resolution Date */}
//             <div>
//               <label htmlFor="preferredResolutionDate" className="block text-sm font-medium leading-6 text-gray-900">
//                 Preferred Resolution Date (Optional)
//               </label>
//               <div className="mt-2">
//                 <input
//                   type="date"
//                   id="preferredResolutionDate"
//                   {...register('preferredResolutionDate')}
//                   min={new Date().toISOString().split('T')[0]}
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div>

//             {/* Image Upload */}
//             <div>
//               <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
//                 Upload Images (Optional)
//               </label>
//               <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
//                 <div className="text-center">
//                   <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
//                   <div className="mt-4 flex text-sm leading-6 text-gray-600">
//                     <label
//                       htmlFor="images"
//                       className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
//                     >
//                       <span>Upload files</span>
//                       <input
//                         id="images"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         className="sr-only"
//                         {...register('images')}
//                       />
//                     </label>
//                     <p className="pl-1">or drag and drop</p>
//                   </div>
//                   <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB each</p>
//                 </div>
//               </div>
//               {selectedImages.length > 0 && (
//                 <div className="mt-2 flex gap-2 overflow-x-auto py-2">
//                   {selectedImages.map((file, index) => (
//                     <div key={index} className="relative h-20 w-20 flex-shrink-0">
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt={`Preview ${index + 1}`}
//                         className="h-full w-full rounded-md object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Anonymous Option */}
//             <div className="relative flex gap-x-3">
//               <div className="flex h-6 items-center">
//                 <input
//                   id="isAnonymous"
//                   type="checkbox"
//                   {...register('isAnonymous')}
//                   className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
//                 />
//               </div>
//               <div className="text-sm leading-6">
//                 <label htmlFor="isAnonymous" className="font-medium text-gray-900">
//                   Submit Anonymously
//                 </label>
//                 <p className="text-gray-500">
//                   Check this if you want to submit this complaint without revealing your identity.
//                 </p>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="mt-6 flex items-center justify-end gap-x-6">
//               <button
//                 type="button"
//                 className="text-sm font-semibold leading-6 text-gray-900"
//                 onClick={() => window.history.back()}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={clsx(
//                   'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
//                   isSubmitting && 'opacity-50 cursor-not-allowed'
//                 )}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
//import { ComplaintCategory } from '../types/index.js'

/**
 * @typedef {Object} ComplaintForm
 * @property {string} title
 * @property {ComplaintCategory} category
 * @property {string} description
 * @property {{ block: string, roomNumber: string }} location
 * @property {string} [preferredResolutionDate]
 * @property {boolean} isAnonymous
 * @property {FileList} images
 */

const categories = [
  { value: 'electrical', label: 'Electrical Issues' },
  { value: 'plumbing', label: 'Plumbing Problems' },
  { value: 'cleaning', label: 'Cleaning & Hygiene' },
  { value: 'others', label: 'Other Issues' },
]

export default function RegisterComplaint() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      console.log('Submitting complaint:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Complaint submitted successfully!')
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert('Failed to submit complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchImages = watch('images')
  const selectedImages = watchImages ? Array.from(watchImages) : []

  return (
    <div className="mx-auto max-w-3xl p-8 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-purple-600">Register a Complaint</h2>
      <p className="mt-2 text-gray-600">
        Provide detailed information about your complaint. The more information you provide, the better we can assist.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">
            Complaint Title
          </label>
          <div className="relative mt-2">
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
                'block w-full rounded-xl border-gray-300 p-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-sky-500',
                errors.title && 'ring-red-300 focus:ring-red-500'
              )}
              placeholder="e.g., Power outage in Block A"
            />
            {errors.title && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            {...register('category', { required: 'Please select a category' })}
            className={clsx(
              'mt-2 block w-full rounded-xl border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-sky-500',
              errors.category && 'ring-red-300 focus:ring-red-500'
            )}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="block" className="block text-lg font-medium text-gray-700">
              Block/Building
            </label>
            <input
              type="text"
              id="block"
              {...register('location.block', { required: 'Block is required' })}
              className={clsx(
                'block w-full rounded-xl border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-sky-500',
                errors.location?.block && 'ring-red-300 focus:ring-red-500'
              )}
              placeholder="e.g., Block A"
            />
            {errors.location?.block && (
              <p className="mt-2 text-sm text-red-600">{errors.location.block.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="roomNumber" className="block text-lg font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              {...register('location.roomNumber', { required: 'Room number is required' })}
              className={clsx(
                'block w-full rounded-xl border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-sky-500',
                errors.location?.roomNumber && 'ring-red-300 focus:ring-red-500'
              )}
              placeholder="e.g., Room 101"
            />
            {errors.location?.roomNumber && (
              <p className="mt-2 text-sm text-red-600">{errors.location.roomNumber.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">
            Description
          </label>
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
              'block w-full rounded-xl border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-sky-500',
              errors.description && 'ring-red-300 focus:ring-red-500'
            )}
            placeholder="Please provide detailed information about the issue..."
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Preferred Resolution Date */}
        <div>
          <label htmlFor="preferredResolutionDate" className="block text-lg font-medium text-gray-700">
            Preferred Resolution Date (Optional)
          </label>
          <input
            type="date"
            id="preferredResolutionDate"
            {...register('preferredResolutionDate')}
            min={new Date().toISOString().split('T')[0]}
            className="block w-full rounded-xl border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-lg font-medium text-gray-700">
            Upload Images (Optional)
          </label>
          <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 p-8">
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <div className="mt-4 flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-sky-500 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-sky-600"
                >
                  <span>Upload files</span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    {...register('images')}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>
          {selectedImages.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto py-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative h-20 w-20 flex-shrink-0 rounded-xl shadow-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anonymous Option */}
        <div className="relative flex gap-x-3">
          <div className="flex h-6 items-center">
            <input
              id="isAnonymous"
              type="checkbox"
              {...register('isAnonymous')}
              className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="isAnonymous" className="font-medium text-gray-700">
              Submit Anonymously
            </label>
            <p className="text-gray-500">Check this if you want to submit this complaint without revealing your identity.</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="text-sm font-semibold text-gray-700 hover:underline"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              'rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-white font-semibold shadow-lg hover:from-sky-600 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  )
}
