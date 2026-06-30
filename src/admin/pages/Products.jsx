import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import Swal from 'sweetalert2'
import { productService } from '../../services/productService'
import ProductTable from '../../components/admin/ProductTable'
import Button from '../../components/common/Button'

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'cakes', label: 'Cakes' },
  { id: 'cupcakes', label: 'Cupcakes' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'pastries', label: 'Pastries' },
  { id: 'custom', label: 'Custom Orders' },
  { id: 'supplies', label: 'Party Supplies' },
]

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const debounceRef = useRef(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page: currentPage, limit: 10 }
      if (searchQuery) params.search = searchQuery
      if (category) params.category = category
      const response = await productService.getAll(params)
      const data = response.data
      setProducts(data.products || data.data || data || [])
      setTotalPages(data.totalPages || data.total_pages || 1)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  const handleDelete = async (id) => {
    try {
      await productService.delete(id)
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Product has been deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
      })
      fetchProducts()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to delete product.',
      })
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your product inventory</p>
        </div>
        <Button
          onClick={() => navigate('/admin/products/add')}
          icon={Plus}
          size="lg"
        >
          Add Product
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProductTable
          products={products}
          loading={loading}
          onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </div>
  )
}
