import { createContext, useState, useEffect, useCallback } from 'react'
import Swal from 'sweetalert2'

export const AuthContext = createContext(null)

const USERS_KEY = 'marimar_users'
const SESSION_KEY = 'marimar_user'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function seedDefaultAdmin() {
  const users = getUsers()
  const adminExists = users.some((u) => u.email === 'admin@marimar.com')
  if (!adminExists) {
    users.unshift({
      id: 999,
      name: 'Admin Marimar',
      email: 'admin@marimar.com',
      password: 'admin123',
      phone: '09999999999',
      avatar: null,
      address: 'Admin Office, Manila',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    saveUsers(users)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDefaultAdmin()
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === SESSION_KEY) {
        if (e.newValue) {
          try { setUser(JSON.parse(e.newValue)) } catch { setUser(null) }
        } else {
          setUser(null)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(async (email, password) => {
    await new Promise((r) => setTimeout(r, 800))
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...safeUser } = found
      setUser(safeUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
      Swal.fire({ icon: 'success', title: 'Login successful!', timer: 1500, showConfirmButton: false })
      return { success: true, role: safeUser.role }
    }
    Swal.fire({ icon: 'error', title: 'Invalid credentials', text: 'Please check your email and password' })
    return { success: false }
  }, [])

  const register = useCallback(async (data) => {
    await new Promise((r) => setTimeout(r, 800))
    const users = getUsers()
    const exists = users.some((u) => u.email === data.email)
    if (exists) {
      Swal.fire({ icon: 'error', title: 'Email already registered', text: 'Please use a different email or login' })
      return false
    }
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      avatar: null,
      address: '',
      role: 'customer',
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
    Swal.fire({ icon: 'success', title: 'Account created!', timer: 1500, showConfirmButton: false })
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    Swal.fire({ icon: 'info', title: 'Logged out', timer: 1000, showConfirmButton: false })
  }, [])

  const updateProfile = useCallback(async (data) => {
    await new Promise((r) => setTimeout(r, 500))
    const users = getUsers()
    const idx = users.findIndex((u) => u.id === user?.id)
    if (idx !== -1) {
      const updated = { ...users[idx], name: data.name || users[idx].name, email: data.email || users[idx].email, phone: data.phone || users[idx].phone, address: data.address ?? users[idx].address }
      users[idx] = updated
      saveUsers(users)
      const { password: _, ...safeUser } = updated
      setUser(safeUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
    }
    Swal.fire({ icon: 'success', title: 'Profile updated!', timer: 1500, showConfirmButton: false })
    return true
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}
