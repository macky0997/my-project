import { Outlet, Link } from 'react-router-dom'
import { SITE_NAME } from '../utils/constants'

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900">
      <div className="p-4">
        <Link to="/" className="text-xl font-heading font-bold text-white hover:text-primary-300 transition-colors">
          {SITE_NAME}
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
