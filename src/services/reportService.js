import api from './api'
import { formatCurrency } from '../utils/helpers'

export const reportService = {
  getDailySales: (params) => api.get('/reports/daily-sales', { params }),
  getWeeklySales: (params) => api.get('/reports/weekly-sales', { params }),
  getMonthlySales: (params) => api.get('/reports/monthly-sales', { params }),
  getTopProducts: (params) => api.get('/reports/top-products', { params }),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getOrderStats: (params) => api.get('/reports/order-stats', { params }),
}

export const reportData = {
  dailySales: [
    { date: 'Jun 18', sales: 28400, orders: 24 },
    { date: 'Jun 19', sales: 32200, orders: 28 },
    { date: 'Jun 20', sales: 41800, orders: 35 },
    { date: 'Jun 21', sales: 38500, orders: 32 },
    { date: 'Jun 22', sales: 52600, orders: 41 },
    { date: 'Jun 23', sales: 61200, orders: 48 },
    { date: 'Jun 24', sales: 55800, orders: 45 },
  ],

  weeklySales: [
    { week: 'W1', sales: 184200, orders: 148, growth: '+5.2%' },
    { week: 'W2', sales: 215600, orders: 172, growth: '+17.0%' },
    { week: 'W3', sales: 198400, orders: 165, growth: '-8.0%' },
    { week: 'W4', sales: 242800, orders: 193, growth: '+22.4%' },
  ],

  monthlySales: [
    { month: 'Jan', sales: 584200, orders: 468 },
    { month: 'Feb', sales: 623800, orders: 502 },
    { month: 'Mar', sales: 712400, orders: 574 },
    { month: 'Apr', sales: 685600, orders: 551 },
    { month: 'May', sales: 758300, orders: 612 },
    { month: 'Jun', sales: 841000, orders: 678 },
  ],

  topProducts: [
    { name: 'Chocolate Dream Cake', sales: 342, revenue: 273600, growth: '+12%' },
    { name: 'Strawberry Cupcakes', sales: 289, revenue: 86700, growth: '+8%' },
    { name: 'Christmas Cookies Set', sales: 198, revenue: 59400, growth: '+23%' },
    { name: 'Mixed Pastry Box', sales: 167, revenue: 66800, growth: '+5%' },
    { name: 'Custom Birthday Cake', sales: 145, revenue: 217500, growth: '+18%' },
    { name: 'Vanilla Bean Cake', sales: 132, revenue: 105600, growth: '+14%' },
    { name: 'Macaron Collection', sales: 118, revenue: 47200, growth: '+9%' },
    { name: 'Bread Loaf Set', sales: 96, revenue: 38400, growth: '-2%' },
  ],

  revenue: [
    { month: 'Jan', revenue: 584200, cost: 350520, profit: 233680 },
    { month: 'Feb', revenue: 623800, cost: 374280, profit: 249520 },
    { month: 'Mar', revenue: 712400, cost: 427440, profit: 284960 },
    { month: 'Apr', revenue: 685600, cost: 411360, profit: 274240 },
    { month: 'May', revenue: 758300, cost: 454980, profit: 303320 },
    { month: 'Jun', revenue: 841000, cost: 504600, profit: 336400 },
  ],

  orderStats: [
    { status: 'Pending', count: 43, percentage: 6.2, color: '#f59e0b' },
    { status: 'Confirmed', count: 67, percentage: 9.7, color: '#3b82f6' },
    { status: 'Preparing', count: 52, percentage: 7.5, color: '#8b5cf6' },
    { status: 'Ready', count: 38, percentage: 5.5, color: '#06b6d4' },
    { status: 'Delivered', count: 438, percentage: 63.2, color: '#10b981' },
    { status: 'Cancelled', count: 55, percentage: 7.9, color: '#ef4444' },
  ],

  summary: {
    totalRevenue: 4205300,
    totalOrders: 3460,
    avgOrderValue: 1215,
    totalProducts: 248,
    totalCustomers: 856,
    growthRate: 15.3,
  },
}

export const reportPeriods = ['Daily', 'Weekly', 'Monthly', 'Yearly']

export const reportCategories = [
  { id: 'daily', label: 'Daily Sales', description: 'Day-by-day sales breakdown' },
  { id: 'weekly', label: 'Weekly Sales', description: 'Weekly aggregated sales' },
  { id: 'monthly', label: 'Monthly Sales', description: 'Monthly performance' },
  { id: 'products', label: 'Top Products', description: 'Best selling products' },
  { id: 'revenue', label: 'Revenue Analysis', description: 'Revenue vs costs' },
  { id: 'orders', label: 'Order Statistics', description: 'Order status distribution' },
]

export function exportToCSV(data, filename) {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h]
        const str = String(val ?? '')
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(',')
    ),
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function printReport(elementId, title) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const content = document.getElementById(elementId)
  if (!content) return

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules || [])
          .map(rule => rule.cssText)
          .join('')
      } catch { return '' }
    })
    .join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>${styles}</style>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 40px; }
        @media print { @page { size: landscape; margin: 20mm; } }
      </style>
    </head>
    <body>
      ${content.outerHTML}
    </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 500)
}
