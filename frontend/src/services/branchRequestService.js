import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapLine(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    unitName: item.UnitName,
    requestedQuantity: item.RequestedQuantity,
    currentStock: item.CurrentStock,
  }
}

function mapRequest(item) {
  return {
    id: item.Id,
    code: item.Code,
    date: item.Date,
    branchId: item.BranchId,
    branchName: item.BranchName,
    requestedByUserId: item.RequestedByUserId,
    requestedByUserName: item.RequestedByUserName,
    note: item.Note,
    status: item.Status,
    reviewedByUserId: item.ReviewedByUserId,
    reviewedByUserName: item.ReviewedByUserName,
    reviewedAt: item.ReviewedAt,
    rejectionReason: item.RejectionReason,
    exitId: item.ExitId,
    exitCode: item.ExitCode,
    dispatchedAt: item.DispatchedAt,
    receivedByUserId: item.ReceivedByUserId,
    receivedByUserName: item.ReceivedByUserName,
    receivedAt: item.ReceivedAt,
    receptionNote: item.ReceptionNote,
    totalUnits: item.TotalUnits,
    lines: (item.Lines ?? []).map(mapLine),
  }
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString()
  return value.includes('T') ? value : `${value}T00:00:00Z`
}

export async function getBranchRequests({ status, branchId } = {}) {
  const response = await axios.get(`${API_URL}/requerimientos`, {
    params: {
      status: status || undefined,
      branchId: branchId || undefined,
    },
  })
  return response.data.map(mapRequest)
}

export async function getBranchRequestsPage({ page, pageSize, search, status, branchId } = {}) {
  const response = await axios.get(`${API_URL}/requerimientos`, {
    params: {
      ...pagedParams({ page, pageSize, search }),
      status: status || undefined,
      branchId: branchId || undefined,
    },
  })
  return mapPagedResponse(response.data, mapRequest)
}

export async function getBranchRequestById(id) {
  const response = await axios.get(`${API_URL}/requerimientos/${id}`)
  return mapRequest(response.data)
}

export async function createBranchRequest(payload) {
  const response = await axios.post(`${API_URL}/requerimientos`, {
    Date: toIsoDate(payload.date),
    BranchId: payload.branchId ? Number(payload.branchId) : null,
    Note: payload.note?.trim() || null,
    Lines: payload.lines.map((line) => ({
      ProductId: Number(line.productId),
      Quantity: Number(line.quantity),
    })),
  })
  return mapRequest(response.data)
}

export async function approveBranchRequest(id, payload) {
  const response = await axios.post(`${API_URL}/requerimientos/${id}/aprobar`, {
    Date: toIsoDate(payload.date),
    Note: payload.note?.trim() || null,
    Lines: payload.lines.map((line) => ({
      ProductId: Number(line.productId),
      LotId: Number(line.lotId),
      Quantity: Number(line.quantity),
    })),
  })
  return mapRequest(response.data)
}

export function rejectBranchRequest(id, reason) {
  return axios.patch(`${API_URL}/requerimientos/${id}/rechazar`, {
    Reason: reason.trim(),
  })
}

export function cancelBranchRequest(id) {
  return axios.patch(`${API_URL}/requerimientos/${id}/cancelar`)
}

export function confirmBranchRequestReception(id, { hasIncident, note }) {
  return axios.patch(`${API_URL}/requerimientos/${id}/recepcion`, {
    HasIncident: Boolean(hasIncident),
    Note: note?.trim() || null,
  })
}
