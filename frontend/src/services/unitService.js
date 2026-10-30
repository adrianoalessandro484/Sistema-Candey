import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapUnit(item) {
  return {
    id: item.Id,
    name: item.Name,
    abbreviation: item.Abbreviation,
    factor: item.Factor,
    active: item.IsActive,
  }
}

export async function getUnits(active = true) {
  const response = await axios.get(`${API_URL}/unidades?active=${active}`)
  return response.data.map(mapUnit)
}

export async function getAllUnits() {
  const response = await axios.get(`${API_URL}/unidades`)
  return response.data.map(mapUnit)
}

export async function getUnitsPage(params) {
  const response = await axios.get(`${API_URL}/unidades`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapUnit)
}

export async function createUnit(unit) {
  const response = await axios.post(`${API_URL}/unidades`, {
    Name: unit.name,
    Abbreviation: unit.abbreviation,
    Factor: unit.factor,
    IsActive: unit.active,
  })
  return mapUnit(response.data)
}

export async function updateUnit(id, unit) {
  const response = await axios.put(`${API_URL}/unidades/${id}`, {
    Name: unit.name,
    Abbreviation: unit.abbreviation,
    Factor: unit.factor,
    IsActive: unit.active,
  })
  return mapUnit(response.data)
}

export function changeUnitStatus(id, active) {
  return axios.patch(`${API_URL}/unidades/${id}/estado`, { IsActive: active })
}

export function deleteUnit(id) {
  return axios.delete(`${API_URL}/unidades/${id}`)
}
