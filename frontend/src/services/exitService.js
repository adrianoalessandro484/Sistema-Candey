import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapLine(item) {
  return {
    productId: item.ProductId,
    productName: item.ProductName,
    lotId: item.LotId,
    lotCode: item.LotCode,
    quantity: item.Quantity,
  }
}

function mapExit(item) {
  return {
    id: item.Id,
    code: item.Code,
    date: item.Date,
    reason: item.Reason,
    branchId: item.BranchId,
    branchName: item.BranchName,
    note: item.Note,
    userId: item.UserId,
    status: item.Status,
    totalUnits: item.TotalUnits,
    lines: (item.Lines ?? []).map(mapLine),
  }
}

export async function getExits() {
  const response = await axios.get(`${API_URL}/salidas`)
  return response.data.map(mapExit)
}

export async function getExitsPage(params) {
  const response = await axios.get(`${API_URL}/salidas`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapExit)
}

export async function getExitById(id) {
  const response = await axios.get(`${API_URL}/salidas/${id}`)
  return mapExit(response.data)
}

export async function createExit(exit) {
  const response = await axios.post(`${API_URL}/salidas`, {
    Date: exit.date,
    Reason: exit.reason,
    BranchId: exit.branchId,
    Note: exit.note,
    Lines: exit.lines.map((line) => ({
      ProductId: line.productId,
      LotId: line.lotId,
      Quantity: line.quantity,
    })),
  })
  return mapExit(response.data)
}

export function cancelExit(id) {
  return axios.patch(`${API_URL}/salidas/${id}/anular`)
}
