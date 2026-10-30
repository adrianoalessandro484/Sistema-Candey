import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(60, 'El nombre no puede superar los 60 caracteres'),
  description: z.string().trim().max(200, 'Maximo 200 caracteres').optional(),
  active: z.boolean(),
})
