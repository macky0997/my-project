import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-8xl lg:text-9xl font-heading font-bold text-gradient mb-4"
        >
          404
        </motion.div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 mb-2">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" icon={Home} iconPosition="left">
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
