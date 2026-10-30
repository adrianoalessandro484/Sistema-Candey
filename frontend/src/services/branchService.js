import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapBranch(item) {
  return {
    id: item.Id,
    name: item.Name,
    address: item.Address,
    phone: item.Phone,
    active: item.IsActive,
  }
}

export async function getBranches(active = true) {
  const response = await axios.get(`${API_URL}/sucursales?active=${active}`)
  return response.data.map(mapBranch)
}

export async function getAllBranches() {
  const response = await axios.get(`${API_URL}/sucursales`)
  return response.data.map(mapBranch)
}

export async function getBranchesPage(params) {
  const response = await axios.get(`${API_URL}/sucursales`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapBranch)
}

export async function createBranch(branch) {
  const response = await axios.post(`${API_URL}/sucursales`, {
    Name: branch.name,
    Address: branch.address,
    Phone: branch.phone,
    IsActive: branch.active,
  })
  return mapBranch(response.data)
}

export async function updateBranch(id, branch) {
  const response = await axios.put(`${API_URL}/sucursales/${id}`, {
    Name: branch.name,
    Address: branch.address,
    Phone: branch.phone,
    IsActive: branch.active,
  })
  return mapBranch(response.data)
}

export function changeBranchStatus(id, active) {
  return axios.patch(`${API_URL}/sucursales/${id}/estado`, { IsActive: active })
}

export function deleteBranch(id) {
  return axios.delete(`${API_URL}/sucursales/${id}`)
}
