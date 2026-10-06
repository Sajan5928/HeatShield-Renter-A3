/* =============================================
   HeatShield Renter — Master Action List
   ============================================= */

import type { Action } from '../types/assessment'

const allActions: Action[] = [
  {
    id: "close-blinds-midday",
    title: "Close blinds before midday",
    description:
      "Close internal blinds or curtains before 11 am to block heat before it enters. This is one of the simplest and most effective actions renters can take.",
    control: "You can act",
    priority: 1,
    relevanceCondition: (data) =>
      data.assessment.windowShading === "Blinds or curtains only" &&
      data.assessment.sunExposure !== "Shaded",
  },
  {
    id: "cross-ventilation",
    title: "Create cross-ventilation",
    description:
      "Open windows on opposite sides of the room in the early morning or after sunset to push hot air out and draw cooler air through.",
    control: "You can act",
    priority: 2,
    relevanceCondition: (data) =>
      data.assessment.ventilation === "Windows can open wide" ||
      data.assessment.ventilation === "Limited opening",
  },
  {
    id: "night-purge",
    title: "Night-time air purge",
    description:
      "Open all available windows after sunset and close them by 8 am. This flushes out stored heat and pre-cools the room for the next day.",
    control: "You can act",
    priority: 3,
    relevanceCondition: (data) =>
      data.assessment.ventilation !== "Sealed or cannot open",
  },
  {
    id: "reflective-window-film",
    title: "Apply removable window film",
    description:
      "Static-cling reflective film can cut solar heat by up to 30 % without damaging glass. It peels off cleanly when you move out.",
    control: "Check permission",
    priority: 4,
    relevanceCondition: (data) =>
      data.assessment.sunExposure === "Direct afternoon sun" &&
      data.assessment.windowShading !== "External shading",
  },
  {
    id: "request-external-shading",
    title: "Request external shading",
    description:
      "Ask your rental provider to install awnings or external blinds. External shading blocks heat before it reaches the glass, which is far more effective than internal blinds alone.",
    control: "Rental provider action",
    priority: 5,
    relevanceCondition: (data) =>
      data.assessment.sunExposure === "Direct afternoon sun" &&
      data.assessment.windowShading !== "External shading",
  },
  {
    id: "request-ceiling-fan",
    title: "Request ceiling fan installation",
    description:
      "Ceiling fans improve air movement and can make a room feel 3–4 °C cooler. Under Victorian tenancy law, this is a modification your rental provider should consider.",
    control: "Rental provider action",
    priority: 6,
    relevanceCondition: (data) => {
      const noAC = !data.heat.coolingMethods.includes("Air conditioning")
      const noFan = !data.heat.coolingMethods.includes("Fan")
      return noAC && noFan
    },
  },
  {
    id: "request-insulation-check",
    title: "Request roof or ceiling insulation check",
    description:
      "Top-floor apartments and older houses often lack adequate insulation. Ask your rental provider to have insulation inspected — it can reduce indoor temperatures by several degrees.",
    control: "Rental provider action",
    priority: 7,
    relevanceCondition: (data) =>
      data.room.dwellingType === "House" ||
      (data.room.dwellingType === "Apartment" && data.room.floorPosition === "Top floor"),
  },
  {
    id: "portable-evaporative",
    title: "Use a portable evaporative cooler",
    description:
      "A small evaporative cooler uses water to lower air temperature and works well in dry Victorian heat. No installation required — just plug in and fill with water.",
    control: "You can act",
    priority: 8,
    relevanceCondition: (data) => {
      const noAC = !data.heat.coolingMethods.includes("Air conditioning")
      return noAC
    },
  },
  {
    id: "seal-gaps-draft",
    title: "Seal draughty gaps around windows",
    description:
      "Self-adhesive weather strips from a hardware store can reduce hot air leaking in and cooled air leaking out. Removable when you leave.",
    control: "Check permission",
    priority: 9,
    relevanceCondition: (data) =>
      data.assessment.ventilation === "Sealed or cannot open" ||
      data.room.dwellingType === "House",
  },
  {
    id: "request-sealed-window-release",
    title: "Request sealed windows be made openable",
    description:
      "Sealed windows trap heat and prevent ventilation. Under minimum standards, habitable rooms should have openable windows. Ask your rental provider to address this.",
    control: "Rental provider action",
    priority: 10,
    relevanceCondition: (data) =>
      data.assessment.ventilation === "Sealed or cannot open",
  },
  {
    id: "cooling-plan-health",
    title: "Create a personal heat-safety plan",
    description:
      "If your discomfort level is unsafe, plan ahead: know where the coolest room is, keep water accessible, and identify a cooler place you can go on extreme heat days.",
    control: "You can act",
    priority: 11,
    relevanceCondition: (data) =>
      data.heat.discomfortLevel === "Unsafe" ||
      data.heat.discomfortLevel === "Very uncomfortable",
  },
  {
    id: "request-external-shading-apartment",
    title: "Request building-level shading solutions",
    description:
      "If you live in an apartment, the building owner may be able to add external shading to north- or west-facing windows. This is worth raising through your property manager.",
    control: "Rental provider action",
    priority: 12,
    relevanceCondition: (data) =>
      data.room.dwellingType === "Apartment" &&
      data.assessment.sunExposure === "Direct afternoon sun",
  },
]

export default allActions
