import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download, Eye, Trash2, Search } from 'lucide-react'
import API from '../api/axios'

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  DISPATCHED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const STATUSES = ['all', 'PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED']

export default function OrdersPage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    productName: '', quantity: '', notes: '',
  })
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  useEffect(() => { fetchOrders() }, [])

  useEffect(() => {
    let result = orders
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter)
    if (searchQuery.trim()) result = result.filter(o =>
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFiltered(result)
    setPage(1)
  }, [statusFilter, searchQuery, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await API.get('/orders')
      setOrders(res.data.data || [])
      setFiltered(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setCreateError('Session error — please logout and login again')
        setCreating(false)
        return
      }
      await API.post('/orders', {
        customerName: form.customerName,
        customerEmail: form.customerEmail || null,
        customerPhone: form.customerPhone || null,
        productName: form.productName,
        quantity: parseInt(form.quantity),
        notes: form.notes || null,
        createdByUserId: userId,
      })
      setForm({ customerName: '', customerEmail: '', customerPhone: '', productName: '', quantity: '', notes: '' })
      setShowCreate(false)
      fetchOrders()
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not create order')
    } finally {
      setCreating(false)
    }
  }

  const handleCancel = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Cancel this order?')) return
    try {
      await API.patch(`/orders/${id}/cancel`)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel')
    }
  }

  const handleAdvanceStatus = async (orderId, newStatus, e) => {
    e.stopPropagation()
    try {
      await API.patch(`/orders/${orderId}/status?newStatus=${newStatus}`)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status')
    }
  }

  const canCreate = role === 'ADMIN' || role === 'SALES'
  const canAdvance = role === 'ADMIN' || role === 'SALES'
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Orders Management</h1>
          <p className="mt-1 text-slate-500 text-sm">Manage, track, and fulfill customer transactions across all channels.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4" />Export CSV
          </button>
          {canCreate && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />Create New Order
            </button>
          )}
        </div>
      </div>

      {showCreate && canCreate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">New Order</h3>
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{createError}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-3 gap-4">
            {[
              { label: 'Customer Name *', key: 'customerName', type: 'text', placeholder: 'ABC Corporation', required: true },
              { label: 'Customer Email *', key: 'customerEmail', type: 'email', placeholder: 'abc@company.com' , required: true },
              { label: 'Customer Phone *', key: 'customerPhone', type: 'text', placeholder: '9876543210' , required : true },
              { label: 'Product Name *', key: 'productName', type: 'text', placeholder: 'UPS Machine 5KVA', required: true },
              { label: 'Quantity *', key: 'quantity', type: 'number', placeholder: '5', required: true },
              { label: 'Notes', key: 'notes', type: 'text', placeholder: 'Optional notes' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                  required={field.required}
                  placeholder={field.placeholder}
                  min={field.key === 'quantity' ? 1 : undefined}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div className="col-span-3 flex gap-3 pt-2">
              <button type="submit" disabled={creating}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {creating ? 'Creating...' : 'Create Order'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-6 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-100 rounded-xl p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200/50 px-3 py-2 rounded-lg">
          <span className="text-sm text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm font-bold text-indigo-700 bg-transparent focus:outline-none"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200/50 px-3 py-2 rounded-lg flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="text-sm text-slate-700 bg-transparent focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/50">
                  <th className="px-6 py-4 w-10">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  {['Order ID', 'Customer', 'Date', 'Product', 'Qty', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((order, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="px-4 py-4 font-mono text-sm font-bold text-indigo-600">
                      #{order.id?.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                          {order.customerName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 max-w-[140px] truncate">{order.productName}</td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">{order.quantity}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          onClick={e => { e.stopPropagation() }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>

                        {canAdvance && order.status === 'PENDING' && (
                          <button
                            onClick={e => handleAdvanceStatus(order.id, 'PROCESSING', e)}
                            className="text-[9px] px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold hover:bg-blue-200 whitespace-nowrap"
                          >
                            PROCESS
                          </button>
                        )}

                        {canAdvance && order.status === 'PROCESSING' && (
                          <button
                            onClick={e => handleAdvanceStatus(order.id, 'DISPATCHED', e)}
                            className="text-[9px] px-2 py-1 bg-purple-100 text-purple-700 rounded font-bold hover:bg-purple-200 whitespace-nowrap"
                          >
                            DISPATCH
                          </button>
                        )}

                        {canAdvance && order.status === 'DISPATCHED' && (
                          <button
                            onClick={e => handleAdvanceStatus(order.id, 'DELIVERED', e)}
                            className="text-[9px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-bold hover:bg-emerald-200 whitespace-nowrap"
                          >
                            DELIVER
                          </button>
                        )}

                        {canCreate && !['DELIVERED', 'CANCELLED'].includes(order.status) && (
                          <button
                            onClick={e => handleCancel(order.id, e)}
                            className="p-1.5 hover:bg-red-50 rounded-lg"
                            title="Cancel"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-800">{filtered.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(page * PER_PAGE, filtered.length)}</span> of{' '}
                <span className="font-bold text-slate-800">{filtered.length}</span> orders
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-500">←</button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold ${page === p ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-white'}`}>
                    {p}
                  </button>
                ))}
                {totalPages > 3 && <span className="text-slate-400 text-xs px-1">...</span>}
                {totalPages > 3 && (
                  <button onClick={() => setPage(totalPages)}
                    className="w-8 h-8 rounded-lg text-xs font-bold text-slate-600 hover:bg-white">{totalPages}</button>
                )}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-500">→</button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: orders.length, sub: 'All Time' },
          { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, sub: 'Attention Req.', color: 'text-yellow-600' },
          { label: 'Processing', value: orders.filter(o => o.status === 'PROCESSING').length, sub: 'In Progress', color: 'text-blue-600' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, sub: 'Completed', color: 'text-emerald-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-extrabold mt-2 ${stat.color || 'text-slate-900'}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}