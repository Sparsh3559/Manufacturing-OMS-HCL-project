/**
 * Hook to generate and retrieve consistent avatar colors based on name
 * Uses a seeded hash to ensure the same person always gets the same color
 */

const AVATAR_COLORS = [
  'bg-red-100 text-red-700',
  'bg-orange-100 text-orange-700',
  'bg-amber-100 text-amber-700',
  'bg-yellow-100 text-yellow-700',
  'bg-lime-100 text-lime-700',
  'bg-green-100 text-green-700',
  'bg-emerald-100 text-emerald-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
  'bg-sky-100 text-sky-700',
  'bg-blue-100 text-blue-700',
  'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700',
  'bg-purple-100 text-purple-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-pink-100 text-pink-700',
]

/**
 * Simple hash function to generate consistent number from string
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Get avatar color classes for a person based on their name
 * @param {string} name - Person's full name or identifier
 * @returns {string} Tailwind classes for avatar styling
 */
export function useAvatarColor(name) {
  if (!name || typeof name !== 'string') {
    return AVATAR_COLORS[0]
  }

  const hash = simpleHash(name.toLowerCase())
  const colorIndex = hash % AVATAR_COLORS.length
  return AVATAR_COLORS[colorIndex]
}

/**
 * Get initials from a name
 * @param {string} name - Person's full name
 * @returns {string} Two letter initials
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') {
    return 'NA'
  }

  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return 'NA'

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
