import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Boxes,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  Store,
  Tag,
  Truck,
  Users,
  X,
} from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { Avatar, AvatarFallback } from '../components/Avatar.jsx'
import { useSession } from '../context/sessionContext.js'
import { initials } from '../utils/format.js'
import { roleLabel } from '../utils/roles.js'
import { canAccessModule } from '../utils/permissions.js'

const MENU = [
  {
    group: 'Resumen',
    items: [
      { to: '/inicio', label: 'Inicio', icon: LayoutDashboard, module: 'dashboard' },
      { to: '/reportes', label: 'Reportes', icon: BarChart3, module: 'reports' },
    ],
  },
  {
    group: 'Operación',
    items: [
      { to: '/requerimientos', label: 'Requerimientos', icon: ClipboardCheck, module: 'branchRequests' },
      { to: '/ordenes-ingreso', label: 'Órdenes de ingreso', icon: PackagePlus, module: 'entryOrders' },
      { to: '/entradas', label: 'Entradas', icon: ArrowDownToLine, module: 'entries' },
      { to: '/salidas', label: 'Salidas', icon: ArrowUpFromLine, module: 'exits' },
    ],
  },
  {
    group: 'Catálogo',
    items: [
      { to: '/productos', label: 'Productos', icon: Package, module: 'products' },
      { to: '/categorias', label: 'Categorías', icon: Tag, module: 'categories' },
      { to: '/unidades', label: 'Unidades', icon: Boxes, module: 'units' },
    ],
  },
  {
    group: 'Administración',
    items: [
      { to: '/usuarios', label: 'Usuarios', icon: Users, module: 'users' },
      { to: '/proveedores', label: 'Proveedores', icon: Truck, module: 'suppliers' },
      { to: '/sucursales', label: 'Sucursales', icon: Store, module: 'branches' },
    ],
  },
]

const PAGE_TITLES = {
  '/inicio': 'Inicio',
  '/requerimientos': 'Requerimientos',
  '/ordenes-ingreso': 'Órdenes de ingreso',
  '/usuarios': 'Usuarios',
  '/productos': 'Productos',
  '/categorias': 'Categorías',
  '/unidades': 'Unidades',
  '/entradas': 'Entradas',
  '/salidas': 'Salidas',
  '/proveedores': 'Proveedores',
  '/sucursales': 'Sucursales',
  '/reportes': 'Reportes',
}

export default function DashboardLayout() {
  const { user, closeSession } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const profile = user ?? { userName: 'Administrador', role: 'Administrator' }
  const title = PAGE_TITLES[location.pathname] ?? 'Inventario'
  const menu = MENU.map((section) => ({
    ...section,
    items: section.items.filter((item) => canAccessModule(profile.role, item.module)),
  })).filter((section) => section.items.length > 0)

  function logout() {
    closeSession()
    navigate('/autenticacion', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-w)] flex-col bg-[linear-gradient(180deg,var(--color-wine)_0%,var(--color-wine-dark)_100%)] px-4 py-5 text-white shadow-[18px_0_50px_-40px_rgba(38,10,22,0.9)] transition-transform duration-200 lg:translate-x-0 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-2 pt-1 pb-5">
          <Link
            to="/inicio"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 rounded-2xl p-1 transition-opacity hover:opacity-90"
          >
            <Logo compact />
            <div className="flex flex-col leading-tight">
              <span className="text-[18px] font-bold tracking-tight text-white">Candey</span>
              <span className="text-[11px] font-semibold tracking-[0.18em] text-gold-light/80 uppercase">
                Inventario
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú lateral"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto pb-4" aria-label="Menú principal">
          {menu.map((section) => (
            <div key={section.group} className="flex flex-col gap-1.5">
              <p className="px-3.5 pb-0.5 text-[10.5px] font-bold tracking-[0.18em] text-white/40 uppercase">
                {section.group}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex min-h-[46px] items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-[14.5px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'brand-gradient font-semibold text-white shadow-[0_10px_24px_rgba(214,54,98,0.36)]'
                        : 'text-white/72 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <span className="absolute top-1/2 left-1.5 h-5 w-1 -translate-y-1/2 rounded-full bg-gold-light" />
                      ) : null}
                      <item.icon size={20} className="shrink-0" />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-semibold text-white/90">Candey Cosméticos</p>
            <span className="h-2 w-2 rounded-full bg-gold-light" aria-hidden="true" />
          </div>
          <p className="mt-0.5 text-[11.5px] text-white/50">
            {profile.branchName ? profile.branchName : 'Control de almacén · v1.0'}
          </p>
        </div>
      </aside>

      {isMenuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-[var(--sidebar-w)]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center gap-3 border-b border-line bg-white/88 px-5 backdrop-blur-md lg:px-8">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-white text-body shadow-xs transition-colors hover:border-candey/45 hover:bg-candey-50 hover:text-candey lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <nav aria-label="Ubicación" className="min-w-0">
            <ol className="flex items-center gap-2 text-[14px] text-muted">
              <li>
                <Link to="/inicio" className="font-medium transition-colors hover:text-candey">
                  Candey
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={15} />
              </li>
              <li className="truncate text-[16px] font-bold text-ink">{title}</li>
            </ol>
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className="text-[14.5px] font-semibold text-ink">{profile.userName}</span>
              <span className="text-[12px] font-medium text-muted">
                {roleLabel(profile.role)}
                {profile.branchName ? ` · ${profile.branchName}` : ''}
              </span>
            </div>
            <Avatar className="h-11 w-11 ring-2 ring-gold/45 ring-offset-2 ring-offset-white">
              <AvatarFallback className="text-[13px] font-bold">{initials(profile.userName)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-3.5 text-[14px] font-semibold text-body shadow-xs transition-all hover:border-danger/45 hover:bg-danger-bg hover:text-danger active:scale-95"
              onClick={logout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-7 pb-14 lg:px-8">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
