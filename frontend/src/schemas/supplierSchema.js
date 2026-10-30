import { z } from 'zod'

export const supplierSchema = z.object({
  name: z.string().trim().min(1, 'La razon social es obligatoria'),
  taxId: z.string().trim().min(11, 'El RUC debe tener 11 digitos').max(11, 'El RUC debe tener 11 digitos'),
  phone: z.string().trim().max(20, 'Maximo 20 caracteres').optional(),
  email: z.string().trim().email('Ingrese un correo valido').optional().or(z.literal('')),
  address: z.string().trim().max(200, 'Maximo 200 caracteres').optional(),
  active: z.boolean(),
})
