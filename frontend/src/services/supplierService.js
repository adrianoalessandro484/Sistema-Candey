import axios from 'axios'
import { API_URL } from './apiConfig.js'
import { mapPagedResponse, pagedParams } from './pagination.js'

function mapSupplier(item) {
  return {
    id: item.Id,
    name: item.Name,
    taxId: item.TaxId,
    phone: item.Phone,
    email: item.Email,
    address: item.Address,
    active: item.IsActive,
  }
}

export async function getSuppliers(active = true) {
  const response = await axios.get(`${API_URL}/proveedores?active=${active}`)
  return response.data.map(mapSupplier)
}

export async function getAllSuppliers() {
  const response = await axios.get(`${API_URL}/proveedores`)
  return response.data.map(mapSupplier)
}

export async function getSuppliersPage(params) {
  const response = await axios.get(`${API_URL}/proveedores`, { params: pagedParams(params) })
  return mapPagedResponse(response.data, mapSupplier)
}

export async function createSupplier(supplier) {
  const response = await axios.post(`${API_URL}/proveedores`, {
    Name: supplier.name,
    TaxId: supplier.taxId,
    Phone: supplier.phone,
    Email: supplier.email,
    Address: supplier.address,
    IsActive: supplier.active,
  })
  return mapSupplier(response.data)
}

export async function updateSupplier(id, supplier) {
  const response = await axios.put(`${API_URL}/proveedores/${id}`, {
    Name: supplier.name,
    TaxId: supplier.taxId,
    Phone: supplier.phone,
    Email: supplier.email,
    Address: supplier.address,
    IsActive: supplier.active,
  })
  return mapSupplier(response.data)
}

export function changeSupplierStatus(id, active) {
  return axios.patch(`${API_URL}/proveedores/${id}/estado`, { IsActive: active })
}

export function deleteSupplier(id) {
  return axios.delete(`${API_URL}/proveedores/${id}`)
}
