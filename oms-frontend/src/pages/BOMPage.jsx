import { useEffect, useState } from 'react'
import { Plus, Download, Trash2, ChevronDown, Package } from 'lucide-react'
import API from '../api/axios'

const STATUS_STYLES = {
  PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border border-blue-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border border-red-200',
}

export default function BOMPage() {
  const role = localStorage.getItem('role')
  const canEdit = role === 'ADMIN' || role === 'PRODUCTION'

  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [bomItems, setBomItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingBom, setLoadingBom] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [form, setForm] = useState({
    partName: '', partNumber: '', quantityRequired: '', unit: 'pcs', description: ''
  })

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await API.get('/orders')
      const activeOrders = (res.data.data || []).filter(o => o.status !== 'CANCELLED')
      setOrders(activeOrders)
      if (activeOrders.length > 0) {
        setSelectedOrder(activeOrders[0])
        fetchBom(activeOrders[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBom = async (orderId) => {
    try {
      setLoadingBom(true)
      const res = await API.get(`/orders/${orderId}/bom`)
      setBomItems(res.data.data || [])
    } catch (err) {
      console.error(err)
      setBomItems([])
    } finally {
      setLoadingBom(false)
    }
  }

  const handleSelectOrder = (order) => {
    setSelectedOrder(order)
    fetchBom(order.id)
    setShowAddForm(false)
  }

  const handleAddPart = async (e) => {
    e.preventDefault()
    if (!selectedOrder) return
    setAddError('')
    setAdding(true)
    try {
      await API.post(`/orders/${selectedOrder.id}/bom`, {
        partName: form.partName,
        partNumber: form.partNumber,
        quantityRequired: parseInt(form.quantityRequired),
        unit: form.unit,
        description: form.description,
      })
      setForm({ partName:'', partNumber:'', quantityRequired:'', unit:'pcs', description:'' })
      setShowAddForm(false)
      fetchBom(selectedOrder.id)
    } catch (err) {
      setAddError(err.response?.data?.message || 'Could not add part')
    } finally {
      setAdding(false)
    }
  }

  const handleDeletePart = async (itemId) => {
    if (!window.confirm('Delete this part?')) return
    try {
      await API.delete(`/orders/${selectedOrder.id}/bom/${itemId}`)
      fetchBom(selectedOrder.id)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete')
    }
  }

  const totalQty = bomItems.reduce((a, i) => a + (i.quantityRequired || 0), 0)

  if (loading) return (
    <div className="p-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Manufacturing Core</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Bill of Materials{selectedOrder ? `: ${selectedOrder.productName}` : ''}
          </h1>
          {selectedOrder && (
            <p className="mt-1 text-slate-400 text-sm">
              Order for {selectedOrder.customerName} · Status:{' '}
              <span className="font-semibold text-slate-600">{selectedOrder.status}</span>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export to PDF
          </button>
          {canEdit && selectedOrder && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Add Part
            </button>
          )}
        </div>
      </div>

      {/* Order Selector + Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Order Selector */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Order</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {orders.map(order => (
              <button
                key={order.id}
                onClick={() => handleSelectOrder(order)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                  selectedOrder?.id === order.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <p className="font-semibold truncate">{order.customerName}</p>
                <p className="text-xs opacity-70 truncate">{order.productName}</p>
              </button>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No orders available</p>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Components</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{bomItems.length}</p>
            <p className="text-xs text-slate-400 mt-1">Parts in BOM</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Quantity</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalQty}</p>
            <p className="text-xs text-slate-400 mt-1">Units across all parts</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Material</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-2 truncate">
              {bomItems[0]?.partName || '—'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs text-slate-400">First Part Listed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Part Form */}
      {showAddForm && canEdit && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Add New Part to BOM</h3>
          {addError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{addError}</div>
          )}
          <form onSubmit={handleAddPart} className="grid grid-cols-3 gap-4">
            {[
              { label: 'Part Name *', key: 'partName', placeholder: 'e.g. Lead Acid Battery', required: true },
              { label: 'Part Number *', key: 'partNumber', placeholder: 'e.g. BATT-12V-001', required: true },
              { label: 'Description', key: 'description', placeholder: 'Optional description' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity *</label>
              <input
                type="number"
                value={form.quantityRequired}
                onChange={e => setForm(p => ({ ...p, quantityRequired: e.target.value }))}
                required
                min="1"
                placeholder="10"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {['pcs', 'kg', 'meters', 'liters', 'set', 'units'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="col-span-3 flex gap-3 pt-2">
              <button type="submit" disabled={adding}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {adding ? 'Adding...' : 'Add Part'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOM Table */}
      <div className="bg-white rounded-xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
          <h2 className="font-bold text-slate-900">
            {selectedOrder ? `${selectedOrder.productName} — Parts List` : 'Select an order to view BOM'}
          </h2>
          <span className="text-xs text-slate-400">{bomItems.length} components</span>
        </div>

        {loadingBom ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Part Name', 'Part Number', 'Quantity', 'Unit', 'Description', ...(canEdit ? ['Actions'] : [])].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bomItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{item.partName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{item.partNumber}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.quantityRequired}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.unit}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                    {item.description || '—'}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeletePart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {bomItems.length === 0 && !loadingBom && (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-6 py-16 text-center text-slate-400 text-sm">
                    {selectedOrder
                      ? canEdit
                        ? 'No parts added yet. Click "Add Part" to build the BOM.'
                        : 'No BOM items for this order yet.'
                      : 'Select an order from the list above.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
            {bomItems.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td className="px-6 py-4 text-sm font-bold text-slate-700" colSpan={2}>
                    Total Roll-up
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-indigo-700">
                    {totalQty} units
                  </td>
                  <td colSpan={canEdit ? 3 : 2} />
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  )
}