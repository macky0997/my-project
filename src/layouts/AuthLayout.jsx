import { Outlet, Link } from 'react-router-dom'
import { SITE_NAME } from '../utils/constants'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-premium">
      <div className="p-4">
        <Link to="/" className="text-xl font-heading font-bold text-gradient">
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
