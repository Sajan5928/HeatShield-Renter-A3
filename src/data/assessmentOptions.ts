/* =============================================
   HeatShield Renter — Assessment Options (Screen 2)
   ============================================= */

export const sunExposureOptions = [
  {
    value: "Direct afternoon sun",
    label: "Direct afternoon sun",
    description: "Sun hits the room directly between 2–5 pm",
  },
  {
    value: "Morning sun only",
    label: "Morning sun only",
    description: "Sun hits in the morning, shade in the afternoon",
  },
  {
    value: "Shaded",
    label: "Shaded",
    description: "Little or no direct sunlight enters the room",
  },
] as const

export const windowShadingOptions = [
  {
    value: "No blinds or curtains",
    label: "No blinds or curtains",
    description: "Naked windows with no covering",
  },
  {
    value: "Blinds or curtains only",
    label: "Blinds or curtains only",
    description: "Internal blinds, curtains, or both",
  },
  {
    value: "External shading",
    label: "External shading",
    description: "Awnings, shutters, or external blinds",
  },
] as const

export const ventilationOptions = [
  {
    value: "Windows can open wide",
    label: "Windows can open wide",
    description: "At least two windows fully openable",
  },
  {
    value: "Limited opening",
    label: "Limited opening",
    description: "Windows open partially or only one window",
  },
  {
    value: "Sealed or cannot open",
    description: "Windows are sealed, locked, or cannot be opened",
    label: "Sealed or cannot open",
  },
] as const
