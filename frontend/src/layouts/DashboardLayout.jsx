import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Boxes,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
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
      { to: '/', label: 'Inicio', icon: LayoutDashboard, module: 'dashboard' },
      { to: '/reportes', label: 'Reportes', icon: BarChart3, module: 'reports' },
    ],
  },
  {
    group: 'Operación',
    items: [
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
  '/': 'Inicio',
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
        <div className="px-2.5 pt-1.5 pb-5">
          <Logo tone="light" />
          <p className="mt-3 pl-[42px] text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Inventario
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto pb-4" aria-label="Menú principal">
          {menu.map((section) => (
            <div key={section.group} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-[10px] font-bold tracking-[0.18em] text-white/35 uppercase">
                {section.group}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all ${
                      isActive
                        ? 'brand-gradient text-white shadow-[0_10px_22px_rgba(214,54,98,0.32)]'
                        : 'text-white/65 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <span className="absolute top-1/2 left-1.5 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold-light" />
                      ) : null}
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3">
          <p className="text-[12.5px] font-semibold text-white/85">Candey Cosméticos</p>
          <p className="text-[11px] text-white/45">Candey App v1.0</p>
        </div>
      </aside>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setIsMenuOpen(false)} />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-[var(--sidebar-w)]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-line bg-white/85 px-5 backdrop-blur-md lg:px-7">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-body hover:border-candey/40 hover:text-candey lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <nav aria-label="Ubicación" className="min-w-0">
            <ol className="flex items-center gap-2 text-[13.5px] text-muted">
              <li>
                <a href="/" className="transition-colors hover:text-candey">
                  Candey
                </a>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li className="truncate text-[15px] font-semibold text-ink">{title}</li>
            </ol>
          </nav>

          <div className="flex-1" />

          <div className="hidden items-center gap-2 rounded-full border border-gold/35 bg-gold-50 px-3.5 py-1.5 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-dark" />
            <span className="text-[11.5px] font-semibold text-gold-dark">Modo visual · datos demo</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className="text-[14px] font-semibold text-ink">{profile.userName}</span>
              <span className="text-[12px] text-muted">{roleLabel(profile.role)}</span>
            </div>
            <Avatar className="h-10 w-10 ring-2 ring-gold/40 ring-offset-2 ring-offset-white">
              <AvatarFallback className="text-[12px]">{initials(profile.userName)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-danger/40 hover:bg-danger-bg hover:text-danger"
              onClick={logout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-7 pb-12 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
