import {
  User, Mail, Phone, MapPin, CalendarDays, ShoppingBag, Package,
  CheckCircle, XCircle,
} from 'lucide-react'
import Modal from '../common/Modal'
import { formatCurrency } from '../../utils/helpers'

export default function CustomerProfileModal({ customer, isOpen, onClose }) {
  if (!customer) return null

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A'
  const joinDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : 'N/A'

  const recentOrders = customer.recentOrders || []

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Profile" size="lg">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">{fullName}</h3>
            <p className="text-sm text-gray-400">Customer since {joinDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800">{customer.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Contact Number</p>
              <p className="text-sm font-medium text-gray-800">{customer.phone || customer.contactNumber || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl col-span-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <p className="text-sm font-medium text-gray-800">{customer.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1.5 p-4 bg-blue-50 rounded-xl">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            <p className="text-lg font-bold text-gray-800">{customer.totalOrders ?? customer.orderCount ?? 0}</p>
            <p className="text-xs text-gray-400">Total Orders</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-4 bg-emerald-50 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <p className="text-lg font-bold text-gray-800">{customer.completedOrders ?? 0}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-4 bg-amber-50 rounded-xl">
            <Package className="h-5 w-5 text-amber-500" />
            <p className="text-lg font-bold text-gray-800">
              {formatCurrency(customer.totalSpent ?? 0)}
            </p>
            <p className="text-xs text-gray-400">Total Spent</p>
          </div>
        </div>

        {recentOrders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Recent Orders</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentOrders.map((order, i) => (
                <div key={order.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      #{order.orderNumber || `ORD-${String(order.id).padStart(5, '0')}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(order.totalAmount)}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status
                        ? (order.status.charAt(0).toUpperCase() + order.status.slice(1))
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
