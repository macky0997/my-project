import { createContext, useState, useCallback, useMemo } from 'react'
import { products } from '../data/products'
import { formatCurrency } from '../utils/helpers'
import {
  TrendingUp, Clock, CheckCircle, ShoppingCart,
  BarChart3, Tags, Download, Plus,
} from 'lucide-react'

export const DashboardContext = createContext(null)

const mockOrders = [
  { id: 'MAR-A2B3C4', customer: 'Maria Santos', date: 'Jun 24, 2026', status: 'Pending', statusColor: 'bg-yellow-100 text-yellow-800', total: formatCurrency(1200) },
  { id: 'MAR-D5E6F7', customer: 'Juan Cruz', date: 'Jun 23, 2026', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', total: formatCurrency(2450) },
  { id: 'MAR-G8H9I0', customer: 'Ana Reyes', date: 'Jun 22, 2026', status: 'Preparing', statusColor: 'bg-purple-100 text-purple-800', total: formatCurrency(850) },
  { id: 'MAR-J1K2L3', customer: 'Pedro Garcia', date: 'Jun 21, 2026', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800', total: formatCurrency(3200) },
  { id: 'MAR-M4N5O6', customer: 'Lisa Tan', date: 'Jun 20, 2026', status: 'Confirmed', statusColor: 'bg-blue-100 text-blue-800', total: formatCurrency(680) },
]

const statCards = [
  { label: 'Total Orders', value: '156', icon: TrendingUp, trend: '+12%', trendColor: 'bg-green-100 text-green-700', bgColor: 'bg-primary-100', iconColor: 'text-primary-600' },
  { label: 'Pending Orders', value: '23', icon: Clock, trend: '+3', trendColor: 'bg-yellow-100 text-yellow-700', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { label: 'Completed Orders', value: '118', icon: CheckCircle, trend: '+8%', trendColor: 'bg-emerald-100 text-emerald-700', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'Cart Items', value: '12', icon: ShoppingCart, trend: '+5', trendColor: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
]

const quickActions = [
  { label: 'Add Product', icon: Plus, bgColor: 'bg-primary-100', iconColor: 'text-primary-600' },
  { label: 'View Reports', icon: BarChart3, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { label: 'Manage Categories', icon: Tags, bgColor: 'bg-gold-100', iconColor: 'text-gold-600' },
  { label: 'Export Data', icon: Download, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
]

export function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const openSidebar = useCallback(() => setSidebarOpen(true), [])

  const stats = useMemo(() => statCards, [])

  const recentOrders = useMemo(() => mockOrders, [])

  const featuredProducts = useMemo(() => products.slice(0, 4), [])

  const actions = useMemo(() => quickActions, [])

  return (
    <DashboardContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        stats,
        recentOrders,
        featuredProducts,
        quickActions: actions,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
