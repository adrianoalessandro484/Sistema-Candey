import { z } from 'zod'

export const branchSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  address: z.string().trim().max(200, 'Maximo 200 caracteres').optional(),
  phone: z.string().trim().max(20, 'Maximo 20 caracteres').optional(),
  active: z.boolean(),
})
