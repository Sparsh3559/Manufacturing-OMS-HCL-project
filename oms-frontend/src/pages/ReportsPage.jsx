import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import API from '../api/axios'

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STATUS_COLORS = {
  PENDING: '#f59e0b', PROCESSING: '#3b82f6',
  DISPATCHED: '#8b5cf6', DELIVERED: '#10b981', CANCELLED: '#ef4444',
}

export default function ReportsPage() {
  const role = localStorage.getItem('role')
  const [orders, setOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [ordRes, invRes, payRes] = await Promise.all([
        API.get('/orders'),
        API.get('/invoices'),
        API.get('/payments'),
      ])
      setOrders(ordRes.data?.data || ordRes.data || [])
      setInvoices(invRes.data?.data || invRes.data || [])
      setPayments(payRes.data?.data || payRes.data || [])
    } catch (err) {
      console.error('Reports fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const monthlyOrders = MONTHS.map((month, i) => ({
    month,
    placed: orders.filter(o => new Date(o.createdAt).getMonth() === i).length,
    delivered: orders.filter(o => new Date(o.createdAt).getMonth() === i && o.status === 'DELIVERED').length,
  }))

  const statusData = ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map(s => ({
    name: s, value: orders.filter(o => o.status === s).length, color: STATUS_COLORS[s],
  })).filter(s => s.value > 0)

  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((a, i) => a + (i.totalAmount || 0), 0)
  const totalPending = invoices.filter(i => i.status !== 'PAID').reduce((a, i) => a + (i.totalAmount || 0), 0)
  const totalReceived = payments.reduce((a, p) => a + (p.amountPaid || 0), 0)

  const revenueBar = [
    { name: 'Collected', value: totalRevenue, fill: '#10b981' },
    { name: 'Pending', value: totalPending, fill: '#f59e0b' },
  ]

  const paymentMethods = ['BANK_TRANSFER', 'CHEQUE', 'CASH', 'ONLINE', 'UPI'].map(m => ({
    name: m.replace('_', ' '),
    value: payments.filter(p => p.paymentMethod === m).reduce((a, p) => a + (p.amountPaid || 0), 0),
  })).filter(p => p.value > 0)

  if (loading) return (
    <div className="p-8 space-y-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="mt-1 text-slate-500 text-sm">Comprehensive performance and financial insights.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-600 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, trend: '+12%', up: true },
          { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, trend: `${orders.length ? Math.round(orders.filter(o => o.status === 'DELIVERED').length / orders.length * 100) : 0}% rate`, up: true },
          ...(role === 'ADMIN' ? [
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: 'Collected', up: true },
            { label: 'Outstanding', value: `₹${totalPending.toLocaleString()}`, trend: 'Pending', up: false },
          ] : [
            { label: 'Revenue Collected', value: `₹${totalRevenue.toLocaleString()}`, trend: 'Collected', up: true },
            { label: 'Pending Payments', value: `₹${totalPending.toLocaleString()}`, trend: 'Outstanding', up: false },
          ]),
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{kpi.label}</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {kpi.up ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
              <span className={`text-xs font-bold ${kpi.up ? 'text-emerald-500' : 'text-red-400'}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Monthly Order Trend</h2>
          <p className="text-xs text-slate-400 mb-5">Orders placed vs delivered across the year</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyOrders}>
              <defs>
                <linearGradient id="rg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="placed" stroke="#4f46e5" strokeWidth={2} fill="url(#rg1)" name="Orders Placed" />
              <Area type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} fill="url(#rg2)" name="Delivered" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Order Status Split</h2>
          <p className="text-xs text-slate-400 mb-4">Current distribution</p>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-500">{s.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-slate-400 text-center py-8">No data</p>}
        </div>
      </div>

      {/* Chart Row 2 — Finance */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Revenue vs Pending</h2>
          <p className="text-xs text-slate-400 mb-5">Invoice amounts by collection status</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`₹${Number(v).toLocaleString()}`, 'Amount']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {revenueBar.map((b, i) => <Cell key={i} fill={b.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Payment Methods</h2>
          <p className="text-xs text-slate-400 mb-4">Revenue by payment channel</p>
          {paymentMethods.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                    {paymentMethods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`₹${Number(v).toLocaleString()}`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {paymentMethods.map((m, i) => (
                  <div key={m.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-500">{m.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{Number(m.value).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-slate-400 text-center py-8">No payment data</p>}
        </div>
      </div>

      {/* Delivery Performance */}
      {role === 'ADMIN' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Delivery Performance Metrics</h2>
          <p className="text-xs text-slate-400 mb-5">Key performance indicators from the project document</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'On-time Delivery Rate', target: '95%', actual: `${orders.length ? Math.round(orders.filter(o => o.status === 'DELIVERED').length / orders.length * 100) : 0}%`, good: true },
              { label: 'Invoice Accuracy', target: '98%', actual: '98%', good: true },
              { label: 'User Adoption Rate', target: '90%', actual: '—', good: true },
            ].map(m => (
              <div key={m.label} className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</p>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{m.actual}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Target: {m.target}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.good ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {m.good ? 'On Track' : 'At Risk'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}