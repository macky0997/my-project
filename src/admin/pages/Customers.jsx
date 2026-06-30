import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { customerService } from '../../services/customerService'
import CustomerStatistics from '../../components/admin/CustomerStatistics'
import CustomerTable from '../../components/admin/CustomerTable'
import CustomerProfileModal from '../../components/admin/CustomerProfileModal'

const getLocalCustomers = () => {
  try {
    const orders = JSON.parse(localStorage.getItem('marimar_orders') || '[]')
    const registeredUsers = JSON.parse(localStorage.getItem('marimar_users') || '[]')

    const userMap = {}

    registeredUsers.forEach((u) => {
      if (u.role === 'customer') {
        userMap[u.email] = {
          id: u.email,
          firstName: (u.name || 'Unknown').split(' ')[0] || 'Unknown',
          lastName: (u.name || '').split(' ').slice(1).join(' ') || 'Customer',
          email: u.email,
          phone: u.phone || '',
          address: u.address || '',
          createdAt: u.createdAt || new Date().toISOString(),
          totalOrders: 0,
          completedOrders: 0,
          totalSpent: 0,
          recentOrders: [],
        }
      }
    })

    orders.forEach((order) => {
      const email = order.email || order.user?.email
      if (!email) return
      if (!userMap[email]) {
        userMap[email] = {
          id: email,
          firstName: (order.customerName || order.fullName || order.user?.name || 'Unknown').split(' ')[0] || 'Unknown',
          lastName: (order.customerName || order.fullName || order.user?.name || '').split(' ').slice(1).join(' ') || 'Customer',
          email,
          phone: order.phone || '',
          address: order.address || '',
          createdAt: order.createdAt || new Date().toISOString(),
          totalOrders: 0,
          completedOrders: 0,
          totalSpent: 0,
          recentOrders: [],
        }
      }
      userMap[email].totalOrders += 1
      userMap[email].totalSpent += order.totalAmount || order.totalPrice || 0
      if (order.status === 'delivered') userMap[email].completedOrders += 1
      userMap[email].recentOrders.push(order)
    })

    Object.values(userMap).forEach((u) => {
      u.recentOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      u.recentOrders = u.recentOrders.slice(0, 5)
    })

    return Object.values(userMap)
  } catch {
    return []
  }
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [allCustomers, setAllCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [statistics, setStatistics] = useState(null)
  const debounceRef = useRef(null)
  const ITEMS_PER_PAGE = 10

  const computeStatistics = useCallback((data) => {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return {
      totalCustomers: data.length,
      newThisMonth: data.filter((c) => new Date(c.createdAt) >= firstOfMonth).length,
      activeCustomers: data.filter((c) => c.totalOrders > 0).length,
      totalOrders: data.reduce((sum, c) => sum + (c.totalOrders || 0), 0),
    }
  }, [])

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page: currentPage, limit: ITEMS_PER_PAGE }
      if (searchQuery) params.search = searchQuery
      const response = await customerService.getAll(params)
      const data = response.data
      const fetched = data.customers || data.data || data || []
      if (Array.isArray(fetched) && fetched.length > 0) {
        setCustomers(fetched)
        setTotalPages(data.totalPages || data.total_pages || 1)
        setStatistics(data.statistics || computeStatistics(fetched))
        setAllCustomers(fetched)
        setLoading(false)
        return
      }
    } catch {
    }

    const localCustomers = getLocalCustomers()
    setAllCustomers(localCustomers)
    setStatistics(computeStatistics(localCustomers))

    let filtered = localCustomers
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q)
      )
    }

    const total = filtered.length
    setTotalPages(Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)))
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    setCustomers(filtered.slice(start, start + ITEMS_PER_PAGE))
    setLoading(false)
  }, [currentPage, searchQuery, computeStatistics])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'marimar_orders' || e.key === 'marimar_users') {
        fetchCustomers()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fetchCustomers])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  const handleViewCustomer = (customer) => {
    const full = allCustomers.find((c) => c.id === customer.id)
    setSelectedCustomer(full || customer)
    setModalOpen(true)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">View and manage customer information</p>
        </div>
      </motion.div>

      <CustomerStatistics statistics={statistics} />

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
            placeholder="Search by name, email, or contact number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CustomerTable
          customers={customers}
          loading={loading}
          onView={handleViewCustomer}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </motion.div>

      <CustomerProfileModal
        customer={selectedCustomer}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
