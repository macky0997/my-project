import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Package, ShoppingCart, Clock, CheckCircle, Users, TrendingUp,
  ArrowUpRight, DollarSign, Plus, BarChart3, Tags, Download,
  MoreHorizontal, ChevronRight,
} from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'

const statCards = [
  {
    label: 'Total Products',
    value: '248',
    icon: Package,
    trend: '+12 this month',
    trendUp: true,
    bgColor: 'from-primary-500/20 to-primary-600/10',
    iconBg: 'bg-primary-500',
    iconColor: 'text-white',
  },
  {
    label: 'Total Orders',
    value: '1,482',
    icon: ShoppingCart,
    trend: '+8.2% vs last month',
    trendUp: true,
    bgColor: 'from-blue-500/20 to-blue-600/10',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
  },
  {
    label: 'Pending Orders',
    value: '43',
    icon: Clock,
    trend: '+5 new today',
    trendUp: false,
    bgColor: 'from-amber-500/20 to-amber-600/10',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
  },
  {
    label: 'Completed Orders',
    value: '1,284',
    icon: CheckCircle,
    trend: '+94.5% completion rate',
    trendUp: true,
    bgColor: 'from-emerald-500/20 to-emerald-600/10',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
  },
  {
    label: 'Total Customers',
    value: '856',
    icon: Users,
    trend: '+24 this week',
    trendUp: true,
    bgColor: 'from-purple-500/20 to-purple-600/10',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
  },
  {
    label: 'Total Revenue',
    value: formatCurrency(584200),
    icon: DollarSign,
    trend: '+15.3% growth',
    trendUp: true,
    bgColor: 'from-rose-500/20 to-rose-600/10',
    iconBg: 'bg-rose-500',
    iconColor: 'text-white',
  },
]

const recentOrders = [
  { id: 'MAR-2024-001', customer: 'Maria Santos', items: 3, total: formatCurrency(2450), status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700', date: 'Jun 24, 2026' },
  { id: 'MAR-2024-002', customer: 'Juan Cruz', items: 1, total: formatCurrency(850), status: 'Processing', statusColor: 'bg-blue-100 text-blue-700', date: 'Jun 24, 2026' },
  { id: 'MAR-2024-003', customer: 'Ana Reyes', items: 5, total: formatCurrency(4200), status: 'Pending', statusColor: 'bg-amber-100 text-amber-700', date: 'Jun 23, 2026' },
  { id: 'MAR-2024-004', customer: 'Pedro Garcia', items: 2, total: formatCurrency(1680), status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-700', date: 'Jun 23, 2026' },
  { id: 'MAR-2024-005', customer: 'Lisa Tan', items: 4, total: formatCurrency(3200), status: 'Confirmed', statusColor: 'bg-purple-100 text-purple-700', date: 'Jun 22, 2026' },
]

const topProducts = [
  { name: 'Chocolate Dream Cake', sales: 342, revenue: formatCurrency(273600), growth: '+12%' },
  { name: 'Strawberry Cupcakes', sales: 289, revenue: formatCurrency(86700), growth: '+8%' },
  { name: 'Christmas Cookies Set', sales: 198, revenue: formatCurrency(59400), growth: '+23%' },
  { name: 'Mixed Pastry Box', sales: 167, revenue: formatCurrency(66800), growth: '+5%' },
  { name: 'Custom Birthday Cake', sales: 145, revenue: formatCurrency(217500), growth: '+18%' },
]

const weeklyData = [
  { day: 'Mon', orders: 28, revenue: 42000 },
  { day: 'Tue', orders: 35, revenue: 52500 },
  { day: 'Wed', orders: 42, revenue: 63000 },
  { day: 'Thu', orders: 38, revenue: 57000 },
  { day: 'Fri', revenue: 78500, orders: 52 },
  { day: 'Sat', orders: 65, revenue: 97500 },
  { day: 'Sun', orders: 48, revenue: 72000 },
]

const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function AdminDashboard() {
  const stats = useMemo(() => statCards, [])

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative p-4 lg:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.iconBg} shadow-md shadow-black/5`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'} px-2 py-0.5 rounded-full`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-0.5">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid lg:grid-cols-7 gap-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-800">Weekly Revenue Overview</h3>
              <p className="text-sm text-gray-400 mt-0.5">Total revenue for this week</p>
            </div>
            <button className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors">
              View Report <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-end gap-2 lg:gap-3 h-48 lg:h-56">
            {weeklyData.map((day) => {
              const height = (day.revenue / maxRevenue) * 100
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    {formatCurrency(day.revenue)}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-primary-500 to-secondary-400 rounded-lg cursor-pointer hover:from-primary-600 hover:to-secondary-500 transition-all relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                      {day.orders} orders
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-500 font-medium mt-1">{day.day}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-800">Top Products</h3>
              <p className="text-sm text-gray-400 mt-0.5">Best selling items</p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, i) => {
              const maxSales = topProducts[0].sales
              const barWidth = (product.sales / maxSales) * 100
              return (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-gray-400 w-4">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-sm font-medium text-gray-700 truncate group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{product.growth}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right">{product.sales} sold</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-800">Recent Orders</h3>
              <p className="text-sm text-gray-400 mt-0.5">Latest transactions</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-5 lg:-mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="text-left pb-3 px-5 lg:px-6 font-medium">Order ID</th>
                  <th className="text-left pb-3 font-medium">Customer</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-right pb-3 px-5 lg:px-6 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5 lg:px-6 text-sm font-medium text-gray-800">{order.id}</td>
                    <td className="py-3.5 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3.5 text-sm text-gray-400 hidden md:table-cell">{order.date}</td>
                    <td className="py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 lg:px-6 text-sm font-semibold text-gray-800 text-right">{order.total}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-800">Quick Actions</h3>
              <p className="text-sm text-gray-400 mt-0.5">Manage your store</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product', icon: Plus, color: 'from-primary-500 to-secondary-500', shadow: 'shadow-primary-500/20' },
              { label: 'View Reports', icon: BarChart3, color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
              { label: 'Categories', icon: Tags, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
              { label: 'Export Data', icon: Download, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${action.color} ${action.shadow} shadow-lg text-white hover:shadow-xl transition-all`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-semibold">{action.label}</span>
                </motion.button>
              )
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-semibold">Period Summary</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="font-semibold">{formatCurrency(184200)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Month</span>
                <span className="font-semibold">{formatCurrency(159800)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between">
                <span className="text-emerald-400">Growth</span>
                <span className="font-semibold text-emerald-400">+15.3%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
