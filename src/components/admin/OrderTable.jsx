import { motion } from 'framer-motion'
import { ShoppingCart, Eye, ChevronLeft, ChevronRight, CalendarDays, User, Banknote } from 'lucide-react'
import { formatCurrency, getStatusColor } from '../../utils/helpers'

export default function OrderTable({
  orders,
  loading,
  onView,
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <ShoppingCart className="h-14 w-14 text-gray-200 mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 mb-1">No orders found</h3>
        <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="group hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 border border-primary-100">
                        <ShoppingCart className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          #{order.orderNumber || `ORD-${String(order.id).padStart(5, '0')}`}
                        </p>
                        <p className="text-xs text-gray-400">{order.items?.length || 0} item(s)</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-700">{order.customerName || order.user?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-300" />
                      <span className="text-sm text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        }) : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-gray-300" />
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(order)}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
                        title="View order details"
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

      <div className="md:hidden space-y-3">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100">
                  <ShoppingCart className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    #{order.orderNumber || `ORD-${String(order.id).padStart(5, '0')}`}
                  </p>
                  <p className="text-xs text-gray-400">{order.items?.length || 0} item(s)</p>
                </div>
              </div>
              <button
                onClick={() => onView(order)}
                className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-gray-300" />
                <span className="text-gray-700">{order.customerName || order.user?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-gray-300" />
                <span className="text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  }) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote className="h-3.5 w-3.5 text-gray-300" />
                <span className="font-semibold text-gray-800">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true
                if (page === 1 || page === totalPages) return true
                if (page >= currentPage - 1 && page <= currentPage + 1) return true
                return false
              })
              .map((page, idx, arr) => {
                const showEllipsis = idx > 0 && page - arr[idx - 1] > 1
                return (
                  <span key={page} className="flex items-center">
                    {showEllipsis && <span className="px-1 text-gray-300 text-sm">...</span>}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                )
              })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-50"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}