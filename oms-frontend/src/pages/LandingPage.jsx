import { Link } from 'react-router-dom'
import { ArrowRight, Check, Zap, BarChart3, FileText, AlertCircle, TrendingUp, ShoppingCart, Layers } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Monolith OMS</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 font-medium">Features</a>
          <a href="#workflow" className="text-sm text-slate-500 hover:text-slate-900 font-medium">Workflow</a>
          <a href="#why" className="text-sm text-slate-500 hover:text-slate-900 font-medium">Why OMS</a>
          <Link to="/login">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Order Management{' '}
            <span className="text-indigo-600">for Manufacturing</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            A specialized system to streamline your manufacturing lifecycle — from Bill of Materials to Final Payments. Manage orders, POs, and invoices in one curated workspace.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/login">
              <button className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Get Started
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-100 to-slate-100 rounded-3xl overflow-hidden shadow-2xl h-80">
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop"
            alt="Manufacturing"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* About */}
      <section className="px-8 py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">About OMS</p>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Architected for Efficiency</h2>
          <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">
            OMS was built to replace fragmented manual processes with a single source of truth. We reduce manual data entry by 60%, allowing your engineering and procurement teams to focus on quality rather than spreadsheets.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2 text-center">Precision Features</h2>
        <p className="text-center text-slate-400 mb-12">Modular components designed for complex workflows.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <FileText className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Order Management</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Track the entire lifecycle of manufacturing orders from initial request to final delivery with real-time status updates.
            </p>
          </div>
          <div className="bg-indigo-600 rounded-2xl p-8 text-white">
            <Zap className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">BOM Engine</h3>
            <p className="text-sm leading-relaxed opacity-90">
              Deep hierarchical Bill of Materials with intelligent component linking and inventory alignment.
            </p>
          </div>
          {[
            { icon: BarChart3, title: 'Purchase Orders', desc: 'Automated PO generation based on BOM requirements and vendor lists.' },
            { icon: FileText, title: 'Invoice & Payment', desc: 'Reconcile purchase orders with invoices and track payment schedules.' },
            { icon: TrendingUp, title: 'Advanced Reports', desc: 'Gain insights into production bottlenecks, vendor performance, and financial health.' },
          ].map(f => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <f.icon className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="px-8 py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2 text-center">The Monolithic Workflow</h2>
          <p className="text-center text-slate-400 mb-12 text-sm">Five integrated steps to modernize your manufacturing operations.</p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {[
              { step: 1, title: 'Create Order', desc: 'Define order details and requirements' },
              { step: 2, title: 'Generate BOM', desc: 'Auto-generate Bills of Materials' },
              { step: 3, title: 'Purchase', desc: 'Create and manage purchase orders' },
              { step: 4, title: 'Invoice', desc: 'Track and reconcile invoices' },
              { step: 5, title: 'Payment', desc: 'Process payments and settle accounts' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shadow-lg shadow-indigo-200">
                  {item.step}
                </div>
                <p className="font-bold text-slate-900 text-sm text-center">{item.title}</p>
                <p className="text-xs text-slate-400 text-center max-w-[120px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-12">Why Choose OMS?</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { icon: Zap, title: 'Significant Time Savings', desc: 'Automated workflows reduce redundant administration tasks.' },
              { icon: AlertCircle, title: 'Error Reduction', desc: 'Eliminate human entry errors through system-wide data validation.' },
              { icon: TrendingUp, title: 'Real-time Tracking', desc: 'Monitor every stage of production and procurement instantly.' },
              { icon: Check, title: 'Centralized System', desc: 'A single platform for all manufacturing operations data.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">System Status</h3>
            {[
              { name: 'Order Fulfilled', pct: 100 },
              { name: 'BOM Processing', pct: 85 },
              { name: 'Invoicing', pct: 75 },
            ].map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="text-sm text-slate-500">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-600">SYSTEM ACTIVE</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Secure Infrastructure — 99.9% Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 bg-gradient-to-r from-indigo-700 to-indigo-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-5xl font-extrabold mb-4">Ready to Modernize Your Manufacturing?</h2>
          <p className="text-xl opacity-80 mb-8 text-indigo-100">
            Join the OMS project and experience a cleaner, more efficient way to manage your enterprise orders.
          </p>
          <Link to="/login">
            <button className="px-8 py-3.5 bg-white text-indigo-700 font-bold text-base rounded-xl hover:bg-indigo-50 shadow-xl">
              Get Access Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-8 py-8 text-center">
        <p className="text-slate-400 text-sm">© 2025 Order Management System. All rights reserved.</p>
      </footer>
    </div>
  )
}