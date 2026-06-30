export const SITE_NAME = 'Marimar Sweet PartyNeed Shop'
export const SITE_TAGLINE = 'Making Your Celebrations Sweeter'

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export const CATEGORIES = [
  { id: 'cakes', label: 'Cakes', icon: 'Cake' },
  { id: 'cupcakes', label: 'Cupcakes', icon: 'Cookie' },
  { id: 'cookies', label: 'Cookies', icon: 'Cookie' },
  { id: 'pastries', label: 'Pastries', icon: 'Croissant' },
  { id: 'custom', label: 'Custom Orders', icon: 'Sparkles' },
  { id: 'supplies', label: 'Party Supplies', icon: 'Gift' },
]

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const PAYMENT_METHODS = [
  { id: 'gcash', label: 'GCash', icon: 'Smartphone' },
  { id: 'bank', label: 'Bank Transfer', icon: 'Building' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'Banknote' },
]

export const THEME = {
  colors: {
    primary: '#ec4899',
    secondary: '#a855f7',
    gold: '#f59e0b',
    white: '#ffffff',
    dark: '#1f2937',
  },
}
