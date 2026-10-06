/* =============================================
   HeatShield Renter — Room Options (Screen 1)
   ============================================= */

export const dwellingOptions = [
  { value: "Apartment", label: "Apartment" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "House", label: "House" },
] as const

export const floorPositionOptions = [
  { value: "Ground/lower floor", label: "Ground / lower floor" },
  { value: "Middle floor", label: "Middle floor" },
  { value: "Top floor", label: "Top floor" },
] as const

export const roomTypeOptions = [
  { value: "Bedroom", label: "Bedroom" },
  { value: "Living room", label: "Living room" },
  { value: "Kitchen", label: "Kitchen" },
] as const

export const suburbOptions = [
  { value: "", label: "Select your area..." },
  { value: "Melbourne CBD", label: "Melbourne CBD" },
  { value: "Inner North", label: "Inner North (Carlton, Fitzroy, Northcote)" },
  { value: "Inner South", label: "Inner South (Southbank, St Kilda, Prahran)" },
  { value: "Inner East", label: "Inner East (Richmond, Hawthorn, Kew)" },
  { value: "Inner West", label: "Inner West (Footscray, Yarraville, Seddon)" },
  { value: "Northern Suburbs", label: "Northern Suburbs (Preston, Reservoir, Bundoora)" },
  { value: "Eastern Suburbs", label: "Eastern Suburbs (Box Hill, Glen Waverley, Ringwood)" },
  { value: "Southern Suburbs", label: "Southern Suburbs (Bentleigh, Moorabbin, Frankston)" },
  { value: "Western Suburbs", label: "Western Suburbs (Sunshine, Werribee, Point Cook)" },
  { value: "Regional Victoria", label: "Regional Victoria" },
] as const
