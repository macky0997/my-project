import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Trash2, Minus, Plus, ArrowRight, Tag,
  ShieldCheck, CreditCard, Percent,
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/helpers'
import Button from '../components/common/Button'

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
      className="group flex gap-4 sm:gap-6 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300"
    >
      <Link to={`/shop/${item.id}`} className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/shop/${item.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-primary-500 transition-colors truncate text-base sm:text-lg">
                  {item.name}
                </h3>
              </Link>
              <p className="text-xs sm:text-sm text-gray-400 capitalize mt-0.5">{item.category}</p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 shrink-0"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-lg sm:text-xl font-bold text-primary-600 mt-2">{formatCurrency(item.price)}</p>
        </div>
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
            <span className="px-4 py-1.5 text-sm font-semibold text-gray-900 min-w-[40px] text-center border-x border-gray-200 bg-gray-50/50">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 99}
              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 hidden sm:block">Subtotal</p>
            <p className="text-base sm:text-lg font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CartSummary({ totalItems, totalPrice }) {
  const shipping = 0
  const savings = totalPrice * 0.05

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
          <Tag className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-heading font-semibold text-gray-900">Order Summary</h2>
      </div>

      <div className="space-y-3.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Items</span>
          <span className="font-semibold text-gray-800">{totalItems}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-800">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
            <ShieldCheck className="h-3 w-3" />
            Free
          </span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <Percent className="h-3.5 w-3.5" />
              You Save
            </span>
            <span className="font-semibold text-emerald-600">{formatCurrency(savings)}</span>
          </div>
        )}
        <hr className="border-gray-100" />
        <div className="flex justify-between items-baseline">
          <span className="text-base font-semibold text-gray-800">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-primary-600">{formatCurrency(totalPrice)}</span>
            <p className="text-[10px] text-gray-400">incl. all taxes</p>
          </div>
        </div>
      </div>

      <Link to="/checkout">
        <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary-500/20" icon={CreditCard} iconPosition="left">
          Proceed to Checkout
        </Button>
      </Link>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Secure checkout · Easy returns</span>
      </div>

      <Link to="/shop" className="block text-center text-sm text-gray-400 hover:text-primary-500 transition-colors font-medium">
        Continue Shopping
      </Link>
    </div>
  )
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-primary-100">
        <ShoppingBag className="h-16 w-16 text-primary-300" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-3">Your cart feels light!</h1>
      <p className="text-gray-400 mb-10 max-w-md text-base">
        Looks like you haven't added anything to your cart yet. Dive into our sweet collection and find something you'll love!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/shop">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Start Shopping
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  if (items.length === 0) return <EmptyCart />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1.5 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>
              <strong className="text-gray-800">{totalItems}</strong> {totalItems === 1 ? 'item' : 'items'} in your cart
            </span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="self-start inline-flex items-center gap-2 text-sm text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-3">
          <div className="hidden sm:flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider px-1 pb-2">
            <span className="pl-36">Product</span>
            <span>Quantity</span>
            <span className="pr-20">Subtotal</span>
          </div>
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  )
}
