import axios from 'axios'
import { API_URL } from './apiConfig.js'

function mapLot(item) {
  return {
    id: item.Id,
    productId: item.ProductId,
    productName: item.ProductName,
    lotCode: item.LotCode,
    expirationDate: item.ExpirationDate,
    initialQuantity: item.InitialQuantity,
    available: item.AvailableQuantity,
  }
}

export async function getAvailableLots(productId) {
  const response = await axios.get(`${API_URL}/lotes?productId=${productId}`)
  return response.data.map(mapLot)
}

export async function getExpiringLots(days = 60) {
  const response = await axios.get(`${API_URL}/lotes/por-vencer?dias=${days}`)
  return response.data.map(mapLot)
}
