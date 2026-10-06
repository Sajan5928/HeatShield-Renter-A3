/* =============================================
   HeatShield Renter — App Shell
   =============================================
   Parent component that owns all assessment state.
   Passes data DOWN via props and receives updates
   UP via callback functions.
   ============================================= */

import { useState, useCallback } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import type {
  AssessmentData,
  AboutRoom,
  RoomAssessment,
  HeatExperience,
} from './types/assessment'
import { calculateScore } from './utils/scoreCalculator'
import { getRecommendedActions } from './utils/actionRecommender'

import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import AboutRoomPage from './pages/AboutRoomPage'
import RoomAssessmentPage from './pages/RoomAssessmentPage'
import HeatExperiencePage from './pages/HeatExperiencePage'
import HeatScorePage from './pages/HeatScorePage'
import ActionPlanPage from './pages/ActionPlanPage'
import MyPlanPage from './pages/MyPlanPage'

/* ---- Initial empty state ---- */
const emptyAssessment: AssessmentData = {
  room: { dwellingType: '', floorPosition: undefined, roomType: '', suburb: '' },
  assessment: { sunExposure: '', windowShading: '', ventilation: '' },
  heat: { hottestTime: '', discomfortLevel: '', coolingMethods: [] },
}

/* ---- Route guard helpers ---- */
function isRoomComplete(data: AssessmentData): boolean {
  const { room } = data
  if (!room.dwellingType || !room.roomType || !room.suburb) return false
  if (room.dwellingType === 'Apartment' && !room.floorPosition) return false
  return true
}

function isAssessmentComplete(data: AssessmentData): boolean {
  const { assessment } = data
  return !!(assessment.sunExposure && assessment.windowShading && assessment.ventilation)
}

function isHeatComplete(data: AssessmentData): boolean {
  const { heat } = data
  return !!(heat.hottestTime && heat.discomfortLevel && heat.coolingMethods.length > 0)
}

export default function App() {
  const navigate = useNavigate()

  /* ---- Auth state (demo only) ---- */
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('heatshield-auth') === 'true'
  )

  /* ---- Assessment data (single source of truth) ---- */
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(emptyAssessment)

  /* ---- Selected actions for My Plan ---- */
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([])

  /* ---- Derived values ---- */
  const scoreResult = isHeatComplete(assessmentData)
    ? calculateScore(assessmentData)
    : null

  const recommendedActions = isHeatComplete(assessmentData)
    ? getRecommendedActions(assessmentData)
    : []

  /* ---- Callbacks (passed UP from child pages) ---- */
  const handleLogin = useCallback(() => {
    setIsAuthenticated(true)
    sessionStorage.setItem('heatshield-auth', 'true')
    navigate('/')
  }, [navigate])

  const handleRoomUpdate = useCallback((room: AboutRoom) => {
    setAssessmentData((prev) => ({ ...prev, room }))
  }, [])

  const handleAssessmentUpdate = useCallback((assessment: RoomAssessment) => {
    setAssessmentData((prev) => ({ ...prev, assessment }))
  }, [])

  const handleHeatUpdate = useCallback((heat: HeatExperience) => {
    setAssessmentData((prev) => ({ ...prev, heat }))
  }, [])

  const handleToggleAction = useCallback((actionId: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    )
  }, [])

  const handleRestart = useCallback(() => {
    setAssessmentData(emptyAssessment)
    setSelectedActionIds([])
    navigate('/')
  }, [navigate])

  /* ---- Selected action objects for My Plan ---- */
  const selectedActions = recommendedActions.filter((a) =>
    selectedActionIds.includes(a.id)
  )

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      <Route path="/" element={
        isAuthenticated ? <LandingPage /> : <Navigate to="/login" replace />
      } />

      <Route path="/check/room" element={
        isAuthenticated
          ? <AboutRoomPage data={assessmentData.room} onUpdate={handleRoomUpdate} />
          : <Navigate to="/login" replace />
      } />

      <Route path="/check/assessment" element={
        isAuthenticated && isRoomComplete(assessmentData)
          ? <RoomAssessmentPage data={assessmentData.assessment} onUpdate={handleAssessmentUpdate} />
          : <Navigate to="/check/room" replace />
      } />

      <Route path="/check/heat" element={
        isAuthenticated && isAssessmentComplete(assessmentData)
          ? <HeatExperiencePage data={assessmentData.heat} onUpdate={handleHeatUpdate} />
          : <Navigate to="/check/assessment" replace />
      } />

      <Route path="/result" element={
        isAuthenticated && scoreResult
          ? <HeatScorePage score={scoreResult.score} classification={scoreResult.classification} topDrivers={scoreResult.topDrivers} />
          : <Navigate to="/check/heat" replace />
      } />

      <Route path="/actions" element={
        isAuthenticated && scoreResult
          ? <ActionPlanPage actions={recommendedActions} selectedIds={selectedActionIds} onToggle={handleToggleAction} />
          : <Navigate to="/result" replace />
      } />

      <Route path="/my-plan" element={
        isAuthenticated
          ? <MyPlanPage selectedActions={selectedActions} score={scoreResult?.score ?? 0} classification={scoreResult?.classification ?? 'Low'} onRestart={handleRestart} />
          : <Navigate to="/login" replace />
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
