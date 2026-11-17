import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapUser(item) {
  return {
    id: item.Id,
    userName: item.UserName,
    role: item.Role,
    hasAccess: item.HasAccess,
    branchId: item.BranchId ?? null,
    branchName: item.BranchName ?? null,
    createdAt: item.CreatedAt,
  }
}

export async function getUsers() {
  const response = await axios.get(`${API_URL}/usuarios`)
  return response.data.map(mapUser)
}

export async function getUsersPage(params) {
  const response = await axios.get(`${API_URL}/usuarios`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapUser)
}

export async function createUser(user) {
  const response = await axios.post(`${API_URL}/usuarios`, {
    UserName: user.userName,
    Password: user.password,
    Role: user.role,
    BranchId: user.role === 'BranchClerk' && user.branchId ? Number(user.branchId) : null,
  })
  return mapUser(response.data)
}

export async function updateUser(id, user) {
  const response = await axios.put(`${API_URL}/usuarios/${id}`, {
    UserName: user.userName,
    Password: user.password,
    Role: user.role,
    BranchId: user.role === 'BranchClerk' && user.branchId ? Number(user.branchId) : null,
  })
  return mapUser(response.data)
}

export function changeUserAccess(id, hasAccess) {
  return axios.patch(`${API_URL}/usuarios/${id}/acceso`, { HasAccess: hasAccess })
}

export function deleteUser(id) {
  return axios.delete(`${API_URL}/usuarios/${id}`)
}
