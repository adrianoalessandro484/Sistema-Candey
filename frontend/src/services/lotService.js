import axios from 'axios'
import { API_URL } from './apiConfig.js'

export async function getAvailableLots(productId) {
  const response = await axios.get(`${API_URL}/lotes?productId=${productId}`)
  return response.data.map((item) => ({
    id: item.Id,
    productId: item.ProductId,
    productName: item.ProductName,
    lotCode: item.LotCode,
    expirationDate: item.ExpirationDate,
    available: item.AvailableQuantity,
  }))
}
