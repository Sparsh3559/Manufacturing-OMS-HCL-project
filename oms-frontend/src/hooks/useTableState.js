import { useState, useCallback } from 'react'

/**
 * Hook to manage table state (sorting, pagination, selection)
 */
export function useTableState(initialData = []) {
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleSort = useCallback((columnId) => {
    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnId)
      setSortOrder('asc')
    }
  }, [sortBy, sortOrder])

  const handleSelectRow = useCallback((rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedRows(new Set(initialData.map((_, i) => i)))
    } else {
      setSelectedRows(new Set())
    }
  }, [initialData])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.max(1, page))
  }, [])

  const paginatedData = initialData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(initialData.length / itemsPerPage)

  return {
    sortBy,
    sortOrder,
    selectedRows,
    currentPage,
    totalPages,
    paginatedData,
    handleSort,
    handleSelectRow,
    handleSelectAll,
    handlePageChange,
  }
}

/**
 * Hook to manage filter state
 */
export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters)

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return {
    filters,
    handleFilterChange,
    handleReset,
  }
}

/**
 * Hook to manage pagination state separately
 */
export function usePagination(totalItems, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }, [totalPages])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
  }
}
