/**
 * Icon mapping from Figma design to Lucide React icons
 * Maps icon functionality to appropriate Lucide icon components
 */

import {
  Search,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Layers3,
  Users,
  Filter,
  Download,
  Plus,
  Eye,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Menu,
  X,
} from 'lucide-react'

/**
 * Navigation icons
 */
export const NAV_ICONS = {
  dashboard: LayoutDashboard,
  orders: ShoppingCart,
  bom: Layers3,
  users: Users,
}

/**
 * Action icons
 */
export const ACTION_ICONS = {
  search: Search,
  notification: Bell,
  settings: Settings,
  logout: LogOut,
  filter: Filter,
  download: Download,
  export: Download,
  add: Plus,
  create: Plus,
  view: Eye,
  delete: Trash2,
  edit: Eye,
  moreOptions: MoreVertical,
  menu: Menu,
  close: X,
}

/**
 * Directional icons
 */
export const DIRECTION_ICONS = {
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
  up: ArrowUp,
}

/**
 * Trend icons
 */
export const TREND_ICONS = {
  up: ArrowUp,
  down: ArrowDown,
}

/**
 * Get icon component by name
 * @param {string} name - Icon name
 * @returns {React.ComponentType} Icon component from Lucide
 */
export function getIcon(name) {
  return (
    ACTION_ICONS[name] ||
    NAV_ICONS[name] ||
    DIRECTION_ICONS[name] ||
    TREND_ICONS[name] ||
    Search
  )
}
