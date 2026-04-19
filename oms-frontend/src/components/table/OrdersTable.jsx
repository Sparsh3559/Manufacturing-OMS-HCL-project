import React from 'react'
import { ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react'
import { useAvatarColor, getInitials } from '@/hooks/useAvatarColor'
import { cn } from '@/lib/utils'

/**
 * TableHeader - Header cell for table
 */
export function TableHeader({ children, onClick, sortable = false }) {
  return (
    <th
      onClick={onClick}
      className={cn(
        'bg-slate-100 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200',
        sortable && 'cursor-pointer hover:bg-slate-200'
      )}
    >
      {children}
    </th>
  )
}

/**
 * TableCell - Data cell for table
 */
export function TableCell({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left'
  return (
    <td className={cn('px-6 py-4 text-sm text-slate-900 border-b border-slate-100', alignClass)}>
      {children}
    </td>
  )
}

/**
 * TableRow - Single row in table
 */
export function TableRow({ children, isSelected = false, onSelect }) {
  return (
    <tr className={cn('hover:bg-slate-50', isSelected && 'bg-slate-100')}>
      {children}
    </tr>
  )
}

/**
 * OrdersTable - Reusable table for orders
 */
export function OrdersTable({ data = [], columns = [], loading = false }) {
  const [sortBy, setSortBy] = React.useState(null)
  const [sortOrder, setSortOrder] = React.useState('asc')

  const handleSort = (columnId) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnId)
      setSortOrder('asc')
    }
  }

  if (loading) {
    return <div className="rounded-lg bg-white p-8 text-center">Loading...</div>
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-4 text-left">
              <input type="checkbox" className="rounded border-slate-300" />
            </th>
            {columns.map((col) => (
              <TableHeader
                key={col.id}
                onClick={() => col.sortable && handleSort(col.id)}
                sortable={col.sortable}
              >
                {col.label}
              </TableHeader>
            ))}
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="px-6 py-8 text-center text-slate-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <input type="checkbox" className="rounded border-slate-300" />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align}>
                    {col.render ? col.render(row[col.id], row) : row[col.id]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="rounded-lg p-2 hover:bg-slate-100">
                      <Eye className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="rounded-lg p-2 hover:bg-slate-100">
                      <Trash2 className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Pagination - Pagination controls
 */
export function Pagination({ currentPage = 1, totalPages = 10, onPageChange }) {
  const pageNumbers = []
  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    pageNumbers.push(i)
  }
  if (totalPages > 3) {
    pageNumbers.push('...')
    pageNumbers.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
      <div className="text-sm text-slate-600">
        Showing <span className="font-bold text-slate-900">1</span> to
        <span className="font-bold text-slate-900"> 10</span> of
        <span className="font-bold text-slate-900"> 1,240</span> orders
      </div>

      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 hover:bg-white disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageNumbers.map((page, idx) => (
          <button
            key={idx}
            className={cn(
              'h-8 w-8 rounded-lg text-sm font-bold',
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : page === '...'
                ? 'cursor-default'
                : 'hover:bg-white'
            )}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        <button
          className="rounded-lg p-2 hover:bg-white disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
