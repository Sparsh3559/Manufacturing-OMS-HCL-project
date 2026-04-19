import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { TrendingUp, TrendingDown, ShoppingCart, CreditCard, DollarSign, Package, RefreshCw } from 'lucide-react'
import API from '../api/axios'

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  PROCESSING: '#3b82f6',
  DISPATCHED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')

  const [orders, setOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [ordRes] = await Promise.all([API.get('/orders')])
      setOrders(ordRes.data.data || [])

      if (role === 'ADMIN' || role === 'FINANCE') {
        const [invRes, payRes] = await Promise.all([
          API.get('/invoices'),
          API.get('/payments'),
        ])
        setInvoices(invRes.data.data || [])
        setPayments(payRes.data.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Chart data — monthly orders
  const monthlyOrders = MONTHS.map((month, i) => ({
    month,
    orders: orders.filter(o => new Date(o.createdAt).getMonth() === i).length,
    delivered: orders.filter(o => new Date(o.createdAt).getMonth() === i && o.status === 'DELIVERED').length,
  }))

  // Pie chart — order status distribution
  const statusData = ['PENDING','PROCESSING','DISPATCHED','DELIVERED','CANCELLED'].map(s => ({
    name: s,
    value: orders.filter(o => o.status === s).length,
    color: STATUS_COLORS[s],
  })).filter(s => s.value > 0)

  // Payment method breakdown
  const paymentMethodData = ['BANK_TRANSFER','CHEQUE','CASH','ONLINE','UPI'].map(m => ({
    name: m.replace('_',' '),
    value: payments.filter(p => p.paymentMethod === m).length,
  })).filter(p => p.value > 0)

  // Revenue vs pending
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((a, i) => a + (i.totalAmount || 0), 0)
  const totalPending = invoices.filter(i => i.status !== 'PAID').reduce((a, i) => a + (i.totalAmount || 0), 0)

  const revenueData = [
    { name: 'Collected', value: totalRevenue, fill: '#10b981' },
    { name: 'Pending', value: totalPending, fill: '#f59e0b' },
  ]

  const kpis = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%', up: true },
    { label: 'Delivered', value: orders.filter(o=>o.status==='DELIVERED').length, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%', up: true },
    ...(role === 'ADMIN' || role === 'FINANCE' ? [
      { label: 'Revenue Collected', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8%', up: true },
      { label: 'Pending Payments', value: `₹${totalPending.toLocaleString()}`, icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: '-2%', up: false },
    ] : [
      { label: 'Pending', value: orders.filter(o=>o.status==='PENDING').length, icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: 'Action Req', up: false },
      { label: 'Cancelled', value: orders.filter(o=>o.status==='CANCELLED').length, icon: Package, color: 'text-red-500', bg: 'bg-red-50', trend: 'This Period', up: false },
    ]),
  ]

  if (loading) return (
    <div className="p-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="mt-1 text-slate-500 text-sm">Welcome back, {name}. Here is what is happening today.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-600 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{kpi.value}</p>
              </div>
              <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {kpi.up
                ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                : <TrendingDown className="w-3 h-3 text-red-400" />
              }
              <span className={`text-xs font-bold ${kpi.up ? 'text-emerald-500' : 'text-red-400'}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 — Area Chart + Pie */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Monthly Order Trend</h2>
          <p className="text-xs text-slate-400 mb-5">Orders placed and delivered per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyOrders}>
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{borderRadius:8, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', fontSize:12}} />
              <Legend />
              <Area type="monotone" dataKey="orders" stroke="#4f46e5" strokeWidth={2} fill="url(#ordersGrad)" name="Orders" />
              <Area type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} fill="url(#deliveredGrad)" name="Delivered" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1">Order Status Split</h2>
          <p className="text-xs text-slate-400 mb-5">Distribution by current status</p>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    dataKey="value" paddingAngle={3}>
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}} />
                      <span className="text-slate-600 font-medium">{s.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No order data yet</p>
          )}
        </div>
      </div>

      {/* Row 2 — Finance charts (ADMIN and FINANCE only) */}
      {(role === 'ADMIN' || role === 'FINANCE') && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-1">Invoice Status Overview</h2>
            <p className="text-xs text-slate-400 mb-5">Revenue collected vs pending</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'PAID', value: invoices.filter(i=>i.status==='PAID').reduce((a,i)=>a+(i.totalAmount||0),0) },
                { name: 'UNPAID', value: invoices.filter(i=>i.status==='UNPAID').reduce((a,i)=>a+(i.totalAmount||0),0) },
                { name: 'PARTIAL', value: invoices.filter(i=>i.status==='PARTIALLY_PAID').reduce((a,i)=>a+(i.totalAmount||0),0) },
                { name: 'OVERDUE', value: invoices.filter(i=>i.status==='OVERDUE').reduce((a,i)=>a+(i.totalAmount||0),0) },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Amount']}
                  contentStyle={{borderRadius:8, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', fontSize:12}} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {['#10b981','#ef4444','#f59e0b','#f97316'].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-1">Payment Methods</h2>
            <p className="text-xs text-slate-400 mb-5">Breakdown by payment type</p>
            {paymentMethodData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={70}
                      dataKey="value" paddingAngle={3}>
                      {paymentMethodData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-3">
                  {paymentMethodData.map((m, i) => (
                    <div key={m.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                        <span className="text-slate-600 font-medium">{m.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{m.value} txns</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No payment data yet</p>
            )}
          </div>
        </div>
      )}

      {/* Recent Orders Mini Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent Orders</h2>
          <button onClick={() => navigate('/orders')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
            View All →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Order ID', 'Customer', 'Product', 'Qty', 'Date', 'Status'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0,5).map((order, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => navigate('/orders')}>
                <td className="px-6 py-3 font-mono text-xs font-bold text-indigo-600">#{order.id?.substring(0,8).toUpperCase()}</td>
                <td className="px-6 py-3 text-sm font-semibold text-slate-900">{order.customerName}</td>
                <td className="px-6 py-3 text-sm text-slate-500 truncate max-w-[140px]">{order.productName}</td>
                <td className="px-6 py-3 text-sm font-bold text-slate-900">{order.quantity}</td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    style={{backgroundColor: STATUS_COLORS[order.status]+'20', color: STATUS_COLORS[order.status]}}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}