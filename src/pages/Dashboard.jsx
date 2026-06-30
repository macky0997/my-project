import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, ClipboardList, User, LogOut,
  Menu, Bell, Star, ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useDashboard'
import { formatCurrency } from '../utils/helpers'
import { SITE_NAME } from '../utils/constants'

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/shop', icon: Package },
  { label: 'Cart', path: '/cart', icon: ShoppingCart },
  { label: 'Orders', path: '/profile', icon: ClipboardList },
  { label: 'Profile', path: '/profile', icon: User },
]

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

export default function Dashboard() {
  const { sidebarOpen, closeSidebar, openSidebar, stats, recentOrders, featuredProducts, quickActions } = useDashboard()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-64 bg-white/90 backdrop-blur-xl border-r border-white/20 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center h-16 lg:h-20 px-6 border-b border-gray-100">
          <Link to="/" className="text-xl font-heading font-bold text-gradient">
            {SITE_NAME}
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive(link.path)
                    ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'}
                `}
              >
                <Icon className={`h-5 w-5 ${isActive(link.path) ? 'text-primary-500' : 'text-gray-400'}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={openSidebar} className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-primary-500 transition-colors">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                <p className="text-xs text-gray-400">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-primary-500 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-premium p-5 lg:p-6 hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/5 to-transparent rounded-full -mr-10 -mt-10" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 lg:p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                        <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.iconColor}`} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trendColor} shadow-sm`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="grid xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-premium p-5 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <Link to="/profile" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors">
                    View All <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="overflow-x-auto -mx-5 lg:-mx-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="text-left pb-3 px-5 lg:px-6 font-medium">Order</th>
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
                          custom={i}
                          variants={stagger}
                          initial="initial"
                          animate="animate"
                          className="group hover:bg-white/60 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-5 lg:px-6 text-sm font-medium text-gray-800">{order.id}</td>
                          <td className="py-3.5 text-sm text-gray-600">{order.customer}</td>
                          <td className="py-3.5 text-sm text-gray-400 hidden md:table-cell">{order.date}</td>
                          <td className="py-3.5">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.statusColor} shadow-sm`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 lg:px-6 text-sm font-semibold text-gray-800 text-right">{order.total}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-premium p-5 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Featured Products</h3>
                  <Link to="/shop" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors">
                    View All <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {featuredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      custom={i}
                      variants={stagger}
                      initial="initial"
                      animate="animate"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                            <span className="text-xs text-gray-500">{product.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">({product.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-800">{formatCurrency(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-premium p-5 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {quickActions.map((action, i) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.label}
                      custom={i}
                      variants={stagger}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-3 p-4 lg:p-5 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className={`p-2.5 lg:p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${action.iconColor}`} />
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-gray-700">{action.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
