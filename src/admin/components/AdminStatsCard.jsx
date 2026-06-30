import { motion } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function AdminStatsCard({ stat }) {
  const Icon = stat.icon

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative p-4 lg:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${stat.iconBg} shadow-md shadow-black/5`}>
            <Icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
          <span
            className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'} px-2 py-0.5 rounded-full`}
          >
            {stat.trend}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-0.5">{stat.value}</p>
        <p className="text-sm text-gray-500">{stat.label}</p>
      </div>
    </motion.div>
  )
}
