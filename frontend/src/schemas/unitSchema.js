import { z } from 'zod'

export const unitSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  abbreviation: z.string().trim().min(1, 'La abreviatura es obligatoria').max(5),
  factor: z.coerce.number().int('Debe ser un numero entero').positive('Debe ser mayor a cero'),
  active: z.boolean(),
})
