import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../common/Spinner'
import Swal from 'sweetalert2'

export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    Swal.fire({
      icon: 'info',
      title: 'Admin Access Required',
      text: 'Please login with admin credentials to continue',
      timer: 2000,
      showConfirmButton: false,
    })
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!user || user.role !== 'admin') {
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You do not have permission to access this area',
      timer: 2500,
      showConfirmButton: false,
    })
    return <Navigate to="/dashboard" replace />
  }

  return children
}
