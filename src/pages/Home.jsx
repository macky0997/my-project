import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Cake, Truck, Shield, Star } from 'lucide-react'
import { products, testimonials } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import Button from '../components/common/Button'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

const features = [
  { icon: Cake, title: 'Premium Quality', text: 'Handcrafted with finest ingredients' },
  { icon: Truck, title: 'Free Delivery', text: 'Free shipping on orders over ₱1,000' },
  { icon: Shield, title: 'Secure Payment', text: 'Safe & secure payment options' },
  { icon: Sparkles, title: 'Custom Orders', text: 'Bespoke designs for your event' },
]

export default function Home() {
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="h-4 w-4" />
                Now Accepting Custom Orders
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                Making Your
                <span className="text-gradient block">Celebrations Sweeter</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Discover premium cakes, pastries, and party supplies crafted with love.
                Your one-stop shop for unforgettable celebrations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"
                  alt="Signature Cake"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-premium-lg p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 fill-gold-400 text-gold-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">4.9</p>
                  <p className="text-xs text-gray-500">Customer Rating</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Our most popular items loved by customers
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <motion.div {...fadeUp} className="text-center mt-10">
            <Link to="/shop">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-900 via-secondary-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                Ready to Create Something Special?
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Tell us about your event and we'll create a custom cake or dessert table
                that perfectly matches your vision.
              </p>
              <Link to="/contact">
                <Button variant="gold" size="lg" icon={Sparkles} iconPosition="right">
                  Start Your Order
                </Button>
              </Link>
            </motion.div>
            <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-3xl font-bold text-gold-400">500+</p>
                  <p className="text-sm text-gray-300">Happy Clients</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-3xl font-bold text-gold-400">1,000+</p>
                  <p className="text-sm text-gray-300">Orders Delivered</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-3xl font-bold text-gold-400">50+</p>
                  <p className="text-sm text-gray-300">Cake Designs</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-3xl font-bold text-gold-400">4.9★</p>
                  <p className="text-sm text-gray-300">Average Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Real feedback from our happy customers
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
