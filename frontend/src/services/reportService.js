import axios from 'axios'
import { API_URL } from './apiConfig.js'

function buildRangeQuery({ from, to } = {}) {
  const params = []
  if (from) params.push(`from=${from}`)
  if (to) params.push(`to=${to}`)
  return params.length > 0 ? `?${params.join('&')}` : ''
}

function mapSummary(summary) {
  return {
    totalProducts: summary.TotalProducts,
    units: summary.Units,
    inventoryValue: summary.InventoryValue,
    lowStock: summary.LowStock,
    outOfStock: summary.OutOfStock,
  }
}

function mapStock(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    categoryName: item.CategoryName,
    unitName: item.UnitName,
    stock: item.Stock,
    minStock: item.MinStock,
    price: item.Price,
    value: item.Value,
  }
}

function mapLevel(level) {
  const labels = {
    Alta: { label: 'Alta', tone: 'ok' },
    Media: { label: 'Media', tone: 'info' },
    Baja: { label: 'Baja', tone: 'warn' },
    'Sin rotacion': { label: 'Sin rotacion', tone: 'neutral' },
  }
  return labels[level] ?? { label: level, tone: 'neutral' }
}

function mapRotation(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    received: item.Received,
    issued: item.Issued,
    balance: item.Balance,
    level: mapLevel(item.Level),
  }
}

function mapAlert(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    categoryName: item.CategoryName,
    unitName: item.UnitName,
    stock: item.Stock,
    minStock: item.MinStock,
    missing: item.Missing,
  }
}

export async function getReportSummary(range = {}) {
  const response = await axios.get(`${API_URL}/reportes${buildRangeQuery(range)}`)
  const data = response.data

  return {
    summary: mapSummary(data.Summary),
    rotation: data.Rotation.map(mapRotation),
  }
}

export async function getAlerts() {
  const response = await axios.get(`${API_URL}/reportes/alertas`)
  return response.data.map(mapAlert)
}

export async function getReports(range = {}) {
  const response = await axios.get(`${API_URL}/reportes${buildRangeQuery(range)}`)
  const data = response.data

  return {
    summary: mapSummary(data.Summary),
    stock: data.Stock.map(mapStock),
    rotation: data.Rotation.map(mapRotation),
    alerts: data.Alerts.map(mapAlert),
  }
}
