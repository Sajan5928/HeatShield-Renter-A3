/* =============================================
   HeatShield Renter — Heat Experience Options (Screen 3)
   ============================================= */

export const hottestTimeOptions = [
  { value: "Afternoon (2-5pm)", label: "Afternoon (2–5 pm)" },
  { value: "Evening (5-8pm)", label: "Evening (5–8 pm)" },
  { value: "Morning", label: "Morning" },
] as const

export const discomfortLevelOptions = [
  {
    value: "Uncomfortable",
    label: "Uncomfortable",
    description: "Noticeable heat, hard to relax",
  },
  {
    value: "Very uncomfortable",
    label: "Very uncomfortable",
    description: "Difficult to sleep or concentrate",
  },
  {
    value: "Unsafe",
    label: "Unsafe",
    description: "Health concerns, dizziness, or heat exhaustion",
  },
] as const

export const coolingMethodOptions = [
  { value: "Fan", label: "Fan" },
  { value: "Blinds/curtains", label: "Blinds / curtains" },
  { value: "Air conditioning", label: "Air conditioning" },
  { value: "Cross ventilation", label: "Cross ventilation" },
  { value: "None", label: "None" },
] as const
