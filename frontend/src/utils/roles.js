export const ROLES = ['Administrator', 'EntryClerk', 'ExitClerk']

export const ROLE_LABELS = {
  Administrator: 'Administrador',
  EntryClerk: 'Técnico de Entrada',
  ExitClerk: 'Técnico de Salida',
}

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role
}
