import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Globe, Heart, MessageCircle } from 'lucide-react'
import { SITE_NAME, NAV_LINKS } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-gradient">{SITE_NAME}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Making your celebrations sweeter with premium cakes, pastries, and party supplies.
              Your one-stop shop for unforgettable parties.
            </p>
            <div className="flex gap-3">
              {[Globe, Heart, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <span className="text-sm">Espiritu St., Mangagoy Bislig City, Surigao Del Sur</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm">+63 912 345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm">hello@marimarsweetshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
