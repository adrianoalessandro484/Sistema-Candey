import axios from 'axios'
import { API_URL } from './apiConfig.js'

export async function login({ userName, password }) {
  const response = await axios.post(`${API_URL}/sesion/iniciar`, {
    UserName: userName,
    Password: password,
  })

  return {
    token: response.data.Token,
    userId: response.data.UserId,
    userName: response.data.UserName,
    role: response.data.Role,
    branchId: response.data.BranchId ?? null,
    branchName: response.data.BranchName ?? null,
  }
}
