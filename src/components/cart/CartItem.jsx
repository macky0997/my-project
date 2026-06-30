import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import QuantitySelector from '../common/QuantitySelector'

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 bg-white rounded-2xl p-4 shadow-premium"
    >
      <Link to={`/shop/${item.id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/shop/${item.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary-500 transition-colors truncate">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 capitalize mb-2">{item.category}</p>
        <p className="text-lg font-bold text-primary-600">{formatCurrency(item.price)}</p>
        <div className="flex items-center gap-3 mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => onUpdateQuantity(item.id, q)}
          />
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-end justify-between">
        <p className="text-sm text-gray-500">Subtotal</p>
        <p className="text-lg font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
      </div>
    </motion.div>
  )
}
