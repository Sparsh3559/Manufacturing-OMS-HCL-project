import React from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * LineChart - Faux line chart visualization
 * Uses colored bars to represent monthly data
 */
export function LineChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Bar heights (0-280px range)
  const heights = [102.39, 140.8, 115.19, 179.19, 217.59, 153.59, 102.39, 76.8, 128, 166.39, 192, 230.39]

  return (
    <div className="rounded-2xl bg-white p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Monthly Revenue</h3>
            <p className="mt-1 text-sm text-slate-600">Performance comparison across the fiscal year</p>
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-900">
            Current Year
          </div>
        </div>
      </div>

      {/* Chart bars */}
      <div className="mb-6 flex items-end justify-center gap-2 h-80">
        {heights.map((height, i) => (
          <div
            key={i}
            className={`rounded-t-lg transition-all ${
              i === 5 ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
            style={{ height: `${height}px`, flex: 1 }}
          />
        ))}
      </div>

      {/* Month labels */}
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  )
}

/**
 * BarChart - Category breakdown bar chart
 */
export function BarChart() {
  const categories = [
    { name: 'Electronics', percentage: 58, color: 'bg-indigo-600' },
    { name: 'Software', percentage: 24, color: 'bg-slate-600' },
    { name: 'Furniture', percentage: 18, color: 'bg-amber-700' },
  ]

  return (
    <div className="rounded-2xl bg-white p-8">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900">Category Breakdown</h3>
        <p className="mt-1 text-sm text-slate-600">Top performing product segments</p>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">{cat.name}</span>
              <span className="text-sm font-bold text-slate-900">{cat.percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full ${cat.color}`}
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
        View Full Inventory
      </button>
    </div>
  )
}
