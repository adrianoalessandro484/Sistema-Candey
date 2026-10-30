import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del producto es obligatorio')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
  description: z.string().trim().max(200, 'Maximo 200 caracteres').optional(),
  categoryId: z.coerce.number().int().positive('Seleccione una categoria'),
  unitId: z.coerce.number().int().positive('Seleccione una unidad'),
  minStock: z.coerce
    .number()
    .int('El stock minimo debe ser un numero entero')
    .min(0, 'No puede ser negativo'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  active: z.boolean(),
})
