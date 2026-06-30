import { motion } from 'framer-motion'
import { Heart, Cake, Users, Award } from 'lucide-react'

const stats = [
  { icon: Cake, value: '500+', label: 'Cakes Made' },
  { icon: Users, value: '1,000+', label: 'Happy Customers' },
  { icon: Heart, value: '50+', label: 'Custom Designs' },
  { icon: Award, value: '4.9★', label: 'Average Rating' },
]

export default function About() {
  return (
    <div className="overflow-hidden">
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              Our Story
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Marimar Sweet PartyNeed Shop was born from a passion for making every celebration
              special. What started as a small home-based baking venture has grown into a beloved
              destination for premium cakes, pastries, and party essentials.
            </p>
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1200"
                alt="Our Bakery"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-8 bg-gray-50 rounded-2xl"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
                Made with Love, Every Single Time
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every cake, pastry, and treat we create is a labor of love. We use only the finest
                ingredients, from premium Belgian chocolate to farm-fresh eggs and real butter.
                Our team of skilled pastry chefs brings years of experience and creativity to
                every order.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're celebrating a birthday, wedding, or just because, we're here to
                make your moments sweeter. From custom cake designs to complete party packages,
                we've got everything you need for the perfect celebration.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1486427944544-d2c246c4ff2f?w=400"
                  alt="Baking"
                  className="rounded-2xl aspect-square object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400"
                  alt="Decorating"
                  className="rounded-2xl aspect-square object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
                  alt="Ingredients"
                  className="rounded-2xl aspect-square object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400"
                  alt="Party"
                  className="rounded-2xl aspect-square object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
