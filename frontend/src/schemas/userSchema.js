import { z } from 'zod'
import { ROLES } from '../utils/roles.js'

export const createUserSchema = z.object({
  userName: z.string().trim().min(1, 'El usuario es obligatorio').max(50),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  role: z.enum(ROLES),
})

export const editUserSchema = z.object({
  userName: z.string().trim().min(1, 'El usuario es obligatorio').max(50),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres').optional().or(z.literal('')),
  role: z.enum(ROLES),
})
