import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { formatCurrency } from '../../utils/helpers'
import Badge from '../common/Badge'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-500"
    >
      <Link to={`/shop/${product.id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.originalPrice && (
          <div className="absolute top-3 left-3">
            <Badge variant="danger">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-primary-600 font-medium py-2.5 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-primary-500 font-medium uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/shop/${product.id}`}>
          <h3 className="font-heading font-semibold text-gray-800 group-hover:text-primary-600 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-1">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
          <span className="text-sm text-gray-500">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary-600">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
