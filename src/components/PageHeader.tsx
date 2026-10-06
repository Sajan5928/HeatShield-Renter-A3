/* =============================================================
   PageHeader — Custom reusable UI component (BUS4012 Assignment 2)

   Standardises the heading area used across the three Heat Check
   information-entry screens.  Accepts step progress, a title,
   and a description, then renders them with the shared HeatShield
   visual design (typography, colour, and spacing tokens).

   Props
   -----
   step          – current step number  (e.g. 1)
   totalSteps    – total number of steps (e.g. 3)
   title         – main page heading text
   description   – explanatory text shown beneath the heading
   ============================================================= */

interface PageHeaderProps {
  step: number
  totalSteps: number
  title: string
  description: string
}

export default function PageHeader({ step, totalSteps, title, description }: PageHeaderProps) {
  return (
    <header>
      <p
        aria-label={`Step ${step} of ${totalSteps}`}
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-teal-700)',
          fontWeight: 600,
          marginBottom: 'var(--space-2)',
        }}
      >
        Step {step} of {totalSteps}
      </p>
      <h1 style={{ marginBottom: 'var(--space-2)' }}>{title}</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-6)' }}>
        {description}
      </p>
    </header>
  )
}
