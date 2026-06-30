import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn, Shield, ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const REMEMBER_EMAIL_KEY = 'marimar_remembered_email'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (remembered) {
      setValue('email', remembered)
      setRememberMe(true)
    }
  }, [setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await login(data.email, data.password)
      if (result?.success) {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, data.email)
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY)
        }
        if (result.role === 'admin') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Redirecting to User Dashboard',
            text: 'This portal is for administrators. Redirecting to your dashboard.',
            timer: 2000,
            showConfirmButton: false,
          })
          navigate('/dashboard', { replace: true })
        }
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-8"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20 mb-4">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white">Admin Portal</h1>
        <p className="text-gray-400 text-sm mt-1">Sign in to manage your store</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={<span className="text-gray-300">Email</span>}
          type="email"
          placeholder="admin@marimar.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email',
            },
          })}
        />
        <div className="relative">
          <Input
            label={<span className="text-gray-300">Password</span>}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500/50 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember Me</span>
          </label>
          <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</a>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" icon={LogIn} loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to main site
        </Link>
      </div>
    </motion.div>
  )
}
