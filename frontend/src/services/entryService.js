import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapLine(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    lotCode: item.LotCode,
    expirationDate: item.ExpirationDate,
    quantity: item.Quantity,
    unitCost: item.UnitCost,
  }
}

function mapEntry(item) {
  return {
    id: item.Id,
    code: item.Code,
    date: item.Date,
    supplierId: item.SupplierId,
    supplierName: item.SupplierName,
    note: item.Note,
    userId: item.UserId,
    status: item.Status,
    totalUnits: item.TotalUnits,
    totalCost: item.TotalCost,
    lines: (item.Lines ?? []).map(mapLine),
  }
}

export async function getEntries() {
  const response = await axios.get(`${API_URL}/entradas`)
  return response.data.map(mapEntry)
}

export async function getEntriesPage(params) {
  const response = await axios.get(`${API_URL}/entradas`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapEntry)
}

export async function createEntry(entry) {
  const response = await axios.post(`${API_URL}/entradas`, {
    Date: entry.date,
    SupplierId: entry.supplierId,
    Note: entry.note,
    Lines: entry.lines.map((line) => ({
      ProductId: line.productId,
      LotCode: line.lotCode,
      ExpirationDate: line.expirationDate || null,
      Quantity: line.quantity,
      UnitCost: line.unitCost,
    })),
  })
  return mapEntry(response.data)
}

export function cancelEntry(id) {
  return axios.patch(`${API_URL}/entradas/${id}/anular`)
}

