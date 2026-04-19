/**
 * Mock avatar data for users in the system
 * Used throughout the app for user profiles, tables, etc.
 */

export const AVATARS = {
  admin: {
    name: 'Alex Sterling',
    initials: 'AS',
    role: 'Administrator',
    color: 'indigo',
  },
  opsManager: {
    name: 'Alex Sterling',
    initials: 'AS',
    role: 'Ops Manager',
    color: 'indigo',
  },
  julianneSmith: {
    name: 'Julianne Smith',
    initials: 'JS',
    role: 'Customer',
    color: 'indigo',
  },
  marcusThorne: {
    name: 'Marcus Thorne',
    initials: 'MT',
    role: 'Customer',
    color: 'amber',
  },
  elaraVance: {
    name: 'Elara Vance',
    initials: 'EV',
    role: 'Customer',
    color: 'gray',
  },
  bennetKlay: {
    name: 'Bennet Klay',
    initials: 'BK',
    role: 'Customer',
    color: 'slate',
  },
}

/**
 * Get avatar by key
 * @param {string} key - Avatar key
 * @returns {Object} Avatar object with name, initials, role, color
 */
export function getAvatar(key) {
  return AVATARS[key] || AVATARS.admin
}
