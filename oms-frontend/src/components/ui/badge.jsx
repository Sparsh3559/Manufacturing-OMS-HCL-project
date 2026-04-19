import React from 'react'
import { cn } from '@/lib/utils'

const BADGE_VARIANTS = {
  paid: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  cancelled: 'bg-red-50 text-red-700',
  default: 'bg-slate-100 text-slate-700',
}

/**
 * Badge - Status indicator badge
 */
export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
        BADGE_VARIANTS[variant] || BADGE_VARIANTS.default,
        className
      )}
    >
      {children}
    </span>
  )
}
