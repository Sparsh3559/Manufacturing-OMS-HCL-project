import { Bell, HelpCircle, Search } from 'lucide-react'

export default function TopBar({ placeholder = 'Search resources...' }) {
  const name = localStorage.getItem('name') || 'User'
  const role = localStorage.getItem('role') || ''

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm flex items-center justify-between px-8 z-10">
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative p-1">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-1">
            <HelpCircle className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="w-px h-8 bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 leading-tight">{name}</p>
            <p className="text-[10px] text-slate-500">{role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-slate-200">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}