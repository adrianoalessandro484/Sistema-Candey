import { useState } from 'react'
import { Barcode, CalendarClock, CheckCircle2, Clock, PackageCheck, Store, Truck } from 'lucide-react'
import Badge from '../Badge.jsx'

const TABS = [
  { id: 'fefo', label: 'Control FEFO', icon: CalendarClock },
  { id: 'requests', label: 'Sucursales', icon: Store },
  { id: 'label', label: 'Etiqueta Code128', icon: Barcode },
]

const FEFO_LOTS = [
  {
    product: 'Sérum Facial Vitamina C 30 ml',
    lot: 'LOT-2608A',
    expires: '18/02/2027',
    units: 42,
    tone: 'warn',
    status: 'Prioridad FEFO',
  },
  {
    product: 'Labial Velvet Matte #04 Berry',
    lot: 'LOT-2611C',
    expires: '12/08/2027',
    units: 128,
    tone: 'ok',
    status: 'Stock óptimo',
  },
  {
    product: 'Crema Hidratante Ceramidas 50 g',
    lot: 'LOT-2609B',
    expires: '05/04/2027',
    units: 9,
    tone: 'danger',
    status: 'Stock bajo',
  },
]

const BRANCH_REQUESTS = [
  {
    code: 'REQ-041',
    branch: 'Sucursal Miraflores',
    detail: '4 productos · 36 unidades',
    tone: 'info',
    status: 'En camino',
    icon: Truck,
  },
  {
    code: 'REQ-040',
    branch: 'Sucursal San Isidro',
    detail: '6 productos · 54 unidades',
    tone: 'gold',
    status: 'Pendiente',
    icon: Clock,
  },
  {
    code: 'REQ-039',
    branch: 'Sucursal Surco',
    detail: '3 productos · 24 unidades',
    tone: 'ok',
    status: 'Recibido',
    icon: CheckCircle2,
  },
]

const BARCODE_BARS = [
  3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2,
]

export default function OperationsPreview() {
  const [activeTab, setActiveTab] = useState('fefo')

  return (
    <div className="overflow-hidden rounded-3xl border border-line-strong bg-surface">
      <div className="flex items-center justify-between gap-3 bg-wine px-5 py-3.5 text-white">
        <div className="flex items-center gap-2.5">
          <PackageCheck size={18} className="text-gold-light" />
          <span className="text-[13.5px] font-semibold tracking-tight">
            Consola operativa de almacén
          </span>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-gold-light">
          Vista demostrativa
        </span>
      </div>

      <div className="border-b border-line bg-surface-2 px-4 py-3">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-canvas p-1" role="tablist" aria-label="Vistas del sistema">
          {TABS.map(({ id, label, icon: Icon }) => {
            const selected = activeTab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[12.5px] font-semibold transition-colors ${
                  selected
                    ? 'bg-surface text-candey-dark ring-1 ring-line-strong'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === 'fefo' ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[12px] font-semibold text-muted">
              <span>Lotes ordenados por vencimiento</span>
              <span className="tabular-nums">3 registros de ejemplo</span>
            </div>
            <ul className="flex flex-col divide-y divide-line">
              {FEFO_LOTS.map((item) => (
                <li key={item.lot} className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-[14.5px] font-semibold text-ink">{item.product}</span>
                    <span className="text-[12.5px] text-muted tabular-nums">
                      {item.lot} · Vence {item.expires}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={item.tone} dot>
                      {item.status}
                    </Badge>
                    <span className="text-[12px] font-semibold text-ink tabular-nums">
                      {item.units} u. disp.
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeTab === 'requests' ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[12px] font-semibold text-muted">
              <span>Seguimiento de requerimientos</span>
              <span className="tabular-nums">Central → Sucursales</span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {BRANCH_REQUESTS.map(({ code, branch, detail, tone, status, icon: Icon }) => (
                <li
                  key={code}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-candey-50 text-candey">
                      <Icon size={17} />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[14px] font-bold text-ink">
                        {code} · {branch}
                      </span>
                      <span className="text-[12px] text-muted tabular-nums">{detail}</span>
                    </div>
                  </div>
                  <Badge tone={tone}>{status}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeTab === 'label' ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[12px] font-semibold text-muted">
              <span>Vista previa de etiqueta imprimible</span>
              <span>Formato Code128</span>
            </div>
            <div className="rounded-2xl border border-dashed border-line-strong bg-surface-2 p-5">
              <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
                <div>
                  <p className="text-[14px] font-bold text-ink">Sérum Facial Vitamina C 30 ml</p>
                  <p className="text-[12px] text-muted">Candey Cosméticos · Almacén Central</p>
                </div>
                <Badge tone="gold">Lote activo</Badge>
              </div>
              <div className="my-4 flex h-14 items-stretch justify-center gap-[2px] rounded-xl bg-white px-4 py-2.5 ring-1 ring-line">
                {BARCODE_BARS.map((width, index) => (
                  <span
                    key={index}
                    className={index % 2 === 0 ? 'bg-ink' : 'bg-transparent'}
                    style={{ width: `${width * 3}px` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[12.5px] font-semibold text-ink tabular-nums">
                <span>CAN-2026-L084</span>
                <span>Vence: 18/02/2027</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
