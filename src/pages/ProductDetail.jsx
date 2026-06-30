import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, ChevronLeft, Minus, Plus, Check } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/helpers'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import ProductCard from '../components/product/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.id === Number(id))
  const related = products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Product not found</h2>
        <Link to="/shop" className="text-primary-500 hover:underline">Back to shop</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors mb-6">
        <ChevronLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden shadow-premium">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.originalPrice && (
            <div className="absolute top-4 left-4">
              <Badge variant="danger">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm text-primary-500 font-medium uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Features:</h3>
            <ul className="space-y-1.5">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </button>
              <span className="px-6 py-3 font-medium text-gray-800 border-x border-gray-200">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="xl"
              className="flex-1"
              icon={added ? Check : ShoppingCart}
              iconPosition="left"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="xl" icon={Heart} />
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
            <p>✓ Free shipping on orders over ₱1,000</p>
            <p>✓ Secure checkout with GCash, Bank Transfer, or COD</p>
            <p>✓ Customize your order by leaving a note at checkout</p>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
