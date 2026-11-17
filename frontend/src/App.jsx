import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from './context/SessionProvider.jsx'
import { useSession } from './context/sessionContext.js'
import LoginPage from './pages/LoginPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import UnitsPage from './pages/UnitsPage.jsx'
import EntriesPage from './pages/EntriesPage.jsx'
import ExitsPage from './pages/ExitsPage.jsx'
import SuppliersPage from './pages/SuppliersPage.jsx'
import BranchesPage from './pages/BranchesPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import BranchRequestsPage from './pages/BranchRequestsPage.jsx'
import EntryOrdersPage from './pages/EntryOrdersPage.jsx'
import { ToastProvider } from './components/toast/ToastProvider.jsx'
import { homePathFor } from './utils/permissions.js'

function ProtectedLayout() {
  const { user } = useSession()
  return user ? <DashboardLayout /> : <Navigate to="/autenticacion" replace />
}

function RoleRoute({ roles, children }) {
  const { user } = useSession()

  if (!user) {
    return <Navigate to="/autenticacion" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <ToastProvider>
          <div className="app">
            <Routes>
              <Route path="/autenticacion" element={<LoginPage />} />

              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route
                  path="/requerimientos"
                  element={
                    <RoleRoute roles={['Administrator', 'ExitClerk', 'BranchClerk']}>
                      <BranchRequestsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/ordenes-ingreso"
                  element={
                    <RoleRoute roles={['Administrator', 'EntryClerk']}>
                      <EntryOrdersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <RoleRoute roles={['Administrator']}>
                      <UsersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/productos"
                  element={
                    <RoleRoute roles={['Administrator', 'EntryClerk', 'ExitClerk', 'BranchClerk']}>
                      <ProductsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <RoleRoute roles={['Administrator']}>
                      <CategoriesPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/unidades"
                  element={
                    <RoleRoute roles={['Administrator']}>
                      <UnitsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/entradas"
                  element={
                    <RoleRoute roles={['Administrator', 'EntryClerk']}>
                      <EntriesPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/salidas"
                  element={
                    <RoleRoute roles={['Administrator', 'ExitClerk']}>
                      <ExitsPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <RoleRoute roles={['Administrator', 'ExitClerk', 'EntryClerk']}>
                      <SuppliersPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/sucursales"
                  element={
                    <RoleRoute roles={['Administrator', 'ExitClerk']}>
                      <BranchesPage />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/reportes"
                  element={
                    <RoleRoute roles={['Administrator']}>
                      <ReportsPage />
                    </RoleRoute>
                  }
                />
              </Route>

              <Route path="/login" element={<Navigate to="/autenticacion" replace />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/users" element={<Navigate to="/usuarios" replace />} />
              <Route path="/products" element={<Navigate to="/productos" replace />} />
              <Route path="/categories" element={<Navigate to="/categorias" replace />} />
              <Route path="/units" element={<Navigate to="/unidades" replace />} />
              <Route path="/entries" element={<Navigate to="/entradas" replace />} />
              <Route path="/exits" element={<Navigate to="/salidas" replace />} />
              <Route path="/suppliers" element={<Navigate to="/proveedores" replace />} />
              <Route path="/branches" element={<Navigate to="/sucursales" replace />} />
              <Route path="/reports" element={<Navigate to="/reportes" replace />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ToastProvider>
      </SessionProvider>
    </BrowserRouter>
  )
}
