import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import Button from '../common/Button'

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="h-12 w-12 text-gray-300" />
      </div>
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">Your cart is empty</h1>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
      <Link to="/shop">
        <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
          Start Shopping
        </Button>
      </Link>
    </motion.div>
  )
}
