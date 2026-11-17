import { z } from 'zod'

export const emptyOrderLine = {
  productId: '',
  quantity: 1,
}

const orderLineSchema = z.object({
  productId: z.coerce.number().int().positive('Seleccione un producto'),
  quantity: z.coerce.number().int('Debe ser un número entero').positive('Debe ser mayor a cero'),
})

export const createEntryOrderSchema = z.object({
  supplierId: z.coerce.number().int().positive('Seleccione un proveedor'),
  orderDate: z.string().min(1, 'La fecha es obligatoria'),
  expectedDate: z.string().optional(),
  note: z.string().trim().max(250, 'Máximo 250 caracteres').optional(),
  lines: z.array(orderLineSchema).min(1, 'Agregue al menos un producto'),
})

const receiveLineSchema = z.object({
  productId: z.coerce.number().int().positive('Seleccione un producto'),
  lotCode: z.string().trim().min(1, 'Indique el lote'),
  quantity: z.coerce.number().int('Debe ser un número entero').positive('Debe ser mayor a cero'),
  unitCost: z.coerce.number().min(0, 'No puede ser negativo'),
  expirationDate: z.string().optional(),
})

export const receiveEntryOrderSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  note: z.string().trim().max(200, 'Máximo 200 caracteres').optional(),
  lines: z.array(receiveLineSchema).min(1, 'Agregue al menos un lote'),
})
