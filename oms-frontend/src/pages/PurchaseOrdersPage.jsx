import { useEffect, useState } from 'react'
import { Plus, Download, Package, AlertTriangle } from 'lucide-react'
import API from '../api/axios'

const STATUS_STYLES = {
  RAISED: 'bg-slate-100 text-slate-700',
  ACKNOWLEDGED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const STATUSES = ['RAISED','ACKNOWLEDGED','SHIPPED','DELIVERED','CANCELLED']

export default function PurchaseOrdersPage() {
  const role = localStorage.getItem('role')
  const canCreate = role === 'ADMIN' || role === 'PURCHASE'

  const [pos, setPos] = useState([])
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [form, setForm] = useState({
    orderId: '', supplierName: '', supplierEmail: '',
    supplierPhone: '', totalAmount: '', expectedDelivery: '', remarks: ''
  })

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    if (statusFilter === 'all') setFiltered(pos)
    else setFiltered(pos.filter(p => p.status === statusFilter))
  }, [statusFilter, pos])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [posRes, ordersRes] = await Promise.all([
        API.get('/purchase-orders'),
        API.get('/orders'),
      ])
      setPos(posRes.data.data || [])
      setFiltered(posRes.data.data || [])
      // Only PENDING or PROCESSING orders can have PO raised
      setOrders((ordersRes.data.data || []).filter(o =>
        o.status === 'PENDING' || o.status === 'PROCESSING'
      ))
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
      await API.post(`/purchase-orders/${form.orderId}`, {
        supplierName: form.supplierName,
        supplierEmail: form.supplierEmail || null,
        supplierPhone: form.supplierPhone || null,
        totalAmount: parseFloat(form.totalAmount),
        expectedDelivery: form.expectedDelivery || null,
        remarks: form.remarks || null,
      })
      setForm({ orderId:'', supplierName:'', supplierEmail:'', supplierPhone:'', totalAmount:'', expectedDelivery:'', remarks:'' })
      setShowCreate(false)
      fetchAll()
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not create purchase order')
    } finally {
      setCreating(false)
    }
  }

  const handleStatusUpdate = async (poId, newStatus) => {
    try {
      setUpdatingId(poId)
      const params = newStatus === 'DELIVERED'
        ? `?newStatus=${newStatus}&actualDelivery=${new Date().toISOString().split('T')[0]}`
        : `?newStatus=${newStatus}`
      await API.patch(`/purchase-orders/${poId}/status${params}`)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const overdue = pos.filter(p =>
    p.expectedDelivery &&
    new Date(p.expectedDelivery) < new Date() &&
    p.status !== 'DELIVERED' &&
    p.status !== 'CANCELLED'
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Purchase Orders</h1>
          <p className="mt-1 text-slate-500 text-sm">Create and track purchase orders sent to suppliers.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700">
            <Download className="w-4 h-4" />Export
          </button>
          {canCreate && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />Raise Purchase Order
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total POs', value: pos.length },
          { label: 'Raised / Pending', value: pos.filter(p=>['RAISED','ACKNOWLEDGED'].includes(p.status)).length, color: 'text-blue-600' },
          { label: 'In Transit', value: pos.filter(p=>p.status==='SHIPPED').length, color: 'text-purple-600' },
          { label: 'Overdue', value: overdue.length, color: 'text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className={`text-2xl font-extrabold mt-2 ${card.color || 'text-slate-900'}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            {overdue.length} purchase order{overdue.length > 1 ? 's are' : ' is'} overdue — expected delivery date has passed.
          </p>
        </div>
      )}

      {/* Create PO Form */}
      {showCreate && canCreate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Raise New Purchase Order</h3>
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{createError}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Order *</label>
              <select value={form.orderId} onChange={e=>setForm(p=>({...p,orderId:e.target.value}))}
                required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Choose an order...</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.customerName} — {o.productName} [{o.status}]
                  </option>
                ))}
              </select>
            </div>
            {[
              [
                { label: 'Supplier Name *', key: 'supplierName', placeholder: 'Exide Industries', required: true },
                { label: 'Supplier Email', key: 'supplierEmail', placeholder: 'supplier@email.com', type: 'email', required: true },
                { label: 'Supplier Phone', key: 'supplierPhone', placeholder: '9876543210', type: 'text', required: true },
                { label: 'Total Amount (₹) *', key: 'totalAmount', placeholder: '125000', type: 'number', required: true },
                { label: 'Expected Delivery', key: 'expectedDelivery', type: 'date' },
                { label: 'Remarks', key: 'remarks', placeholder: 'Optional notes' }
              ]
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div className="col-span-3 flex gap-3 pt-2">
              <button type="submit" disabled={creating}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {creating ? 'Raising...' : 'Raise PO'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-6 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['PO ID', 'Supplier', 'Order', 'Amount', 'Expected', 'Status', ...(canCreate ? ['Update'] : [])].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((po, i) => {
                const isOverdue = po.expectedDelivery && new Date(po.expectedDelivery) < new Date() && !['DELIVERED','CANCELLED'].includes(po.status)
                return (
                  <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50/30' : ''}`}>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-indigo-600">
                      #{po.id?.substring(0,8).toUpperCase()}
                      {isOverdue && <span className="ml-2 text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">OVERDUE</span>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">{po.supplierName}</p>
                      {po.supplierEmail && <p className="text-xs text-slate-400">{po.supplierEmail}</p>}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      #{po.orderId?.substring(0,8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      ₹{po.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[po.status] || 'bg-slate-100 text-slate-600'}`}>
                        {po.status}
                      </span>
                    </td>
                    {canCreate && (
                      <td className="px-5 py-4">
                        {!['DELIVERED','CANCELLED'].includes(po.status) && (
                          <select
                            value={po.status}
                            disabled={updatingId === po.id}
                            onChange={e => handleStatusUpdate(po.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                          >
                            {STATUSES.filter(s => s !== 'CANCELLED').map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={canCreate ? 7 : 6} className="px-6 py-16 text-center text-slate-400 text-sm">No purchase orders found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}