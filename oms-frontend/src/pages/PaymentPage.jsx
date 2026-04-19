import { useEffect, useState } from 'react'
import { Plus, CreditCard, TrendingUp } from 'lucide-react'
import API from '../api/axios'

const METHOD_STYLES = {
  BANK_TRANSFER: 'bg-blue-100 text-blue-700',
  CHEQUE: 'bg-purple-100 text-purple-700',
  CASH: 'bg-emerald-100 text-emerald-700',
  ONLINE: 'bg-indigo-100 text-indigo-700',
  UPI: 'bg-orange-100 text-orange-700',
}

export default function PaymentPage() {
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [balance, setBalance] = useState(null)
  const [totalReceived, setTotalReceived] = useState(0)
  const [form, setForm] = useState({ invoiceId: '', amountPaid: '', paymentMethod: 'BANK_TRANSFER', referenceNumber: '', remarks: '' })

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    if (form.invoiceId) fetchBalance(form.invoiceId)
    else setBalance(null)
  }, [form.invoiceId])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [paymentsRes, invoicesRes] = await Promise.all([
        API.get('/payments'),
        API.get('/invoices'),
      ])
      const allPayments = paymentsRes.data.data || []
      setPayments(allPayments)
      setTotalReceived(allPayments.reduce((a, p) => a + (p.amountPaid || 0), 0))
      // Only show unpaid/partially paid invoices for payment recording
      const unpaidInvoices = (invoicesRes.data.data || []).filter(i =>
        i.status === 'UNPAID' || i.status === 'PARTIALLY_PAID'
      )
      setInvoices(unpaidInvoices)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBalance = async (invoiceId) => {
    try {
      const res = await API.get(`/payments/invoice/${invoiceId}/balance`)
      setBalance(res.data.data)
    } catch {}
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      await API.post(`/payments/${form.invoiceId}`, {
        amountPaid: parseFloat(form.amountPaid),
        paymentMethod: form.paymentMethod,
        referenceNumber: form.referenceNumber || null,
        remarks: form.remarks || null,
      })
      setForm({ invoiceId:'', amountPaid:'', paymentMethod:'BANK_TRANSFER', referenceNumber:'', remarks:'' })
      setShowCreate(false)
      setBalance(null)
      fetchAll()
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not record payment')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments</h1>
          <p className="mt-1 text-slate-500 text-sm">Record and track all payment transactions.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">₹{totalReceived.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Transactions</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{payments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Invoices</p>
          <p className="text-2xl font-extrabold text-yellow-600 mt-2">{invoices.length}</p>
        </div>
      </div>

      {/* Record Payment Form */}
      {showCreate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Record New Payment</h3>
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{createError}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Invoice *</label>
              <select value={form.invoiceId} onChange={e=>setForm(p=>({...p,invoiceId:e.target.value}))}
                required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Choose an invoice...</option>
                {invoices.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — ₹{inv.totalAmount?.toLocaleString()} [{inv.status}]
                  </option>
                ))}
              </select>
              {balance !== null && (
                <p className="mt-1.5 text-xs font-semibold text-indigo-600">
                  Remaining balance: ₹{Number(balance).toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount Paid (₹) *</label>
              <input type="number" value={form.amountPaid} onChange={e=>setForm(p=>({...p,amountPaid:e.target.value}))}
                required min="1" placeholder="150000"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method *</label>
              <select value={form.paymentMethod} onChange={e=>setForm(p=>({...p,paymentMethod:e.target.value}))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {['BANK_TRANSFER','CHEQUE','CASH','ONLINE','UPI'].map(m => (
                  <option key={m} value={m}>{m.replace('_',' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reference Number</label>
              <input type="text" value={form.referenceNumber} onChange={e=>setForm(p=>({...p,referenceNumber:e.target.value}))}
                placeholder="TXN-2025-001"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
              <input type="text" value={form.remarks} onChange={e=>setForm(p=>({...p,remarks:e.target.value}))}
                placeholder="Optional note"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={creating}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {creating ? 'Recording...' : 'Record Payment'}
              </button>
              <button type="button" onClick={() => { setShowCreate(false); setBalance(null) }}
                className="px-6 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Invoice', 'Amount Paid', 'Method', 'Reference', 'Remarks', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">#{payment.invoiceId?.substring(0,8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-700">₹{payment.amountPaid?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${METHOD_STYLES[payment.paymentMethod] || 'bg-slate-100 text-slate-600'}`}>
                      {payment.paymentMethod?.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{payment.referenceNumber || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{payment.remarks || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm">No payments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}