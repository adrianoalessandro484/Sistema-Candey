import { z } from 'zod'

export const emptyBranchRequestLine = {
  productId: '',
  quantity: 1,
}

const requestLineSchema = z.object({
  productId: z.coerce.number().int().positive('Seleccione un producto'),
  quantity: z.coerce.number().int('Debe ser un número entero').positive('Debe ser mayor a cero'),
})

export const createBranchRequestSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  branchId: z.coerce.number().optional().nullable(),
  note: z.string().trim().max(250, 'Máximo 250 caracteres').optional(),
  lines: z.array(requestLineSchema).min(1, 'Agregue al menos un producto'),
})

const approveLineSchema = z.object({
  productId: z.coerce.number().int().positive('Producto inválido'),
  lotId: z.coerce.number().int().positive('Seleccione un lote'),
  quantity: z.coerce.number().int('Debe ser un número entero').positive('Debe ser mayor a cero'),
})

export const approveBranchRequestSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  note: z.string().trim().max(200, 'Máximo 200 caracteres').optional(),
  lines: z.array(approveLineSchema).min(1, 'Asigne al menos un lote'),
})

export const rejectBranchRequestSchema = z.object({
  reason: z.string().trim().min(3, 'Indique el motivo del rechazo').max(250, 'Máximo 250 caracteres'),
})

export const receptionSchema = z
  .object({
    hasIncident: z.boolean(),
    note: z.string().trim().max(250, 'Máximo 250 caracteres').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasIncident && (!data.note || data.note.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['note'],
        message: 'Describe la incidencia o faltante detectado',
      })
    }
  })
