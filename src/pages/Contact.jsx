import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+63 912 345 6789', href: 'tel:+639123456789' },
  { icon: Mail, label: 'Email', value: 'hello@marimarsweetshop.com', href: 'mailto:hello@marimarsweetshop.com' },
  { icon: MapPin, label: 'Address', value: 'Espiritu St., Mangagoy Bislig City, Surigao Del Sur' },
  { icon: Clock, label: 'Business Hours', value: 'Mon-Sat: 8AM - 7PM, Sun: 9AM - 5PM' },
]

export default function Contact() {
  const [sending, setSending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async () => {
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    Swal.fire({ icon: 'success', title: 'Message sent!', text: 'We\'ll get back to you within 24 hours.', confirmButtonColor: '#ec4899' })
    reset()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-3">Get in Touch</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Have a question or want to place a custom order? We'd love to hear from you!
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-premium p-6 lg:p-8"
          >
            <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Your name" error={errors.fullName?.message} {...register('fullName', { required: 'Name is required' })} />
                <Input label="Email" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
              </div>
              <Input label="Subject" placeholder="How can we help?" error={errors.subject?.message} {...register('subject', { required: 'Subject is required' })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your inquiry..."
                  className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all placeholder:text-gray-400"
                  {...register('message', { required: 'Message is required' })}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" variant="primary" size="lg" icon={Send} iconPosition="right" loading={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <div key={info.label} className="bg-white rounded-2xl shadow-premium p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{info.label}</h3>
                      {info.href ? (
                        <a href={info.href} className="text-sm text-gray-500 hover:text-primary-500 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
