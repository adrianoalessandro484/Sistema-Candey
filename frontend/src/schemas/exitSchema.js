import { z } from 'zod'
import { EXIT_REASONS } from '../utils/catalogs.js'

export const emptyExitLine = {
  productId: '',
  lotId: '',
  quantity: 1,
}

const lineSchema = z.object({
  productId: z.coerce.number().int().positive('Seleccione un producto'),
  lotId: z.coerce.number().int().positive('Seleccione el lote'),
  quantity: z.coerce.number().int('Debe ser un numero entero').positive('Debe ser mayor a cero'),
})

export const exitSchema = z.object({
  reason: z.enum(EXIT_REASONS),
  date: z.string().min(1, 'La fecha es obligatoria'),
  branchId: z.coerce.number().int().positive('Seleccione una sucursal'),
  note: z.string().trim().max(200, 'Maximo 200 caracteres').optional(),
  lines: z.array(lineSchema).min(1, 'Agregue al menos un producto'),
})
