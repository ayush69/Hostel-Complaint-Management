/**
 * @typedef {'open' | 'in_progress' | 'resolved' | 'review_required'} ComplaintStatus
 * @typedef {'electrical' | 'cleaning' | 'plumbing' | 'others'} ComplaintCategory
 * @typedef {'admin' | 'worker' | 'student'} UserRole
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} text
 * @property {string} createdAt
 * @property {string} userId
 * @property {UserRole} userRole
 */

/**
 * @typedef {Object} Complaint
 * @property {string} id
 * @property {string} title
 * @property {ComplaintCategory} category
 * @property {string} description
 * @property {ComplaintStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [imageUrl]
 * @property {string} [assignedStaffId]
 * @property {string} userId
 * @property {'low' | 'medium' | 'high'} priority
 * @property {Comment[]} [comments]
 */

/**
 * @typedef {Object} Suggestion
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {boolean} isAnonymous
 * @property {'pending' | 'reviewed' | 'implemented'} status
 * @property {string} createdAt
 * @property {string} [userId]
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} createdAt
 * @property {'low' | 'medium' | 'high'} priority
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [roomNumber]
 * @property {string} [hostelBlock]
 * @property {UserRole} role
 * @property {string} [department]
 * @property {string} [specialization]
 * @property {number} [activeComplaints]
 * @property {number} [completedComplaints]
 * @property {number} [rating]
 */

// Export actual arrays/constants for use in your code
export const ComplaintCategories = ['electrical', 'cleaning', 'plumbing', 'others'];
export const ComplaintStatuses = ['open', 'in_progress', 'resolved', 'review_required'];
export const UserRoles = ['admin', 'worker', 'student'];