import React from 'react'

/**
 * AppShell - Main layout wrapper
 * Provides consistent layout structure with sidebar, header, and content area
 */
export function AppShell({ children }) {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 overflow-y-auto bg-slate-900 z-50">
        {/* Sidebar content will be rendered in Sidebar component */}
      </aside>

      {/* Main content area */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Header will be at the top */}
        {/* Content below */}
        {children}
      </div>
    </div>
  )
}
