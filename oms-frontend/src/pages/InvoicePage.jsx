import { useEffect, useState } from 'react'
import { Plus, Download, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import API from '../api/axios'

const STATUS_STYLES = {
  UNPAID: 'bg-red-100 text-red-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-orange-100 text-orange-700',
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([])
  const [eligibleOrders, setEligibleOrders] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [summary, setSummary] = useState({ totalRevenue: 0, totalPending: 0 })
  const [form, setForm] = useState({
    orderId: '', amount: '', taxAmount: '', dueDate: ''
  })
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    if (statusFilter === 'all') setFilteredInvoices(invoices)
    else setFilteredInvoices(invoices.filter(i => i.status === statusFilter))
    setPage(1)
  }, [statusFilter, invoices])

  const fetchAll = async () => {
    try {
      setLoading(true)

      const [invRes, ordRes] = await Promise.all([
        API.get('/invoices'),
        API.get('/orders'),
      ])

      const allInvoices = invRes.data?.data || []
      const allOrders = ordRes.data?.data || []

      setInvoices(allInvoices)
      setFilteredInvoices(allInvoices)

      const revenue = allInvoices
        .filter(i => i.status === 'PAID')
        .reduce((a, i) => a + (parseFloat(i.totalAmount) || 0), 0)
      const pending = allInvoices
        .filter(i => i.status !== 'PAID')
        .reduce((a, i) => a + (parseFloat(i.totalAmount) || 0), 0)
      setSummary({ totalRevenue: revenue, totalPending: pending })

      // Get all order IDs that already have an invoice
      // Convert to strings and trim to ensure clean comparison
      const invoicedOrderIds = new Set(
        allInvoices
          .map(i => String(i.orderId || '').trim().toLowerCase())
          .filter(id => id.length > 0)
      )

      // Find dispatched/delivered orders not yet invoiced
      const dispatchedOrDelivered = allOrders.filter(o =>
        o.status === 'DISPATCHED' || o.status === 'DELIVERED'
      )

      const eligible = dispatchedOrDelivered.filter(o => {
        const orderId = String(o.id || '').trim().toLowerCase()
        return !invoicedOrderIds.has(orderId)
      })

      setEligibleOrders(eligible)

      // Debug info
      setDebugInfo(
        `Total orders: ${allOrders.length} | ` +
        `DISPATCHED/DELIVERED: ${dispatchedOrDelivered.length} | ` +
        `Already invoiced: ${invoicedOrderIds.size} | ` +
        `Eligible: ${eligible.length}`
      )

    } catch (err) {
      console.error('Invoice fetch error:', err)
      setDebugInfo('Error: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text('Invoice Report', 14, 22)
      doc.setFontSize(11)
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 30)
      autoTable(doc, {
        startY: 38,
        head: [['Invoice No', 'Order ID', 'Amount', 'Tax', 'Total', 'Status', 'Due Date']],
        body: filteredInvoices.map(inv => [
          inv.invoiceNumber || '—',
          `#${String(inv.orderId || '').substring(0, 8).toUpperCase()}`,
          `Rs ${parseFloat(inv.amount || 0).toLocaleString()}`,
          `Rs ${parseFloat(inv.taxAmount || 0).toLocaleString()}`,
          `Rs ${parseFloat(inv.totalAmount || 0).toLocaleString()}`,
          inv.status?.replace('_', ' ') || '—',
          inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : '—',
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [79, 70, 229] },
      })
      doc.save('invoices.pdf')
    } catch (err) {
      alert('PDF export failed. Run: npm install jspdf jspdf-autotable')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      await API.post(`/invoices/${form.orderId}`, {
        amount: parseFloat(form.amount),
        taxAmount: form.taxAmount ? parseFloat(form.taxAmount) : 0,
        dueDate: form.dueDate || null,
      })
      setForm({ orderId: '', amount: '', taxAmount: '', dueDate: '' })
      setShowCreate(false)
      fetchAll()
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not create invoice')
    } finally {
      setCreating(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PER_PAGE))
  const paged = filteredInvoices.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invoices</h1>
          <p className="mt-1 text-slate-500 text-sm">Generate and track customer invoices.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />Export PDF
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />Generate Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `Rs ${summary.totalRevenue.toLocaleString()}`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Amount', value: `Rs ${summary.totalPending.toLocaleString()}`, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Total Invoices', value: invoices.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Ready to Invoice', value: eligibleOrders.length, icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{card.value}</p>
            </div>
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Debug info — remove after testing */}
      {debugInfo && (
        <div className="p-3 bg-slate-100 rounded-lg text-xs font-mono text-slate-600">
          {debugInfo}
        </div>
      )}

      {/* Generate Invoice Form */}
      {showCreate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Generate New Invoice</h3>
          <p className="text-xs text-slate-400 mb-4">
            Only DISPATCHED or DELIVERED orders without an existing invoice appear below.
          </p>

          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {createError}
            </div>
          )}

          {eligibleOrders.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>No eligible orders right now.</strong>
              <br /><br />
              To generate an invoice an order must be DISPATCHED or DELIVERED.
              <br /><br />
              Go to <strong>Orders page</strong> → find any PENDING or PROCESSING order →
              click the <strong>PROCESS</strong> → <strong>DISPATCH</strong> buttons →
              come back here.
              <br /><br />
              <span className="text-xs text-slate-500">Debug: {debugInfo}</span>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Select Order * ({eligibleOrders.length} available)
                </label>
                <select
                  value={form.orderId}
                  onChange={e => setForm(p => ({ ...p, orderId: e.target.value }))}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose an order to invoice...</option>
                  {eligibleOrders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.customerName} — {o.productName}
                      (Qty: {o.quantity}) [{o.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (Rs) *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  required min="1"
                  placeholder="250000"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tax Amount (Rs)</label>
                <input
                  type="number"
                  value={form.taxAmount}
                  onChange={e => setForm(p => ({ ...p, taxAmount: e.target.value }))}
                  min="0"
                  placeholder="45000"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Due Date (default: 30 days from today)
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={creating}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                  {creating ? 'Generating...' : 'Generate Invoice'}
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Invoice No', 'Order', 'Amount', 'Tax', 'Total', 'Status', 'Due Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((inv, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      #{String(inv.orderId || '').substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      Rs {parseFloat(inv.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      Rs {parseFloat(inv.taxAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      Rs {parseFloat(inv.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[inv.status] || 'bg-slate-100 text-slate-600'}`}>
                        {inv.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-800">{filteredInvoices.length}</span> invoices
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-500"
                >‹</button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold ${page === p ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-white'}`}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-500"
                >›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}