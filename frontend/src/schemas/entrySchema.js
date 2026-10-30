import { z } from 'zod'

export const emptyEntryLine = {
  productId: '',
  lotCode: '',
  quantity: 1,
  unitCost: 0,
  expirationDate: '',
}

const lineSchema = z.object({
  productId: z.coerce.number().int().positive('Seleccione un producto'),
  lotCode: z.string().trim().min(1, 'Indique el lote'),
  quantity: z.coerce.number().int('Debe ser un numero entero').positive('Debe ser mayor a cero'),
  unitCost: z.coerce.number().min(0, 'No puede ser negativo'),
  expirationDate: z.string().optional(),
})

export const entrySchema = z.object({
  supplierId: z.coerce.number().int().positive('Seleccione un proveedor'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  note: z.string().trim().max(200, 'Maximo 200 caracteres').optional(),
  lines: z.array(lineSchema).min(1, 'Agregue al menos un producto'),
})
