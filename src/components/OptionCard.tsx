/* =============================================================
   OptionCard — Custom reusable UI component (BUS4012 Assignment 2)

   Standardises the selectable radio-option cards repeated across
   the three Heat Check information-entry screens.  Accepts the
   option value, display label, optional supporting description,
   a boolean indicating the selected state, an onSelect callback,
   and the radio-group name for accessible form semantics.

   Clicking anywhere on the card selects the option.  The card
   mirrors the existing HeatShield visual design (border, padding,
   border-radius, and selected-state teal border/background)
   by delegating to the shared radioBase / radioSelected styles
   from componentStyles.ts.

   Props
   -----
   value       - unique option value submitted with the form
   label       - primary display text for the option
   description - optional explanatory text rendered below the label
   selected    - true when this option is the current selection
   onSelect    - callback fired with the option value when chosen
   name        - radio-group name for accessible input grouping
   ============================================================= */

import { radioBase, radioSelected } from '../styles/componentStyles'

interface OptionCardProps {
  value: string
  label: string
  description?: string
  selected: boolean
  onSelect: (value: string) => void
  name: string
}

export default function OptionCard({
  value,
  label,
  description,
  selected,
  onSelect,
  name,
}: OptionCardProps) {
  return (
    <label style={selected ? radioSelected(radioBase) : radioBase}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        style={{ marginTop: '2px', accentColor: 'var(--color-teal-700)' }}
      />
      {description ? (
        <div>
          <span style={{ fontWeight: 500 }}>{label}</span>
          <br />
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-gray-600)',
            }}
          >
            {description}
          </span>
        </div>
      ) : (
        <span>{label}</span>
      )}
    </label>
  )
}
