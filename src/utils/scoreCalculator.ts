import type { AssessmentData, ScoreResult } from '../types/assessment'

interface ScoreBreakdown {
  label: string
  points: number
  explanation: string
}

export function calculateScore(data: AssessmentData): ScoreResult {
  const breakdown: ScoreBreakdown[] = []

  // Dwelling type + floor position
  if (data.room.dwellingType === 'Apartment') {
    if (data.room.floorPosition === 'Top floor') {
      breakdown.push({ label: 'Top-floor apartment', points: 15, explanation: 'Top-floor apartments absorb heat from the roof and floors below, making rooms significantly hotter.' })
    } else if (data.room.floorPosition === 'Middle floor') {
      breakdown.push({ label: 'Mid-floor apartment', points: 8, explanation: 'Mid-floor apartments receive rising heat from lower levels and can retain warmth overnight.' })
    } else {
      breakdown.push({ label: 'Ground-floor apartment', points: 5, explanation: 'Ground-floor apartments are generally cooler but can still trap heat from surrounding walls.' })
    }
  } else if (data.room.dwellingType === 'Townhouse') {
    breakdown.push({ label: 'Townhouse', points: 5, explanation: 'Townhouses share walls which can transfer heat from neighbouring properties.' })
  } else {
    breakdown.push({ label: 'House', points: 3, explanation: 'Detached houses generally have better airflow but can still overheat without insulation.' })
  }

  // Room type
  if (data.room.roomType === 'Bedroom') {
    breakdown.push({ label: 'Bedroom (sleep impact)', points: 10, explanation: 'Heat in bedrooms directly affects sleep quality and recovery.' })
  } else if (data.room.roomType === 'Living room') {
    breakdown.push({ label: 'Living room', points: 7, explanation: 'Living rooms are high-use spaces where heat discomfort accumulates during the day.' })
  } else {
    breakdown.push({ label: 'Kitchen', points: 5, explanation: 'Kitchens generate additional heat from cooking, compounding the problem.' })
  }

  // Sun exposure
  if (data.assessment.sunExposure === 'Direct afternoon sun') {
    breakdown.push({ label: 'Direct afternoon sun', points: 20, explanation: 'Direct afternoon sun is the strongest heat driver. It heats walls, floors and furniture which radiate warmth into the evening.' })
  } else if (data.assessment.sunExposure === 'Morning sun only') {
    breakdown.push({ label: 'Morning sun', points: 8, explanation: 'Morning sun warms the room early, building up over a hot day.' })
  } else {
    breakdown.push({ label: 'Shaded room', points: 0, explanation: 'Your room has limited direct sun exposure.' })
  }

  // Window shading
  if (data.assessment.windowShading === 'No blinds or curtains') {
    breakdown.push({ label: 'No window shading', points: 15, explanation: 'Without blinds or curtains, solar heat enters unfiltered and heats surfaces directly.' })
  } else if (data.assessment.windowShading === 'Blinds or curtains only') {
    breakdown.push({ label: 'Internal blinds only', points: 8, explanation: 'Internal blinds help but heat has already passed through the glass. External shading is more effective.' })
  } else {
    breakdown.push({ label: 'External shading', points: 2, explanation: 'External shading blocks heat before it reaches the glass. The most effective option.' })
  }

  // Ventilation
  if (data.assessment.ventilation === 'Sealed or cannot open') {
    breakdown.push({ label: 'Sealed room', points: 15, explanation: 'Sealed windows trap heat inside and prevent any natural cooling.' })
  } else if (data.assessment.ventilation === 'Limited opening') {
    breakdown.push({ label: 'Limited ventilation', points: 8, explanation: 'Limited window opening restricts airflow, making it harder to flush out hot air.' })
  } else {
    breakdown.push({ label: 'Good ventilation access', points: 2, explanation: 'Wide-opening windows allow good airflow for natural cooling.' })
  }

  // Hottest time
  if (data.heat.hottestTime === 'Afternoon (2-5pm)') {
    breakdown.push({ label: 'Peak afternoon heat', points: 10, explanation: 'Afternoon heat aligns with the hottest part of the day and continues radiating into the evening.' })
  } else if (data.heat.hottestTime === 'Evening (5-8pm)') {
    breakdown.push({ label: 'Evening heat retention', points: 7, explanation: 'Evening heat means the room stores warmth long after the sun has set.' })
  } else {
    breakdown.push({ label: 'Morning heat', points: 3, explanation: 'Morning heat is less intense but still affects comfort early in the day.' })
  }

  // Discomfort level
  if (data.heat.discomfortLevel === 'Unsafe') {
    breakdown.push({ label: 'Unsafe heat level', points: 15, explanation: 'Your reported discomfort level indicates a potential health risk. Consider heat-safety planning.' })
  } else if (data.heat.discomfortLevel === 'Very uncomfortable') {
    breakdown.push({ label: 'Very uncomfortable', points: 10, explanation: 'Very uncomfortable heat significantly affects daily living and sleep.' })
  } else {
    breakdown.push({ label: 'Uncomfortable', points: 5, explanation: 'Uncomfortable heat is noticeable and affects your enjoyment of the room.' })
  }

  // Cooling methods
  const hasCooling = data.heat.coolingMethods.length > 0 && !data.heat.coolingMethods.includes('None')
  if (!hasCooling) {
    breakdown.push({ label: 'No cooling methods', points: 10, explanation: 'Without any cooling methods, you have no defence against indoor heat.' })
  } else if (data.heat.coolingMethods.includes('Air conditioning')) {
    breakdown.push({ label: 'Has air conditioning', points: 0, explanation: 'Air conditioning is the most effective cooling method available.' })
  } else {
    breakdown.push({ label: 'Partial cooling only', points: 5, explanation: 'Fans and blinds help but have limited effectiveness on extreme heat days.' })
  }

  // Calculate total
  const score = Math.min(100, breakdown.reduce((sum, b) => sum + b.points, 0))

  // Classification
  let classification: ScoreResult['classification']
  if (score <= 33) classification = 'Low'
  else if (score <= 66) classification = 'Medium'
  else classification = 'High'

  // Top drivers (sorted by points, take top 3)
  const topDrivers = breakdown
    .filter((b) => b.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((b) => ({ label: b.label, explanation: b.explanation }))

  return { score, classification, topDrivers }
}
