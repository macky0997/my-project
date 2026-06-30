import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
}

export default function AdminNavbar({ onMenuToggle }) {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const title = Object.entries(pageTitles).reduce((acc, [path, label]) => {
    if (location.pathname === path) return label
    if (location.pathname.startsWith(path) && path !== '/admin') return label
    return acc
  }, 'Dashboard')

  const segment = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = segment.map((s, i) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    path: '/' + segment.slice(0, i + 1).join('/'),
  }))

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg lg:text-xl font-heading font-bold text-gray-800"
            >
              {title}
            </motion.h1>
            {breadcrumbs.length > 1 && (
              <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.path} className="flex items-center gap-1.5">
                    {i > 0 && <span>/</span>}
                    <span className={i === breadcrumbs.length - 1 ? 'text-gray-600 font-medium' : ''}>
                      {crumb.label.replace('Admin', '')}
                    </span>
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-400 gap-2">
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="hidden lg:inline-flex text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-400">
              Ctrl+K
            </kbd>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-all"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="relative p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-gray-200">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
