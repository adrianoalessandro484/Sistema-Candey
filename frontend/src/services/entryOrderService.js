import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapLine(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    unitName: item.UnitName,
    requestedQuantity: item.RequestedQuantity,
  }
}

function mapOrder(item) {
  return {
    id: item.Id,
    code: item.Code,
    orderDate: item.OrderDate,
    expectedDate: item.ExpectedDate,
    supplierId: item.SupplierId,
    supplierName: item.SupplierName,
    createdByUserId: item.CreatedByUserId,
    createdByUserName: item.CreatedByUserName,
    note: item.Note,
    status: item.Status,
    entryId: item.EntryId,
    entryCode: item.EntryCode,
    receivedByUserId: item.ReceivedByUserId,
    receivedByUserName: item.ReceivedByUserName,
    receivedAt: item.ReceivedAt,
    totalUnits: item.TotalUnits,
    lines: (item.Lines ?? []).map(mapLine),
  }
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString()
  return value.includes('T') ? value : `${value}T00:00:00Z`
}

export async function getEntryOrders({ status } = {}) {
  const response = await axios.get(`${API_URL}/ordenes-ingreso`, {
    params: { status: status || undefined },
  })
  return response.data.map(mapOrder)
}

export async function getEntryOrdersPage({ page, pageSize, search, status } = {}) {
  const response = await axios.get(`${API_URL}/ordenes-ingreso`, {
    params: {
      ...pagedParams({ page, pageSize, search }),
      status: status || undefined,
    },
  })
  return mapPagedResponse(response.data, mapOrder)
}

export async function getEntryOrderById(id) {
  const response = await axios.get(`${API_URL}/ordenes-ingreso/${id}`)
  return mapOrder(response.data)
}

export async function createEntryOrder(payload) {
  const response = await axios.post(`${API_URL}/ordenes-ingreso`, {
    SupplierId: Number(payload.supplierId),
    OrderDate: toIsoDate(payload.orderDate),
    ExpectedDate: payload.expectedDate ? toIsoDate(payload.expectedDate) : null,
    Note: payload.note?.trim() || null,
    Lines: payload.lines.map((line) => ({
      ProductId: Number(line.productId),
      Quantity: Number(line.quantity),
    })),
  })
  return mapOrder(response.data)
}

export async function receiveEntryOrder(id, payload) {
  const response = await axios.post(`${API_URL}/ordenes-ingreso/${id}/recibir`, {
    Date: toIsoDate(payload.date),
    Note: payload.note?.trim() || null,
    Lines: payload.lines.map((line) => ({
      ProductId: Number(line.productId),
      LotCode: line.lotCode.trim(),
      ExpirationDate: line.expirationDate || null,
      Quantity: Number(line.quantity),
      UnitCost: Number(line.unitCost),
    })),
  })
  return mapOrder(response.data)
}

export function cancelEntryOrder(id) {
  return axios.patch(`${API_URL}/ordenes-ingreso/${id}/cancelar`)
}
