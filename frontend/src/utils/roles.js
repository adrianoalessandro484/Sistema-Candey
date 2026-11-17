export const ROLES = ['Administrator', 'EntryClerk', 'ExitClerk', 'BranchClerk']

export const ROLE_LABELS = {
  Administrator: 'Administrador',
  EntryClerk: 'Técnico de Entrada',
  ExitClerk: 'Técnico de Salida',
  BranchClerk: 'Encargado de Sucursal',
}

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role
}
