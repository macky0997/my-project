import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, ImageOff, Package } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'

const CATEGORIES = [
  { id: 'cakes', label: 'Cakes' },
  { id: 'cupcakes', label: 'Cupcakes' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'pastries', label: 'Pastries' },
  { id: 'custom', label: 'Custom Orders' },
  { id: 'supplies', label: 'Party Supplies' },
]

export default function ProductForm({ initialData, onSubmit, loading }) {
  const navigate = useNavigate()
  const isEdit = !!initialData
  const [imageError, setImageError] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: '',
      category: '',
      description: '',
      price: '',
      stockQuantity: '',
      image: '',
    },
  })

  const watchedImage = watch('image')

  useEffect(() => {
    setImageError(false)
  }, [watchedImage])

  const submitHandler = (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="max-w-4xl space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
            <Package className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-gray-800">Basic Information</h2>
            <p className="text-sm text-gray-400">Enter the main details of your product</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            name="name"
            placeholder="e.g. Classic Chocolate Cake"
            error={errors.name?.message}
            {...register('name', { required: 'Product name is required' })}
          />

          <div className="space-y-1.5">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              className={`block w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 ${
                errors.category ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
              }`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`block w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 resize-none ${
                errors.description ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Describe your product, including key features and details..."
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8"
      >
        <h2 className="text-lg font-heading font-semibold text-gray-800 mb-6">Pricing & Stock</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Price (₱)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
              valueAsNumber: true,
            })}
          />
          <Input
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            min="0"
            placeholder="0"
            error={errors.stockQuantity?.message}
            {...register('stockQuantity', {
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock must be at least 0' },
              valueAsNumber: true,
            })}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8"
      >
        <h2 className="text-lg font-heading font-semibold text-gray-800 mb-6">Product Image</h2>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Input
            label="Image URL"
            name="image"
            placeholder="https://example.com/image.jpg"
            error={errors.image?.message}
            {...register('image', { required: 'Product image is required' })}
          />
          <div className="flex items-center justify-center md:justify-start">
            {watchedImage && !imageError ? (
              <div className="relative group">
                <img
                  src={watchedImage}
                  alt="Product preview"
                  className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50/50">
                <ImageOff className="h-8 w-8" />
                <span className="text-xs">No image preview</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/products')}
          icon={ArrowLeft}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={Save}
        >
          {isEdit ? 'Update Product' : 'Save Product'}
        </Button>
      </div>
    </form>
  )
}
