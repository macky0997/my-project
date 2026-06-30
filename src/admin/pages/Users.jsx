import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Users as UsersIcon, Mail, Shield, CalendarDays, ShoppingBag, Eye, User as UserIcon } from 'lucide-react'
import Modal from '../../components/common/Modal'
import { formatCurrency } from '../../utils/helpers'

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('marimar_users')) || []
  } catch {
    return []
  }
}

const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('marimar_orders')) || []
  } catch {
    return []
  }
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const debounceRef = useRef(null)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    const all = getUsers()
    const orders = getOrders()

    const enriched = all.map((u) => {
      const userOrders = orders.filter(
        (o) => o.email === u.email || o.customerName === u.name
      )
      return {
        ...u,
        orderCount: userOrders.length,
        totalSpent: userOrders.reduce((sum, o) => sum + (o.totalAmount || o.totalPrice || 0), 0),
        recentOrders: userOrders.slice(-5).reverse(),
      }
    })

    let filtered = enriched
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      )
    }
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }

    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    setUsers(filtered)
    setLoading(false)
  }, [searchQuery, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'marimar_users' || e.key === 'marimar_orders') {
        fetchUsers()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fetchUsers])

  const handleViewUser = (u) => {
    setSelectedUser(u)
    setModalOpen(true)
  }

  const roleBadge = (role) => {
    if (role === 'admin') return 'bg-purple-100 text-purple-700'
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage registered accounts</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
        >
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <UsersIcon className="h-14 w-14 text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-1">No users found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 border border-primary-100">
                            <UserIcon className="h-5 w-5 text-primary-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.phone || 'No phone'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-700">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge(u.role)}`}>
                          {u.role?.charAt(0).toUpperCase() + u.role?.slice(1) || 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-600">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric',
                                })
                              : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg">
                            <ShoppingBag className="h-3.5 w-3.5 text-gray-400" />
                            {u.orderCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800 text-right">
                          {formatCurrency(u.totalSpent)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(u)}
                            className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
                            title="View user details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-gray-800">{selectedUser.name}</h3>
                <p className="text-sm text-gray-400">
                  Joined {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${roleBadge(selectedUser.role)}`}>
                    {selectedUser.role?.charAt(0).toUpperCase() + selectedUser.role?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-1.5 p-4 bg-blue-50 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                <p className="text-lg font-bold text-gray-800">{selectedUser.orderCount}</p>
                <p className="text-xs text-gray-400">Orders</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-4 bg-emerald-50 rounded-xl">
                <CalendarDays className="h-5 w-5 text-emerald-500" />
                <p className="text-lg font-bold text-gray-800">
                  {selectedUser.recentOrders?.filter((o) => o.status === 'delivered').length || 0}
                </p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-4 bg-amber-50 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-amber-500" />
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(selectedUser.totalSpent)}
                </p>
                <p className="text-xs text-gray-400">Total Spent</p>
              </div>
            </div>

            {selectedUser.recentOrders?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Recent Orders</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedUser.recentOrders.map((o, i) => (
                    <div key={o.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-800">#{o.id}</p>
                        <p className="text-xs text-gray-400">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-800">
                          {formatCurrency(o.totalAmount || o.totalPrice || 0)}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
