/* =============================================
   HeatShield Renter — TypeScript Interfaces
   ============================================= */

/** Step 1: About Your Room */
export interface AboutRoom {
  dwellingType: string       // "Apartment" | "Townhouse" | "House"
  floorPosition?: string     // "Ground/lower floor" | "Middle floor" | "Top floor"
                             // Only required when dwellingType === "Apartment"
  roomType: string           // "Bedroom" | "Living room" | "Kitchen"
  suburb: string             // Broad Melbourne/Victoria area, never exact address
}

/** Step 2: Room Assessment */
export interface RoomAssessment {
  sunExposure: string        // "Direct afternoon sun" | "Morning sun only" | "Shaded"
  windowShading: string      // "No blinds or curtains" | "Blinds or curtains only" | "External shading"
  ventilation: string        // "Windows can open wide" | "Limited opening" | "Sealed or cannot open"
}

/** Step 3: Heat Experience */
export interface HeatExperience {
  hottestTime: string        // "Afternoon (2-5pm)" | "Evening (5-8pm)" | "Morning"
  discomfortLevel: string    // "Uncomfortable" | "Very uncomfortable" | "Unsafe"
  coolingMethods: string[]   // ["Fan", "Blinds/curtains", "Air conditioning", "None"]
}

/** Combined assessment data — held in parent App state */
export interface AssessmentData {
  room: AboutRoom
  assessment: RoomAssessment
  heat: HeatExperience
}

/** A saved assessment returned by the authenticated assessment API. */
export interface SavedAssessment {
  id: number
  created_at: string
  dwelling_type: string
  room_type: string
  area: string
  floor_position: string | null
  assessment_data: AssessmentData
  heat_score: number
  selected_actions: string[]
}

/** Score calculation result */
export interface ScoreResult {
  score: number
  classification: "Low" | "Medium" | "High"
  /** Full driver data — used by Accordion in HeatScorePage */
  topDrivers: { label: string; explanation: string }[]
}

/** Action recommendation */
export interface Action {
  id: string
  title: string
  description: string
  control: "You can act" | "Check permission" | "Rental provider action"
  priority: number
  relevanceCondition: (data: AssessmentData) => boolean
}
