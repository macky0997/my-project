import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, TrendingUp, DollarSign, ShoppingCart, Package, Users,
  Download, Printer, FileJson, FileSpreadsheet, Calendar,
  ArrowUpRight, ArrowDownRight, ChevronDown, Filter,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import {
  reportData, exportToCSV, exportToJSON, printReport,
} from '../../services/reportService'

const reportTabs = [
  { id: 'daily', label: 'Daily Sales', icon: Calendar },
  { id: 'weekly', label: 'Weekly Sales', icon: TrendingUp },
  { id: 'monthly', label: 'Monthly Sales', icon: BarChart3 },
  { id: 'products', label: 'Top Products', icon: Package },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
]

const summaryCards = [
  { label: 'Total Revenue', value: reportData.summary.totalRevenue, icon: DollarSign, format: 'currency', trend: '+15.3%', trendUp: true },
  { label: 'Total Orders', value: reportData.summary.totalOrders, icon: ShoppingCart, format: 'number', trend: '+12.5%', trendUp: true },
  { label: 'Avg Order Value', value: reportData.summary.avgOrderValue, icon: TrendingUp, format: 'currency', trend: '+3.2%', trendUp: true },
  { label: 'Total Products', value: reportData.summary.totalProducts, icon: Package, format: 'number', trend: '+8 this month', trendUp: true },
  { label: 'Total Customers', value: reportData.summary.totalCustomers, icon: Users, format: 'number', trend: '+5.8%', trendUp: true },
  { label: 'Growth Rate', value: reportData.summary.growthRate, icon: TrendingUp, format: 'percent', trend: '+2.1% vs last month', trendUp: true },
]

const ORDER_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444']
const PRODUCT_COLORS = ['#ec4899', '#a855f7', '#f59e0b', '#3b82f6', '#10b981', '#f97316', '#06b6d4', '#6366f1']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const tooltipStyle = {
  contentStyle: {
    background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px 16px',
  },
  labelStyle: { fontWeight: 600, color: '#1f2937', marginBottom: 4 },
}

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div style={tooltipStyle.contentStyle}>
      <p style={tooltipStyle.labelStyle}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontSize: 13, fontWeight: 500 }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

function StatCard({ stat, index }) {
  const Icon = stat.icon
  const formattedValue = stat.format === 'currency'
    ? formatCurrency(stat.value)
    : stat.format === 'percent'
      ? `${stat.value}%`
      : stat.value.toLocaleString()

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-4 lg:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md shadow-black/5">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
            {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {stat.trend}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-0.5">{formattedValue}</p>
        <p className="text-sm text-gray-500">{stat.label}</p>
      </div>
    </motion.div>
  )
}

function DailySalesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">Daily Sales Trend</h3>
            <p className="text-sm text-gray-400 mt-0.5">Last 7 days performance</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={reportData.dailySales}>
              <defs>
                <linearGradient id="dailySalesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
              <Area type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={3} fill="url(#dailySalesGradient)" name="Sales" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-gray-100">
          <h3 className="text-lg font-heading font-semibold text-gray-800">Daily Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left py-3.5 px-5 lg:px-6 font-medium">Date</th>
                <th className="text-right py-3.5 font-medium">Sales</th>
                <th className="text-right py-3.5 px-5 lg:px-6 font-medium">Orders</th>
                <th className="text-right py-3.5 px-5 lg:px-6 font-medium">Avg Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportData.dailySales.map((row, i) => (
                <motion.tr
                  key={row.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-5 lg:px-6 text-sm font-medium text-gray-800">{row.date}</td>
                  <td className="py-3.5 text-sm font-semibold text-gray-800 text-right">{formatCurrency(row.sales)}</td>
                  <td className="py-3.5 px-5 lg:px-6 text-sm text-gray-600 text-right">{row.orders}</td>
                  <td className="py-3.5 px-5 lg:px-6 text-sm text-gray-600 text-right">{formatCurrency(Math.round(row.sales / row.orders))}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function WeeklySalesTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportData.weeklySales.map((week, i) => (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-gray-400 mb-1">{week.week}</p>
            <p className="text-xl font-bold text-gray-800 mb-1">{formatCurrency(week.sales)}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{week.orders} orders</span>
              <span className={`text-xs font-semibold ${week.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                {week.growth}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">Weekly Comparison</h3>
            <p className="text-sm text-gray-400 mt-0.5">Sales and orders per week</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.weeklySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
              <Bar dataKey="sales" fill="#ec4899" radius={[8, 8, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function MonthlySalesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">Monthly Performance</h3>
            <p className="text-sm text-gray-400 mt-0.5">January - June 2026</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-gray-500">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-500" />
              <span className="text-gray-500">Orders</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} name="Sales" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 5 }} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-gray-100">
          <h3 className="text-lg font-heading font-semibold text-gray-800">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left py-3.5 px-5 lg:px-6 font-medium">Month</th>
                <th className="text-right py-3.5 font-medium">Sales</th>
                <th className="text-right py-3.5 font-medium">Orders</th>
                <th className="text-right py-3.5 px-5 lg:px-6 font-medium">Avg Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportData.monthlySales.map((row, i) => (
                <motion.tr
                  key={row.month}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-5 lg:px-6 text-sm font-medium text-gray-800">{row.month}</td>
                  <td className="py-3.5 text-sm font-semibold text-gray-800 text-right">{formatCurrency(row.sales)}</td>
                  <td className="py-3.5 text-sm text-gray-600 text-right">{row.orders}</td>
                  <td className="py-3.5 px-5 lg:px-6 text-sm text-gray-600 text-right">{formatCurrency(Math.round(row.sales / row.orders))}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TopProductsTab() {
  const maxSales = Math.max(...reportData.topProducts.map((p) => p.sales))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">Best Selling Products</h3>
            <p className="text-sm text-gray-400 mt-0.5">Top products by units sold</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#4b5563' }} tickLine={false} axisLine={false} width={140} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" radius={[0, 8, 8, 0]} name="Units Sold">
                {reportData.topProducts.map((_, i) => (
                  <Cell key={i} fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-gray-100">
          <h3 className="text-lg font-heading font-semibold text-gray-800">Product Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="text-left py-3.5 px-5 lg:px-6 font-medium">Product</th>
                <th className="text-right py-3.5 font-medium">Units Sold</th>
                <th className="text-right py-3.5 font-medium">Revenue</th>
                <th className="text-right py-3.5 px-5 lg:px-6 font-medium">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportData.topProducts.map((product, i) => (
                <motion.tr
                  key={product.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-5 lg:px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-medium text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-sm text-gray-600 text-right">{product.sales}</td>
                  <td className="py-3.5 text-sm font-semibold text-gray-800 text-right">{formatCurrency(product.revenue)}</td>
                  <td className="py-3.5 px-5 lg:px-6 text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.growth.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {product.growth}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RevenueTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: reportData.revenue.reduce((s, r) => s + r.revenue, 0), color: 'from-emerald-500 to-teal-500' },
          { label: 'Total Cost', value: reportData.revenue.reduce((s, r) => s + r.cost, 0), color: 'from-rose-500 to-pink-500' },
          { label: 'Total Profit', value: reportData.revenue.reduce((s, r) => s + r.profit, 0), color: 'from-primary-500 to-secondary-500' },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <p className="text-sm text-gray-400 mb-1">{item.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
              {formatCurrency(item.value)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">Revenue vs Cost Analysis</h3>
            <p className="text-sm text-gray-400 mt-0.5">Monthly revenue, cost, and profit breakdown</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="cost" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Cost" />
              <Bar dataKey="profit" fill="#ec4899" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-gray-800">Profit Margin Trend</h3>
            <p className="text-sm text-gray-400 mt-0.5">Monthly profit margin percentage</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData.revenue.map(r => ({ ...r, margin: Math.round((r.profit / r.revenue) * 100) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis domain={[30, 45]} tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
              <Line type="monotone" dataKey="margin" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 6, strokeWidth: 3, stroke: 'white' }} name="Margin" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function OrdersTab() {
  const totalOrders = reportData.orderStats.reduce((s, o) => s + o.count, 0)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-1"
        >
          <p className="text-sm text-gray-400 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-800">{totalOrders.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> +12.4% vs last period
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <p className="text-sm text-gray-400 mb-1">Completed Orders</p>
          <p className="text-3xl font-bold text-emerald-600">
            {reportData.orderStats.find(o => o.status === 'Delivered')?.count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round((reportData.orderStats.find(o => o.status === 'Delivered')?.count / totalOrders) * 100)}% of total
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <p className="text-sm text-gray-400 mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-amber-500">
            {reportData.orderStats.find(o => o.status === 'Pending')?.count}
          </p>
          <p className="text-xs text-amber-600 mt-1">Requires attention</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-800">Order Distribution</h3>
              <p className="text-sm text-gray-400 mt-0.5">By status</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.orderStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                >
                  {reportData.orderStats.map((entry, i) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatter={(v) => `${v} orders`} />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ fontSize: 12, color: '#6b7280' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-semibold text-gray-800">Status Breakdown</h3>
              <p className="text-sm text-gray-400 mt-0.5">Detailed order status</p>
            </div>
          </div>
          <div className="space-y-4">
            {reportData.orderStats.map((stat, i) => (
              <motion.div
                key={stat.status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                    <span className="text-sm font-medium text-gray-700">{stat.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">{stat.count.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 w-10 text-right">{stat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage * 1.5}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const tabComponents = {
  daily: DailySalesTab,
  weekly: WeeklySalesTab,
  monthly: MonthlySalesTab,
  products: TopProductsTab,
  revenue: RevenueTab,
  orders: OrdersTab,
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState('daily')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const reportRef = useRef(null)

  const ActiveComponent = tabComponents[activeTab]

  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'daily': return reportData.dailySales
      case 'weekly': return reportData.weeklySales
      case 'monthly': return reportData.monthlySales
      case 'products': return reportData.topProducts
      case 'revenue': return reportData.revenue
      case 'orders': return reportData.orderStats
      default: return []
    }
  }, [activeTab])

  const handleExportCSV = () => {
    const tabLabel = reportTabs.find(t => t.id === activeTab)?.label || 'report'
    exportToCSV(currentData, `marimar-${tabLabel.toLowerCase().replace(/\s+/g, '-')}`)
    setShowExportMenu(false)
  }

  const handleExportJSON = () => {
    const tabLabel = reportTabs.find(t => t.id === activeTab)?.label || 'report'
    exportToJSON(currentData, `marimar-${tabLabel.toLowerCase().replace(/\s+/g, '-')}`)
    setShowExportMenu(false)
  }

  const handlePrint = () => {
    printReport('report-content', `Marimar - ${reportTabs.find(t => t.id === activeTab)?.label || 'Report'}`)
    setShowExportMenu(false)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {summaryCards.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </motion.div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 lg:p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto -mx-5 lg:mx-0 px-5 lg:px-0">
            {reportTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className={`h-3 w-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden"
                >
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                    Export as CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileJson className="h-4 w-4 text-blue-500" />
                    Export as JSON
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="h-4 w-4 text-purple-500" />
                    Print / PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-5 lg:p-6" id="report-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
