import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  padding = true,
  onClick,
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-premium
        ${hover ? 'cursor-pointer hover:shadow-premium-lg' : ''}
        ${padding ? 'p-6' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
