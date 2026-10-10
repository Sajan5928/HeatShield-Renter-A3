import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { SavedAssessment } from '../types/assessment'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')
const assessmentApiUrl = `${apiBaseUrl}/assessment`

function formatAssessmentDate(createdAt: string): string {
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PreviousAssessmentsPage() {
  const [assessments, setAssessments] = useState<SavedAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAssessments() {
      const { data } = await supabase.auth.getSession()
      const accessToken = data.session?.access_token

      if (!accessToken) {
        if (isMounted) {
          setError('Your session has ended. Please sign in again.')
          setIsLoading(false)
        }
        return
      }

      try {
        const response = await fetch(assessmentApiUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!response.ok) {
          const responseBody = await response.json().catch(() => null) as { error?: string } | null
          throw new Error(responseBody?.error || 'Unable to load your previous assessments.')
        }

        const savedAssessments = await response.json() as SavedAssessment[]
        if (!Array.isArray(savedAssessments)) {
          throw new Error('Unable to load your previous assessments.')
        }

        if (isMounted) setAssessments(savedAssessments)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load your previous assessments.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadAssessments()
    return () => { isMounted = false }
  }, [])

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>My Previous Assessments</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-6)' }}>
          Review the Heat Checks saved to your account.
        </p>

        {isLoading && <p aria-live="polite">Loading your previous assessments…</p>}

        {error && <p className="field-error" role="alert">{error}</p>}

        {!isLoading && !error && assessments.length === 0 && (
          <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>No saved assessments yet</h2>
            <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
              Complete a Heat Check and choose at least one action to save your first plan.
            </p>
          </div>
        )}

        {!isLoading && !error && assessments.map((assessment) => (
          <article key={assessment.id} className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>
                {assessment.room_type} in {assessment.area}
              </h2>
              <strong style={{ color: 'var(--color-teal-700)', whiteSpace: 'nowrap' }}>{assessment.heat_score}/100</strong>
            </div>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
              {assessment.dwelling_type}{assessment.floor_position ? ` — ${assessment.floor_position}` : ''}
            </p>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
              Saved: {formatAssessmentDate(assessment.created_at)}
            </p>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
              Hottest time: {assessment.assessment_data.heat.hottestTime || 'Not recorded'} · Discomfort: {assessment.assessment_data.heat.discomfortLevel || 'Not recorded'}
            </p>
            <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
              {assessment.selected_actions.length} action{assessment.selected_actions.length === 1 ? '' : 's'} selected
            </p>
          </article>
        ))}

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link to="/" className="btn btn-secondary">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}