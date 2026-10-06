/* =============================================================
   NavigationButton — Custom reusable UI component (BUS4012 Assignment 2)

   Standardises the Back, Next, and other primary/secondary
   navigation buttons used across the HeatShield Renter user
   journey.  Accepts strongly-typed props for children, variant
   (primary or secondary), onClick, and optional disabled and
   type props.

   The button renders a semantic HTML <button> element and maps
   the variant prop to the existing btn-primary / btn-secondary
   CSS classes from global.css, preserving the HeatShield visual
   design (teal primary, outlined secondary) and disabled styling.

   Props
   -----
   children  – button label content (text, icons, or JSX)
   variant   – "primary" (teal filled) or "secondary" (outlined)
   onClick   – optional click handler
   disabled  – optional disabled state (default false)
   type      – optional HTML button type (default "button")
   ============================================================= */

import type { ReactNode } from 'react'

interface NavigationButtonProps {
  children: ReactNode
  variant: 'primary' | 'secondary'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function NavigationButton({
  children,
  variant,
  onClick,
  disabled = false,
  type = 'button',
}: NavigationButtonProps) {
  const className = variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary'

  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
