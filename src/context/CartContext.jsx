import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import Swal from 'sweetalert2'

export const CartContext = createContext(null)

const STORAGE_KEY = 'marimar_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const showToast = useCallback((icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      customClass: { popup: 'rounded-xl shadow-premium-lg' },
    })
  }, [])

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    showToast('success', 'Added to cart!', `${product.name} x${quantity}`)
  }, [showToast])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
    showToast('info', 'Removed from cart', '')
  }, [showToast])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId))
      showToast('info', 'Removed from cart', '')
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }, [showToast])

  const clearCart = useCallback(() => {
    setItems([])
    showToast('warning', 'Cart cleared', '')
  }, [showToast])

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const openCart = useCallback(() => setIsOpen(true), [])

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    toggleCart,
    closeCart,
    openCart,
  }), [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, toggleCart, closeCart, openCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
