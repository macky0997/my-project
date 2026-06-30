import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Swal from 'sweetalert2'
import { orderService } from '../../services/orderService'
import OrderTable from '../../components/admin/OrderTable'
import OrderDetailsModal from '../../components/admin/OrderDetailsModal'

const STATUS_OPTIONS = [
  { id: '', label: 'All Statuses' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Processing' },
  { id: 'ready', label: 'Ready for Pickup' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

const getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('marimar_orders') || '[]')
  } catch {
    return []
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const debounceRef = useRef(null)
  const ITEMS_PER_PAGE = 10

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page: currentPage, limit: ITEMS_PER_PAGE }
      if (searchQuery) params.search = searchQuery
      if (statusFilter) params.status = statusFilter
      const response = await orderService.getAll(params)
      const data = response.data
      const fetchedOrders = data.orders || data.data || data || []
      if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
        setOrders(fetchedOrders)
        setTotalPages(data.totalPages || data.total_pages || 1)
        return
      }
    } catch {
      // fallback to localStorage
    }

    const localOrders = getLocalOrders()
    let filtered = localOrders

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((o) =>
        (o.orderNumber || '').toLowerCase().includes(q) ||
        (o.customerName || o.fullName || '').toLowerCase().includes(q)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

    const total = filtered.length
    setTotalPages(Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)))
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    setOrders(filtered.slice(start, start + ITEMS_PER_PAGE))
    setLoading(false)
  }, [currentPage, searchQuery, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus)
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Order has been ${newStatus === 'cancelled' ? 'cancelled' : 'updated'} successfully.`,
        timer: 1500,
        showConfirmButton: false,
      })
      setModalOpen(false)
      fetchOrders()
      return true
    } catch {
      const localOrders = getLocalOrders()
      const idx = localOrders.findIndex((o) => o.id === orderId || o.orderNumber === orderId)
      if (idx !== -1) {
        localOrders[idx].status = newStatus
        localStorage.setItem('marimar_orders', JSON.stringify(localOrders))
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Order has been ${newStatus === 'cancelled' ? 'cancelled' : 'updated'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        })
        setModalOpen(false)
        fetchOrders()
        return true
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update order status.',
      })
      return false
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and track customer orders</p>
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
            placeholder="Search by order number or customer name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <OrderTable
          orders={orders}
          loading={loading}
          onView={handleViewOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </motion.div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}