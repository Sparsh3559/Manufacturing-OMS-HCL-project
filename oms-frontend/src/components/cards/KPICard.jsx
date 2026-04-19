import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * KPICard - Displays a key performance indicator with trend
 * Used on dashboard to show important metrics
 */
export function KPICard({ icon: Icon, title, value, trend, trendType = 'positive' }) {
  const isPositive = trendType === 'positive'
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex items-start justify-between mb-4">
        {/* Icon background */}
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            <Icon className="h-6 w-6 text-slate-600" />
          </div>
        )}

        {/* Trend badge */}
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Metric info */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  )
}

/**
 * StatCard - Displays summary statistics
 * Smaller variant for stats grids
 */
export function StatCard({ label, value, trend, trendType = 'positive' }) {
  const isPositive = trendType === 'positive'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</p>

        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>

          {trend && (
            <p
              className={`text-xs font-semibold ${
                isPositive ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
