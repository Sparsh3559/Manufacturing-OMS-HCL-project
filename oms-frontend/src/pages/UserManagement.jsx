import { useEffect, useState } from 'react'
import { Plus, Download, Search, MoreVertical, UserCheck, UserX } from 'lucide-react'
import API from '../api/axios'

const ROLE_STYLES = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  SALES: 'bg-blue-100 text-blue-700',
  FINANCE: 'bg-emerald-100 text-emerald-700',
  PURCHASE: 'bg-orange-100 text-orange-700',
  PRODUCTION: 'bg-purple-100 text-purple-700',
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionId, setActionId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'SALES' })
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    let result = users
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter)
    if (statusFilter !== 'all') result = result.filter(u =>
      statusFilter === 'active' ? u.active : !u.active
    )
    setFiltered(result)
    setPage(1)
  }, [roleFilter, statusFilter, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await API.get('/users')
      setUsers(res.data.data || [])
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
      await API.post('/users', form)
      setForm({ name:'', email:'', password:'', role:'SALES' })
      setShowCreate(false)
      fetchUsers()
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Could not create user')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (user) => {
    try {
      setActionId(user.id)
      await API.patch(`/users/${user.id}/${user.active ? 'deactivate' : 'activate'}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update user')
    } finally {
      setActionId(null)
      setOpenMenuId(null)
    }
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const stats = [
    { label: 'Total Users', value: users.length, sub: '+12%', color: 'text-emerald-500' },
    { label: 'Active Now', value: users.filter(u=>u.active).length, icon: '●' },
    { label: 'Admin Seats', value: `${users.filter(u=>u.role==='ADMIN').length} / ${Math.max(users.filter(u=>u.role==='ADMIN').length, 10)}` },
    { label: 'Pending Invites', value: 0 },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="mt-1 text-slate-500 text-sm">Manage organization members, roles, and access permissions.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-700 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span className="flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            Invite New User
          </span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
              {s.sub && <span className="text-xs font-bold text-emerald-500">{s.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Create New User</h3>
          {createError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{createError}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))}
                required placeholder="John Doe"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                required placeholder="john@company.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
              <input type="password" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))}
                required placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Role *</label>
              <select value={form.role} onChange={e => setForm(p=>({...p,role:e.target.value}))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {['ADMIN','SALES','FINANCE','PURCHASE','PRODUCTION'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={creating}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                {creating ? 'Creating...' : 'Create User'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-6 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Roles</option>
          {['ADMIN','SALES','FINANCE','PURCHASE','PRODUCTION'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Any Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="ml-auto flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Name', 'Email Address', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((user, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                          {user.name?.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${ROLE_STYLES[user.role] || 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-sm font-medium text-slate-700">
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-500" />
                        </button>
                        {openMenuId === user.id && (
                          <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-20 w-44 py-1">
                            <button
                              onClick={() => handleToggle(user)}
                              disabled={actionId === user.id}
                              className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium hover:bg-slate-50 ${user.active ? 'text-red-600' : 'text-emerald-600'}`}
                            >
                              {user.active ? <><UserX className="w-4 h-4" /> Deactivate</> : <><UserCheck className="w-4 h-4" /> Activate</>}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-800">{filtered.length > 0 ? (page-1)*PER_PAGE+1 : 0}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(page*PER_PAGE, filtered.length)}</span> of{' '}
                <span className="font-bold text-slate-800">{filtered.length}</span> results
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-500">‹</button>
                {Array.from({length: Math.min(totalPages,3)},(_,i)=>i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold ${page===p?'bg-indigo-600 text-white':'text-slate-600 hover:bg-white'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 text-slate-500">›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}