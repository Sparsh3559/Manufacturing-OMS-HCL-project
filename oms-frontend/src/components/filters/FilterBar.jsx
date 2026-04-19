import React from 'react'
import { ChevronDown, Sliders } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * FilterBar - Container for filter controls
 */
export function FilterBar({ children }) {
  return (
    <div className="rounded-xl bg-slate-100 p-4 flex gap-4 items-center ">
      {children}
    </div>
  )
}

/**
 * SelectFilter - Dropdown filter component
 */
export function SelectFilter({ label, options = [], value, onChange, multiple = false }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || options[0]?.id)

  const handleSelect = (optionId) => {
    setSelectedValue(optionId)
    onChange?.(optionId)
    !multiple && setIsOpen(false)
  }

  const selectedOption = options.find((opt) => opt.id === selectedValue)

  return (
    <div className="relative min-w-max">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
      >
        <span className="text-xs text-slate-600">{label}:</span>
        <span className="font-semibold">{selectedOption?.label || 'Select...'}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                'block w-full px-4 py-3 text-left text-sm hover:bg-slate-50 border-b border-slate-100 last:border-b-0',
                selectedValue === opt.id && 'bg-indigo-50 text-indigo-700 font-semibold'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * DateRangeFilter - Date range picker
 */
export function DateRangeFilter() {
  return (
    <div className="relative">
      <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
        <span className="text-xs text-slate-600">Date Range:</span>
        <span className="font-semibold">Last 30 Days</span>
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}

/**
 * AdvancedFiltersButton - Opens advanced filter panel
 */
export function AdvancedFiltersButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="ml-auto flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
    >
      <Sliders className="h-4 w-4" />
      Advanced Filters
    </button>
  )
}
