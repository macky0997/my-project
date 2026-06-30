import { useState } from 'react'
import {
  User, CalendarDays, Banknote, MapPin, Phone, Mail,
  MessageSquare, CreditCard, Check, X, Package, Truck,
} from 'lucide-react'
import Modal from '../common/Modal'
import { formatCurrency, getStatusColor } from '../../utils/helpers'

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

const statusIcons = {
  pending: Package,
  confirmed: Check,
  preparing: Package,
  ready: Truck,
  delivered: Truck,
  cancelled: X,
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Processing',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false)

  if (!order) return null

  const currentIndex = STATUS_FLOW.indexOf(order.status)
  const nextStatus = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIndex + 1]
    : null

  const canCancel = order.status !== 'delivered' && order.status !== 'cancelled'
  const canProceed = nextStatus !== null && order.status !== 'cancelled'

  const handleProceed = async () => {
    if (!nextStatus) return
    setUpdating(true)
    try {
      await onUpdateStatus(order.id, nextStatus)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    setUpdating(true)
    try {
      await onUpdateStatus(order.id, 'cancelled')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.orderNumber || `ORD-${String(order.id).padStart(5, '0')}`}`} size="lg">
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
            {order.status && statusIcons[order.status]
              ? (() => { const Icon = statusIcons[order.status]; return <Icon className="h-4 w-4" /> })()
              : null}
            {statusLabels[order.status] || order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Customer</p>
              <p className="text-sm font-medium text-gray-800">{order.customerName || order.user?.name || order.fullName || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <CalendarDays className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Date Ordered</p>
              <p className="text-sm font-medium text-gray-800">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Banknote className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Total Amount</p>
              <p className="text-sm font-semibold text-gray-800">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Payment</p>
              <p className="text-sm font-medium text-gray-800">
                {order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {(order.email || order.phone || order.address) && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Customer Details</h3>
            <div className="space-y-2">
              {order.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{order.email}</span>
                </div>
              )}
              {order.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{order.phone}</span>
                </div>
              )}
              {order.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{order.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {order.notes && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Order Notes</h3>
            <div className="flex items-start gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="text-gray-600">{order.notes}</span>
            </div>
          </div>
        )}

        {order.items?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Order Items ({order.items.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {order.items.map((item, i) => (
                <div key={item.id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Update Status</h3>
            <div className="flex items-center gap-3">
              {STATUS_FLOW.slice(currentIndex + 1).map((status) => {
                const Icon = statusIcons[status]
                const label = statusLabels[status]
                return (
                  <button
                    key={status}
                    onClick={() => handleProceed()}
                    disabled={updating || status !== nextStatus}
                    className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3 pt-2">
              {canProceed && (
                <button
                  onClick={handleProceed}
                  disabled={updating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Mark as {statusLabels[nextStatus]}
                    </>
                  )}
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}