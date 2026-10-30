export const MODULES = {
  dashboard: { label: 'Inicio', roles: ['Administrator', 'EntryClerk', 'ExitClerk'] },
  reports: { label: 'Reportes', roles: ['Administrator'] },
  entries: { label: 'Entradas', roles: ['Administrator', 'EntryClerk'] },
  exits: { label: 'Salidas', roles: ['Administrator', 'ExitClerk'] },
  products: { label: 'Productos', roles: ['Administrator'] },
  categories: { label: 'Categorías', roles: ['Administrator'] },
  units: { label: 'Unidades', roles: ['Administrator'] },
  users: { label: 'Usuarios', roles: ['Administrator'] },
  suppliers: { label: 'Proveedores', roles: ['Administrator', 'ExitClerk'] },
  branches: { label: 'Sucursales', roles: ['Administrator', 'ExitClerk'] },
}

export const ACTIONS = {
  'entries.manage': ['Administrator', 'EntryClerk'],
  'exits.manage': ['Administrator', 'ExitClerk'],
  'products.manage': ['Administrator'],
  'categories.manage': ['Administrator'],
  'units.manage': ['Administrator'],
  'users.manage': ['Administrator'],
  'suppliers.manage': ['Administrator', 'ExitClerk'],
  'branches.manage': ['Administrator', 'ExitClerk'],
  'reports.view': ['Administrator'],
}

export function hasRole(role, allowedRoles = []) {
  return Boolean(role) && allowedRoles.includes(role)
}

export function canAccessModule(role, module) {
  return hasRole(role, MODULES[module]?.roles ?? [])
}

export function can(role, action) {
  return hasRole(role, ACTIONS[action] ?? [])
}

export function isAdministrator(role) {
  return role === 'Administrator'
}

export function homePathFor(role) {
  if (role === 'EntryClerk') return '/entradas'
  if (role === 'ExitClerk') return '/salidas'
  return '/'
}
