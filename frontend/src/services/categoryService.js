import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapCategory(item) {
  return {
    id: item.Id,
    name: item.Name,
    description: item.Description,
    active: item.IsActive,
  }
}

export async function getCategories(active = true) {
  const response = await axios.get(`${API_URL}/categorias?active=${active}`)
  return response.data.map(mapCategory)
}

export async function getAllCategories() {
  const response = await axios.get(`${API_URL}/categorias`)
  return response.data.map(mapCategory)
}

export async function getCategoriesPage(params) {
  const response = await axios.get(`${API_URL}/categorias`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapCategory)
}

export async function createCategory(category) {
  const response = await axios.post(`${API_URL}/categorias`, {
    Name: category.name,
    Description: category.description,
    IsActive: category.active,
  })
  return mapCategory(response.data)
}

export async function updateCategory(id, category) {
  const response = await axios.put(`${API_URL}/categorias/${id}`, {
    Name: category.name,
    Description: category.description,
    IsActive: category.active,
  })
  return mapCategory(response.data)
}

export function changeCategoryStatus(id, active) {
  return axios.patch(`${API_URL}/categorias/${id}/estado`, { IsActive: active })
}

export function deleteCategory(id) {
  return axios.delete(`${API_URL}/categorias/${id}`)
}
