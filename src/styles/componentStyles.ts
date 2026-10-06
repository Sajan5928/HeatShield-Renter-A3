import type { CSSProperties } from 'react'

export const radioBase: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--space-2)',
  padding: 'var(--space-3)',
  border: '1.5px solid var(--color-gray-200)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease',
  marginBottom: 'var(--space-2)',
  background: 'var(--color-white)',
}

export function radioSelected(base: CSSProperties): CSSProperties {
  return { ...base, borderColor: 'var(--color-teal-500)', background: 'var(--color-teal-100)' }
}

export const checkboxBase: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-2) var(--space-3)',
  cursor: 'pointer',
}

export const controlColors: Record<string, { bg: string; color: string }> = {
  'You can act': { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  'Check permission': { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  'Rental provider action': { bg: 'var(--color-coral-100)', color: 'var(--color-coral-700)' },
}
