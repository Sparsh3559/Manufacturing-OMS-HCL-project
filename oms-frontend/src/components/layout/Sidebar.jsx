import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Layers, Users,
  FileText, CreditCard, TrendingUp, Package,
  Settings, HelpCircle, LogOut, Zap
} from 'lucide-react'

// Exact mapping from your screenshot table
const NAV_BY_ROLE = {
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'BOM', path: '/bom', icon: Layers },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: Package },
    { label: 'Invoices', path: '/invoices', icon: FileText },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Reports', path: '/reports', icon: TrendingUp },
    { label: 'User Management', path: '/users', icon: Users },
  ],
  SALES: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
  ],
  PRODUCTION: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'BOM', path: '/bom', icon: Layers },
  ],
  PURCHASE: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'BOM', path: '/bom', icon: Layers },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: Package },
  ],
  FINANCE: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'Invoices', path: '/invoices', icon: FileText },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Reports', path: '/reports', icon: TrendingUp },
  ],
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || ''
  const name = localStorage.getItem('name') || 'User'

  const navItems = NAV_BY_ROLE[role] || []

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col px-4 py-6 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-lg leading-tight">Monolith OMS</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Enterprise Suite</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-semibold border-r-2 border-indigo-600'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 pt-4 flex flex-col gap-1 mt-4">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-bold text-slate-900 truncate">{name}</p>
          <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">{role}</p>
        </div>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 font-medium w-full text-left">
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 font-medium w-full text-left">
          <HelpCircle className="w-[18px] h-[18px]" />
          Support
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium w-full text-left mt-1"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  )
}