import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import Button from '../common/Button'

export default function CartSummary({ totalItems, totalPrice, onCheckout }) {
  return (
    <div className="bg-white rounded-2xl shadow-premium p-6 sticky top-28 space-y-4">
      <h2 className="text-lg font-heading font-semibold text-gray-800">Order Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Items</span>
          <span className="font-medium text-gray-800">{totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-800">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between text-base">
          <span className="font-semibold text-gray-800">Total</span>
          <span className="font-bold text-primary-600 text-lg">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      {onCheckout ? (
        <Button variant="primary" size="lg" className="w-full" onClick={onCheckout} icon={ArrowRight} iconPosition="right">
          Proceed to Checkout
        </Button>
      ) : (
        <Link to="/checkout">
          <Button variant="primary" size="lg" className="w-full" icon={ArrowRight} iconPosition="right">
            Proceed to Checkout
          </Button>
        </Link>
      )}
      <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-primary-500 transition-colors">
        Continue Shopping
      </Link>
    </div>
  )
}
