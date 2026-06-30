import { motion } from 'framer-motion'
import { Users, UserPlus, ShoppingBag, TrendingUp } from 'lucide-react'

const stats = [
  {
    label: 'Total Customers',
    value: null,
    icon: Users,
    color: 'bg-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: 'New This Month',
    value: null,
    icon: UserPlus,
    color: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    label: 'Active Customers',
    value: null,
    icon: TrendingUp,
    color: 'bg-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    label: 'Total Orders',
    value: null,
    icon: ShoppingBag,
    color: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
]

export default function CustomerStatistics({ statistics }) {
  const data = statistics || {
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
    totalOrders: 0,
  }

  const enrichedStats = [
    { ...stats[0], value: data.totalCustomers },
    { ...stats[1], value: data.newThisMonth },
    { ...stats[2], value: data.activeCustomers },
    { ...stats[3], value: data.totalOrders },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {enrichedStats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value?.toLocaleString() ?? '—'}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.text}`} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
