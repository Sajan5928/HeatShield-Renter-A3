/* =============================================
   HeatShield Renter — App Shell
   =============================================
   Parent component that owns all assessment state.
   Passes data DOWN via props and receives updates
   UP via callback functions.
   ============================================= */

import { useState, useCallback, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'

import type {
  AssessmentData,
  AboutRoom,
  RoomAssessment,
  HeatExperience,
} from './types/assessment'
import { calculateScore } from './utils/scoreCalculator'
import { getRecommendedActions } from './utils/actionRecommender'
import { supabase } from './lib/supabase'

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

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')
const assessmentApiUrl = `${apiBaseUrl}/assessment`

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

  /* ---- Supabase authentication state ---- */
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  /* ---- Assessment data (single source of truth) ---- */
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(emptyAssessment)

  /* ---- Selected actions for My Plan ---- */
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([])

  /* ---- Email from authenticated Supabase user ---- */
  const [email, setEmail] = useState('')

  /* ---- Tracks whether current data has already been saved ---- */
  const [savedAssessmentId, setSavedAssessmentId] = useState<number | null>(null)

  /* ---- Derived values ---- */
  const scoreResult = isHeatComplete(assessmentData)
    ? calculateScore(assessmentData)
    : null

  const recommendedActions = isHeatComplete(assessmentData)
    ? getRecommendedActions(assessmentData)
    : []

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      setIsAuthenticated(Boolean(data.session?.user))
      setEmail(data.session?.user.email ?? '')
      setIsAuthLoading(false)
    }

    void loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user))
      setEmail(session?.user.email ?? '')
      setIsAuthLoading(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  /* ---- Callbacks (passed UP from child pages) ---- */
  const handleAuthenticated = useCallback((authenticatedEmail: string) => {
    setEmail(authenticatedEmail)
    navigate('/')
  }, [navigate])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    setAssessmentData(emptyAssessment)
    setSelectedActionIds([])
    setSavedAssessmentId(null)
    setEmail('')
    navigate('/login')
  }, [navigate])

  const handleRoomUpdate = useCallback((room: AboutRoom) => {
    setAssessmentData((prev) => ({ ...prev, room }))
    setSavedAssessmentId(null)
  }, [])

  const handleAssessmentUpdate = useCallback((assessment: RoomAssessment) => {
    setAssessmentData((prev) => ({ ...prev, assessment }))
    setSavedAssessmentId(null)
  }, [])

  const handleHeatUpdate = useCallback((heat: HeatExperience) => {
    setAssessmentData((prev) => ({ ...prev, heat }))
    setSavedAssessmentId(null)
  }, [])

  const handleToggleAction = useCallback((actionId: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    )
    setSavedAssessmentId(null)
  }, [])

  const handleRestart = useCallback(() => {
    setAssessmentData(emptyAssessment)
    setSelectedActionIds([])
    setSavedAssessmentId(null)
    setEmail('')
    navigate('/')
  }, [navigate])

  /* ---- Selected action objects for My Plan ---- */
  const selectedActions = recommendedActions.filter((a) =>
    selectedActionIds.includes(a.id)
  )

  /* ---- Auto-save when user reaches /my-plan ---- */
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/my-plan') return
    if (savedAssessmentId !== null) return
    if (!email) return
    if (!isHeatComplete(assessmentData)) return
    if (selectedActionIds.length === 0) return
    if (!scoreResult) return

    const payload = {
      dwelling_type: assessmentData.room.dwellingType,
      room_type: assessmentData.room.roomType,
      area: assessmentData.room.suburb,
      floor_position: assessmentData.room.floorPosition ?? null,
      assessment_data: assessmentData,
      heat_score: scoreResult.score,
      selected_actions: selectedActionIds,
    }

    async function saveAssessment() {
      const { data } = await supabase.auth.getSession()
      const accessToken = data.session?.access_token

      if (!accessToken) {
        console.error('Failed to save assessment: authentication is required.')
        return
      }

      try {
        const response = await fetch(assessmentApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error)
        }

        const responseData = await response.json()
        setSavedAssessmentId(responseData.id)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('Failed to save assessment:', message)
      }
    }

    void saveAssessment()
  }, [location.pathname, savedAssessmentId, email, assessmentData, selectedActionIds, scoreResult])

  if (isAuthLoading) {
    return null
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to="/" replace />
          : <LoginPage onAuthenticated={handleAuthenticated} />
      } />

      <Route path="/" element={
        isAuthenticated ? <LandingPage onSignOut={handleSignOut} /> : <Navigate to="/login" replace />
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
