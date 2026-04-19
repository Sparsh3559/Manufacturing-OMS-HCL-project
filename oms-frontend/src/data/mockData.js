/**
 * Mock data for the OMS Dashboard and Orders pages
 */

export const DASHBOARD_KPI_DATA = [
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$45,280',
    trend: '+12%',
    trendType: 'positive',
    icon: null,
  },
  {
    id: 'activeOrders',
    title: 'Active Orders',
    value: '342',
    trend: '+5%',
    trendType: 'positive',
    icon: null,
  },
  {
    id: 'pendingPayments',
    title: 'Pending Payments',
    value: '$8,150',
    trend: '-2.5%',
    trendType: 'negative',
    icon: null,
  },
]

export const DASHBOARD_STATS = [
  {
    label: 'Total Revenue',
    value: '$128,430',
    trend: '+12%',
    trendType: 'positive',
  },
  {
    label: 'Pending Orders',
    value: '42',
    trend: 'Attention Req.',
    trendType: 'warning',
  },
  {
    label: 'Avg. Order Value',
    value: '$312.40',
    trend: 'Stable',
    trendType: 'positive',
  },
  {
    label: 'Refund Rate',
    value: '1.2%',
    trend: '-0.4%',
    trendType: 'positive',
  },
]

export const ORDERS_DATA = [
  {
    id: '#ORD-94210',
    customer: 'Julianne Smith',
    date: 'Oct 24, 2023',
    amount: '$1,429.00',
    status: 'Paid',
  },
  {
    id: '#ORD-94208',
    customer: 'Marcus Thorne',
    date: 'Oct 23, 2023',
    amount: '$420.50',
    status: 'Processing',
  },
  {
    id: '#ORD-94199',
    customer: 'Elara Vance',
    date: 'Oct 22, 2023',
    amount: '$2,890.00',
    status: 'Shipped',
  },
  {
    id: '#ORD-94185',
    customer: 'Bennet Klay',
    date: 'Oct 21, 2023',
    amount: '$120.00',
    status: 'Cancelled',
  },
  {
    id: '#ORD-94174',
    customer: 'Alex Sterling',
    date: 'Oct 20, 2023',
    amount: '$3,450.00',
    status: 'Paid',
  },
  {
    id: '#ORD-94163',
    customer: 'Sarah Johnson',
    date: 'Oct 19, 2023',
    amount: '$890.75',
    status: 'Processing',
  },
  {
    id: '#ORD-94152',
    customer: 'Michael Chen',
    date: 'Oct 18, 2023',
    amount: '$2,145.25',
    status: 'Shipped',
  },
  {
    id: '#ORD-94141',
    customer: 'Emma Rodriguez',
    date: 'Oct 17, 2023',
    amount: '$567.00',
    status: 'Pending',
  },
  {
    id: '#ORD-94130',
    customer: 'David Kim',
    date: 'Oct 16, 2023',
    amount: '$1,234.50',
    status: 'Paid',
  },
  {
    id: '#ORD-94119',
    customer: 'Lisa Anderson',
    date: 'Oct 15, 2023',
    amount: '$3,876.00',
    status: 'Processing',
  },
]

export const RECENT_ACTIVITY = [
  {
    id: 'TRX-8901',
    client: 'Nova Kinetic Ltd',
    amount: '$2,450.00',
    date: 'Oct 24, 2026',
    status: 'Paid',
  },
  {
    id: 'TRX-8902',
    client: 'OmniSystems',
    amount: '$12,100.00',
    date: 'Oct 23, 2026',
    status: 'Pending',
  },
  {
    id: 'TRX-8903',
    client: 'AeroTech Solutions',
    amount: '$890.50',
    date: 'Oct 23, 2026',
    status: 'Paid',
  },
  {
    id: 'TRX-8904',
    client: 'Zephyr Peaks',
    amount: '$4,200.00',
    date: 'Oct 22, 2026',
    status: 'Pending',
  },
  {
    id: 'TRX-8905',
    client: 'Solaris Corp',
    amount: '$1,150.00',
    date: 'Oct 22, 2026',
    status: 'Paid',
  },
]

export const BOM_DATA = [
  {
    id: 'BOM-001',
    material: 'Steel Frame',
    category: 'Raw Materials',
    quantity: 500,
    unit: 'kg',
    status: 'In Stock',
    supplier: 'Steel Suppliers Inc',
  },
  {
    id: 'BOM-002',
    material: 'Aluminum Panels',
    category: 'Components',
    quantity: 250,
    unit: 'pieces',
    status: 'In Stock',
    supplier: 'Aluminum Co.',
  },
  {
    id: 'BOM-003',
    material: 'Electronic Controller',
    category: 'Components',
    quantity: 75,
    unit: 'pieces',
    status: 'Low Stock',
    supplier: 'Tech Electronics',
  },
  {
    id: 'BOM-004',
    material: 'Fasteners Pack',
    category: 'Hardware',
    quantity: 1000,
    unit: 'pieces',
    status: 'In Stock',
    supplier: 'Hardware Plus',
  },
  {
    id: 'BOM-005',
    material: 'Rubber Seals',
    category: 'Consumables',
    quantity: 30,
    unit: 'packs',
    status: 'Critical',
    supplier: 'Seal Manufacturers',
  },
]

export const USERS_DATA = [
  {
    id: 'user-1',
    name: 'Elena Rodriguez',
    title: 'Design Lead',
    email: 'elena.r@monolith.erp',
    role: 'admin',
    status: 'active',
    lastLogin: '2 mins ago',
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    title: 'Product Manager',
    email: 'm.chen@monolith.erp',
    role: 'editor',
    status: 'active',
    lastLogin: '14 hours ago',
  },
  {
    id: 'user-3',
    name: 'Sarah Kaine',
    title: 'Finance Analyst',
    email: 'kaine.s@monolith.erp',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '3 days ago',
  },
  {
    id: 'user-4',
    name: 'David Vance',
    title: 'Fullstack Engineer',
    email: 'vance.d@monolith.erp',
    role: 'editor',
    status: 'active',
    lastLogin: 'Just now',
  },
  {
    id: 'user-5',
    name: 'Lisa Anderson',
    title: 'Marketing Manager',
    email: 'anderson.l@monolith.erp',
    role: 'editor',
    status: 'active',
    lastLogin: '1 hour ago',
  },
  {
    id: 'user-6',
    name: 'James Wright',
    title: 'QA Engineer',
    email: 'wright.j@monolith.erp',
    role: 'viewer',
    status: 'active',
    lastLogin: '30 mins ago',
  },
  {
    id: 'user-7',
    name: 'Michelle Lee',
    title: 'DevOps Engineer',
    email: 'lee.m@monolith.erp',
    role: 'editor',
    status: 'active',
    lastLogin: '45 mins ago',
  },
  {
    id: 'user-8',
    name: 'Robert Taylor',
    title: 'Backend Developer',
    email: 'taylor.r@monolith.erp',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2 days ago',
  },
]

export const USER_STATS = [
  {
    label: 'Total Users',
    value: '1,248',
    trend: '+23%',
    trendType: 'positive',
  },
  {
    label: 'Active Now',
    value: '412',
    trend: 'Online',
  },
  {
    label: 'Admin Seats',
    value: '24 / 50',
    trend: '48% Used',
  },
  {
    label: 'Pending Invites',
    value: '18',
    trend: 'Awaiting',
  },
]
