/**
 * Application constants and configurations
 */

export const ORDER_STATUS_OPTIONS = [
  { id: 'all', label: 'All Statuses' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'cancelled', label: 'Cancelled' },
]

export const DATE_RANGE_OPTIONS = [
  { id: 'last30', label: 'Last 30 Days' },
  { id: 'last60', label: 'Last 60 Days' },
  { id: 'last90', label: 'Last 90 Days' },
  { id: 'thisYear', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
]

export const REGION_OPTIONS = [
  { id: 'north-america', label: 'North America' },
  { id: 'south-america', label: 'South America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' },
  { id: 'africa', label: 'Africa' },
  { id: 'oceania', label: 'Oceania' },
]

export const INVENTORY_STATUS_OPTIONS = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'low-stock', label: 'Low Stock' },
  { id: 'critical', label: 'Critical' },
  { id: 'out-of-stock', label: 'Out of Stock' },
]

/**
 * Status badge color mapping
 */
export const STATUS_BADGE_VARIANTS = {
  paid: 'paid',
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  cancelled: 'cancelled',
  'in-stock': 'default',
  'low-stock': 'pending',
  'critical': 'cancelled',
  'out-of-stock': 'cancelled',
}

/**
 * Table column definitions for orders
 */
export const ORDERS_TABLE_COLUMNS = [
  { id: 'id', label: 'Order ID', sortable: true, align: 'left' },
  { id: 'customer', label: 'Customer', sortable: true, align: 'left' },
  { id: 'date', label: 'Date', sortable: true, align: 'left' },
  { id: 'amount', label: 'Total Amount', sortable: true, align: 'right' },
  { id: 'status', label: 'Status', sortable: true, align: 'left' },
]

/**
 * Table column definitions for BOM
 */
export const BOM_TABLE_COLUMNS = [
  { id: 'id', label: 'Material ID', sortable: true, align: 'left' },
  { id: 'material', label: 'Material', sortable: true, align: 'left' },
  { id: 'category', label: 'Category', sortable: true, align: 'left' },
  { id: 'quantity', label: 'Quantity', sortable: true, align: 'right' },
  { id: 'unit', label: 'Unit', sortable: false, align: 'left' },
  { id: 'status', label: 'Status', sortable: true, align: 'left' },
]

/**
 * Routes configuration
 */
export const ROUTES = {
  DASHBOARD: '/',
  ORDERS: '/orders',
  BOM: '/bom',
  USERS: '/users',
}
