import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RoomAssessment } from '../types/assessment'
import {
  sunExposureOptions,
  windowShadingOptions,
  ventilationOptions,
} from '../data/assessmentOptions'
import PageHeader from '../components/PageHeader'
import OptionCard from '../components/OptionCard'
import NavigationButton from '../components/NavigationButton'

interface RoomAssessmentPageProps {
  data: RoomAssessment
  onUpdate: (assessment: RoomAssessment) => void
}

export default function RoomAssessmentPage({ data, onUpdate }: RoomAssessmentPageProps) {
  const navigate = useNavigate()

  const [sunExposure, setSunExposure] = useState(data.sunExposure)
  const [windowShading, setWindowShading] = useState(data.windowShading)
  const [ventilation, setVentilation] = useState(data.ventilation)
  const [errors, setErrors] = useState<Record<string, string>>({})


  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!sunExposure) newErrors.sunExposure = 'Please select sun exposure.'
    if (!windowShading) newErrors.windowShading = 'Please select window shading.'
    if (!ventilation) newErrors.ventilation = 'Please select ventilation.'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onUpdate({ sunExposure, windowShading, ventilation })
      navigate('/check/heat')
    }
  }

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <PageHeader
          step={2}
          totalSteps={3}
          title="Room Assessment"
          description="Describe the heat-related features of your room."
        />
        <form onSubmit={handleSubmit} noValidate>
          <fieldset style={{ marginBottom: 'var(--space-6)' }}>
            <legend>How much direct sunlight does the room get?</legend>
            {sunExposureOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                description={opt.description}
                selected={sunExposure === opt.value}
                onSelect={setSunExposure}
                name="sunExposure"
              />
            ))}
            {errors.sunExposure && <p className="field-error" role="alert">{errors.sunExposure}</p>}
          </fieldset>


          <fieldset style={{ marginBottom: 'var(--space-6)' }}>
            <legend>What window shading does the room have?</legend>
            {windowShadingOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                description={opt.description}
                selected={windowShading === opt.value}
                onSelect={setWindowShading}
                name="windowShading"
              />
            ))}
            {errors.windowShading && <p className="field-error" role="alert">{errors.windowShading}</p>}
          </fieldset>

          <fieldset style={{ marginBottom: 'var(--space-8)' }}>
            <legend>Can the windows in this room open?</legend>
            {ventilationOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                label={opt.label}
                description={opt.description}
                selected={ventilation === opt.value}
                onSelect={setVentilation}
                name="ventilation"
              />
            ))}
            {errors.ventilation && <p className="field-error" role="alert">{errors.ventilation}</p>}
          </fieldset>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <NavigationButton variant="secondary" onClick={() => navigate('/check/room')}>← Back</NavigationButton>
            <NavigationButton variant="primary" type="submit">Next →</NavigationButton>
          </div>
        </form>
      </div>
    </main>
  )
}
