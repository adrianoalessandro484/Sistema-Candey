import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapProduct(item) {
  return {
    id: item.Id,
    name: item.Name,
    description: item.Description,
    categoryId: item.CategoryId,
    categoryName: item.CategoryName,
    unitId: item.UnitId,
    unitName: item.UnitName,
    minStock: item.MinStock,
    stock: item.Stock,
    price: item.Price,
    active: item.IsActive,
  }
}

export async function getProducts(active = true) {
  const response = await axios.get(`${API_URL}/productos?active=${active}`)
  return response.data.map(mapProduct)
}

export async function getAllProducts() {
  const response = await axios.get(`${API_URL}/productos`)
  return response.data.map(mapProduct)
}

export async function getProductsPage(params) {
  const response = await axios.get(`${API_URL}/productos`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapProduct)
}

export async function createProduct(product) {
  const response = await axios.post(`${API_URL}/productos`, {
    Name: product.name,
    Description: product.description,
    CategoryId: product.categoryId,
    UnitId: product.unitId,
    MinStock: product.minStock,
    Price: product.price,
    IsActive: product.active,
  })
  return mapProduct(response.data)
}

export async function updateProduct(id, product) {
  const response = await axios.put(`${API_URL}/productos/${id}`, {
    Name: product.name,
    Description: product.description,
    CategoryId: product.categoryId,
    UnitId: product.unitId,
    MinStock: product.minStock,
    Price: product.price,
    IsActive: product.active,
  })
  return mapProduct(response.data)
}

export function changeProductStatus(id, active) {
  return axios.patch(`${API_URL}/productos/${id}/estado`, { IsActive: active })
}

export function deleteProduct(id) {
  return axios.delete(`${API_URL}/productos/${id}`)
}
