import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Package, Settings, LogOut, ChevronRight, Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency, getStatusColor } from '../utils/helpers'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
  const [saving, setSaving] = useState(false)

  const orders = JSON.parse(localStorage.getItem('marimar_orders') || '[]')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  })

  const onSaveProfile = async (data) => {
    setSaving(true)
    await updateProfile(data)
    setSaving(false)
  }

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-premium p-6 space-y-6 sticky top-28">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-heading font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </span>
                    <ChevronRight className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary-400' : 'text-gray-300'}`} />
                  </button>
                )
              })}
            </nav>
            <hr className="border-gray-100" />
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">My Orders</h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-premium p-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-1">No orders yet</h3>
                  <p className="text-sm text-gray-400">Your orders will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-premium p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Order #{order.id}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('en-PH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="flex-1 text-gray-600">{item.name} x{item.quantity}</span>
                            <span className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <hr className="border-gray-100 my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-lg font-bold text-primary-600">{formatCurrency(order.totalPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Profile Settings</h2>
              <div className="bg-white rounded-2xl shadow-premium p-6">
                <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4 max-w-lg">
                  <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
                  <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
                  <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
                  <Input label="Address" {...register('address')} />
                  <Button type="submit" variant="primary" loading={saving}>
                    Save Changes
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Account Settings</h2>
              <div className="bg-white rounded-2xl shadow-premium p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-500 mb-4">Manage your notification preferences</p>
                  <div className="space-y-3">
                    {['Order updates via email', 'Promotional offers', 'SMS notifications'].map((item) => (
                      <label key={item} className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">Irreversible actions</p>
                  <Button variant="danger" size="sm">Delete Account</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
