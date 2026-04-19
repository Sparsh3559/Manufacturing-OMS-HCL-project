import React from 'react'
import { Search, Bell } from 'lucide-react'
import { useAvatarColor, getInitials } from '@/hooks/useAvatarColor'
import { getAvatar } from '@/assets/avatars'

export function Header() {
  const userAvatar = getAvatar('opsManager')
  const avatarColor = useAvatarColor(userAvatar.name)
  const initials = getInitials(userAvatar.name)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white bg-opacity-80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-8">
        {/* Search bar */}
        <div className="flex flex-1 items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full rounded-lg bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-6">
          {/* Notification button */}
          <button className="relative flex items-center justify-center text-slate-600 hover:text-slate-900">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">{userAvatar.name}</div>
              <div className="text-xs text-slate-500">{userAvatar.role}</div>
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white font-semibold text-sm ${avatarColor}`}
            >
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
