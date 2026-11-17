import { z } from 'zod'
import { ROLES } from '../utils/roles.js'

function validateBranchForRole(data, ctx) {
  if (data.role === 'BranchClerk' && (!data.branchId || Number(data.branchId) <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['branchId'],
      message: 'Seleccione la sucursal asignada',
    })
  }
}

export const createUserSchema = z
  .object({
    userName: z.string().trim().min(1, 'El usuario es obligatorio').max(50),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(ROLES),
    branchId: z.coerce.number().optional().nullable(),
  })
  .superRefine(validateBranchForRole)

export const editUserSchema = z
  .object({
    userName: z.string().trim().min(1, 'El usuario es obligatorio').max(50),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .optional()
      .or(z.literal('')),
    role: z.enum(ROLES),
    branchId: z.coerce.number().optional().nullable(),
  })
  .superRefine(validateBranchForRole)
