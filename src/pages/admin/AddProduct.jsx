import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package } from 'lucide-react'
import Swal from 'sweetalert2'
import ProductForm from '../../components/admin/ProductForm'
import { productService } from '../../services/productService'

export default function AddProduct() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await productService.create(data)
      Swal.fire({
        icon: 'success',
        title: 'Product Created',
        text: 'Product has been added successfully.',
        timer: 1500,
        showConfirmButton: false,
      })
      navigate('/admin/products')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to create product.',
      })
    } finally {
      setSubmitting(false)
    }
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
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-800">Add Product</h1>
            <p className="text-sm text-gray-400 mt-0.5">Create a new product for your store</p>
          </div>
        </div>
      </motion.div>

      <ProductForm onSubmit={handleSubmit} loading={submitting} />
    </div>
  )
}
