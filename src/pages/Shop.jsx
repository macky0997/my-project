import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductGrid from '../components/product/ProductGrid'
import ProductFilter from '../components/product/ProductFilter'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('')
  const [priceRange, setPriceRange] = useState(5000)
  const [showFilters, setShowFilters] = useState(false)
  const [loading] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    result = result.filter((p) => p.price <= priceRange)

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)

    return result
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchParams(category ? { category } : {})
  }

  const handleSearchChange = (q) => {
    setSearchQuery(q)
    setSearchParams(q ? { q } : {})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-2">Our Shop</h1>
        <p className="text-gray-500">Discover our collection of premium treats and party supplies</p>
      </motion.div>

      <ProductFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
        <ProductGrid products={filteredProducts} loading={loading} />
      </div>
    </div>
  )
}
