import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { ShoppingBag, CreditCard, Smartphone, Building, Banknote, Check } from 'lucide-react'
import Swal from 'sweetalert2'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency, generateOrderId } from '../utils/helpers'
import { PAYMENT_METHODS } from '../utils/constants'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      notes: '',
    },
  })

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))

    const order = {
      id: generateOrderId(),
      ...data,
      customerName: data.fullName,
      totalAmount: totalPrice,
      totalPrice,
      items,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const orders = JSON.parse(localStorage.getItem('marimar_orders') || '[]')
    orders.unshift(order)
    localStorage.setItem('marimar_orders', JSON.stringify(orders))
    clearCart()

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      text: `Order #${order.id} has been placed successfully.`,
      confirmButtonColor: '#ec4899',
    }).then(() => navigate('/profile'))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-500">Complete your order</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-premium p-6 space-y-5">
              <h2 className="text-lg font-heading font-semibold text-gray-800">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Juan dela Cruz" error={errors.fullName?.message} {...register('fullName', { required: 'Full name is required' })} />
                <Input label="Email" type="email" placeholder="juan@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
              </div>
              <Input label="Phone Number" placeholder="09123456789" error={errors.phone?.message} {...register('phone', { required: 'Phone is required', pattern: { value: /^(09|\+639)\d{9}$/, message: 'Invalid phone number' } })} />
              <Input label="Delivery Address" placeholder="123 San Juan Street, Manila" error={errors.address?.message} {...register('address', { required: 'Address is required' })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Special instructions, cake message, etc."
                  className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all placeholder:text-gray-400"
                  {...register('notes')}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-premium p-6 space-y-4">
              <h2 className="text-lg font-heading font-semibold text-gray-800">Payment Method</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const icons = { Smartphone, Building, Banknote }
                  const Icon = icons[method.icon]
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${paymentMethod === method.id ? 'text-primary-500' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === method.id ? 'text-primary-600' : 'text-gray-600'}`}>
                        {method.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-premium p-6 sticky top-28 space-y-4">
              <h2 className="text-lg font-heading font-semibold text-gray-800">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="border-gray-100" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary-600 text-lg">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={submitting ? undefined : Check}
                iconPosition="left"
                loading={submitting}
              >
                {submitting ? 'Processing...' : `Place Order - ${formatCurrency(totalPrice)}`}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
