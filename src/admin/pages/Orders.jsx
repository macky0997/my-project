import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ShoppingBag, Gift, ArrowUpRight } from 'lucide-react'
import Swal from 'sweetalert2'
import { orderService } from '../../services/orderService'
import OrderTable from '../../components/admin/OrderTable'
import OrderDetailsModal from '../../components/admin/OrderDetailsModal'
import { formatCurrency } from '../../utils/helpers'

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

const getPendingCount = (orders) => orders.filter((o) => o.status === 'pending').length

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
  const [pendingCount, setPendingCount] = useState(0)
  const [newOrderAlert, setNewOrderAlert] = useState(false)
  const [newOrderDetails, setNewOrderDetails] = useState(null)
  const debounceRef = useRef(null)
  const prevOrdersRef = useRef([])
  const ITEMS_PER_PAGE = 10

  const processLocalOrders = useCallback((localOrders) => {
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
  }, [currentPage, searchQuery, statusFilter])

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
        setLoading(false)
        return
      }
    } catch {
    }

    const localOrders = getLocalOrders()
    processLocalOrders(localOrders)
    setLoading(false)
  }, [currentPage, searchQuery, statusFilter, processLocalOrders])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'marimar_orders') {
        fetchOrders()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fetchOrders])

  useEffect(() => {
    const localOrders = getLocalOrders()
    prevOrdersRef.current = localOrders
    setPendingCount(getPendingCount(localOrders))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const localOrders = getLocalOrders()
      const prev = prevOrdersRef.current

      if (localOrders.length !== prev.length) {
        const count = localOrders.length - prev.length

        if (count > 0) {
          const newOnes = localOrders.slice(0, count).reverse()
          const newest = newOnes[newOnes.length - 1]
          setNewOrderDetails(newest)
          setNewOrderAlert(true)
          setTimeout(() => setNewOrderAlert(false), 6000)

          Swal.fire({
            icon: 'success',
            title: 'New Order!',
            text: `${newest?.customerName || 'A customer'} placed an order worth ${formatCurrency(newest?.totalAmount || 0)}`,
            timer: 4000,
            showConfirmButton: true,
            confirmButtonText: 'View',
            confirmButtonColor: '#ec4899',
            toast: true,
            position: 'top-end',
            customClass: { popup: 'rounded-xl shadow-premium-lg' },
          })
        }

        fetchOrders()
      }

      setPendingCount(getPendingCount(localOrders))
      prevOrdersRef.current = localOrders
    }, 3000)

    return () => clearInterval(interval)
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
      <AnimatePresence>
        {newOrderAlert && newOrderDetails && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-5 flex items-center gap-4 shadow-xl shadow-primary-500/20"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white animate-bounce" />
                <p className="text-white font-semibold">New Order Received!</p>
              </div>
              <p className="text-white/80 text-sm mt-1">
                <strong>{newOrderDetails.customerName || 'A customer'}</strong> &middot;{' '}
                {formatCurrency(newOrderDetails.totalAmount || 0)}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {newOrderDetails.items?.length || 0} item(s) &middot;{' '}
                {newOrderDetails.paymentMethod
                  ? newOrderDetails.paymentMethod.charAt(0).toUpperCase() + newOrderDetails.paymentMethod.slice(1)
                  : 'N/A'}
              </p>
            </div>
            <button
              onClick={() => {
                handleViewOrder(newOrderDetails)
                setNewOrderAlert(false)
              }}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all whitespace-nowrap"
            >
              View Details <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Orders</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                <ShoppingBag className="h-3.5 w-3.5" />
                {pendingCount} pending
              </span>
            )}
          </div>
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
