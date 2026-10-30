import { useState } from 'react'
import {
  ArrowLeftRight,
  CircleAlert,
  CircleCheck,
  Coins,
  MessageCircle,
  Package,
  Printer,
  RotateCw,
  TriangleAlert,
} from 'lucide-react'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { formatCurrency } from '../utils/format.js'
import { generateRequestPdf } from '../utils/pdf.js'
import { useReports } from '../hooks/useReports.js'
import StockTable from '../components/reports/StockTable.jsx'
import RotationTable from '../components/reports/RotationTable.jsx'
import AlertsTable from '../components/reports/AlertsTable.jsx'

const TABS = [
  { id: 'stock', label: 'Control de existencias', icon: Package },
  { id: 'rotation', label: 'Rotación', icon: ArrowLeftRight },
  { id: 'alerts', label: 'Alertas preventivas', icon: TriangleAlert },
]

function shareByWhatsApp(items) {
  const detail = items
    .map((item) => `- ${item.productName}: stock ${item.stock} (mínimo ${item.minStock})`)
    .join('\n')
  const text = `Solicitud de reposición de productos - Candey\n${detail}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

export default function ReportsPage() {
  const { report, loading, error, reload } = useReports()
  const [tab, setTab] = useState('stock')

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Análisis"
          title="Reportes"
          description="Existencias, rotación y alertas del inventario."
        />
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-16 text-sm text-muted">
          <Spinner className="size-5 text-candey" />
          Generando reportes...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Análisis"
        title="Reportes"
        description="Existencias, rotación y alertas del inventario."
      >
        <Button variant="secondary" onClick={reload}>
          <RotateCw size={16} />
          Actualizar
        </Button>
      </PageHeader>

      {error ? (
        <div className="flex flex-col gap-3 rounded-xl border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={reload} className="w-full sm:w-auto">
            <RotateCw size={16} />
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Productos"
          value={String(report.summary.totalProducts)}
          tone="candey"
        />
        <StatCard
          icon={Coins}
          label="Valor del inventario"
          value={formatCurrency(report.summary.inventoryValue)}
          tone="gold"
        />
        <StatCard
          icon={TriangleAlert}
          label="Stock bajo"
          value={String(report.summary.lowStock)}
          tone="warn"
        />
        <StatCard
          icon={CircleAlert}
          label="Sin stock"
          value={String(report.summary.outOfStock)}
          tone="danger"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <div
            role="tablist"
            aria-label="Secciones del reporte"
            className="inline-flex h-auto min-w-max items-center gap-1 rounded-2xl border border-line-strong bg-surface p-1.5 shadow-sm"
          >
            {TABS.map((item) => {
              const Icon = item.icon
              const isActive = tab === item.id
              const showCount = item.id === 'alerts' && report.alerts.length > 0

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(item.id)}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[14px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-wine text-white shadow-sm hover:bg-wine'
                      : 'text-body hover:bg-candey-50 hover:text-candey-dark'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {showCount ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive ? 'bg-white text-wine' : 'bg-danger text-white'
                      }`}
                    >
                      {report.alerts.length}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        {tab === 'stock' ? <StockTable items={report.stock} /> : null}
        {tab === 'rotation' ? <RotationTable items={report.rotation} /> : null}
        {tab === 'alerts' ? (
          report.alerts.length === 0 ? (
            <EmptyState
              icon={CircleCheck}
              title="Sin alertas"
              description="Ningún producto está por debajo de su stock mínimo."
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3 shadow-sm sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-4">
                <Button
                  variant="secondary"
                  onClick={() => shareByWhatsApp(report.alerts)}
                  className="w-full sm:w-auto"
                >
                  <MessageCircle size={16} />
                  Enviar por WhatsApp
                </Button>
                <Button onClick={() => generateRequestPdf(report.alerts)} className="w-full sm:w-auto">
                  <Printer size={16} />
                  Solicitud (PDF)
                </Button>
              </div>
              <AlertsTable items={report.alerts} />
            </div>
          )
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Reporte generado con {report.summary.totalProducts} productos y {report.summary.units} unidades
        en inventario.
      </p>
    </div>
  )
}
