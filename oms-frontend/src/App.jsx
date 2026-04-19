import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import OrdersPage from './pages/OrdersPage'
import BOMPage from './pages/BOMPage'
import PurchaseOrdersPage from './pages/PurchaseOrdersPage'
import InvoicePage from './pages/InvoicePage'
import PaymentPage from './pages/PaymentPage'
import ReportsPage from './pages/ReportsPage'
import UserManagement from './pages/UserManagement'
import Layout from './components/layout/Layout'

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        } />

        {/* ORDERS — all roles */}
        <Route path="/orders" element={
          <PrivateRoute allowedRoles={['ADMIN','SALES','PRODUCTION','PURCHASE','FINANCE']}>
            <Layout><OrdersPage /></Layout>
          </PrivateRoute>
        } />

        {/* BOM — ADMIN, PRODUCTION, PURCHASE */}
        <Route path="/bom" element={
          <PrivateRoute allowedRoles={['ADMIN','PRODUCTION','PURCHASE']}>
            <Layout><BOMPage /></Layout>
          </PrivateRoute>
        } />

        {/* PURCHASE ORDERS — ADMIN, PURCHASE */}
        <Route path="/purchase-orders" element={
          <PrivateRoute allowedRoles={['ADMIN','PURCHASE']}>
            <Layout><PurchaseOrdersPage /></Layout>
          </PrivateRoute>
        } />

        {/* INVOICES — ADMIN, FINANCE */}
        <Route path="/invoices" element={
          <PrivateRoute allowedRoles={['ADMIN','FINANCE']}>
            <Layout><InvoicePage /></Layout>
          </PrivateRoute>
        } />

        {/* PAYMENTS — ADMIN, FINANCE */}
        <Route path="/payments" element={
          <PrivateRoute allowedRoles={['ADMIN','FINANCE']}>
            <Layout><PaymentPage /></Layout>
          </PrivateRoute>
        } />

        {/* REPORTS — ADMIN, FINANCE */}
        <Route path="/reports" element={
          <PrivateRoute allowedRoles={['ADMIN','FINANCE']}>
            <Layout><ReportsPage /></Layout>
          </PrivateRoute>
        } />

        {/* USER MANAGEMENT — ADMIN only */}
        <Route path="/users" element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <Layout><UserManagement /></Layout>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  )
}