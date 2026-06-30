import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package } from 'lucide-react'
import Swal from 'sweetalert2'
import ProductForm from '../../components/admin/ProductForm'
import { productService } from '../../services/productService'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id)
        const data = response.data
        setProduct(data.data || data)
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load product.',
        })
        navigate('/admin/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await productService.update(id, data)
      Swal.fire({
        icon: 'success',
        title: 'Product Updated',
        text: 'Product has been updated successfully.',
        timer: 1500,
        showConfirmButton: false,
      })
      navigate('/admin/products')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update product.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">Product not found</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
            <Package className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Edit Product</h1>
            <p className="text-sm text-gray-400 mt-0.5 truncate max-w-md">{product.name}</p>
          </div>
        </div>
      </motion.div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  )
}
