import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HeatExperience } from '../types/assessment'
import { hottestTimeOptions, discomfortLevelOptions, coolingMethodOptions } from '../data/heatOptions'
import { checkboxBase } from '../styles/componentStyles'
import PageHeader from '../components/PageHeader'
import OptionCard from '../components/OptionCard'
import NavigationButton from '../components/NavigationButton'

interface Props { data: HeatExperience; onUpdate: (heat: HeatExperience) => void }

export default function HeatExperiencePage({ data, onUpdate }: Props) {
  const navigate = useNavigate()
  const [hottestTime, setHottestTime] = useState(data.hottestTime)
  const [discomfortLevel, setDiscomfortLevel] = useState(data.discomfortLevel)
  const [coolingMethods, setCoolingMethods] = useState<string[]>(data.coolingMethods)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleCoolingToggle(value: string) {
    setCoolingMethods((prev) => {
      if (value === 'None') return prev.includes('None') ? [] : ['None']
      const without = prev.filter((m) => m !== 'None' && m !== value)
      return prev.includes(value) ? without : [...without, value]
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!hottestTime) err.hottestTime = 'Please select when the room is hottest.'
    if (!discomfortLevel) err.discomfortLevel = 'Please select your discomfort level.'
    if (coolingMethods.length === 0) err.coolingMethods = 'Please select at least one option.'
    setErrors(err)
    if (Object.keys(err).length === 0) {
      onUpdate({ hottestTime, discomfortLevel, coolingMethods })
      navigate('/result')
    }
  }

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <PageHeader
          step={3}
          totalSteps={3}
          title="Heat Experience"
          description="Help us understand how heat affects you in this room."
        />
        <form onSubmit={handleSubmit} noValidate>
          <fieldset style={{ marginBottom: 'var(--space-6)' }}>
            <legend>When does the room become hottest?</legend>
            {hottestTimeOptions.map((o) => (
              <OptionCard
                key={o.value}
                value={o.value}
                label={o.label}
                selected={hottestTime === o.value}
                onSelect={setHottestTime}
                name="hottestTime"
              />
            ))}
            {errors.hottestTime && <p className="field-error" role="alert">{errors.hottestTime}</p>}
          </fieldset>

          <fieldset style={{ marginBottom: 'var(--space-6)' }}>
            <legend>How would you describe the heat discomfort?</legend>
            {discomfortLevelOptions.map((o) => (
              <OptionCard
                key={o.value}
                value={o.value}
                label={o.label}
                description={o.description}
                selected={discomfortLevel === o.value}
                onSelect={setDiscomfortLevel}
                name="discomfortLevel"
              />
            ))}
            {errors.discomfortLevel && <p className="field-error" role="alert">{errors.discomfortLevel}</p>}
          </fieldset>

          <fieldset style={{ marginBottom: 'var(--space-8)' }}>
            <legend>What cooling methods do you currently use? (select all that apply)</legend>
            {coolingMethodOptions.map((o) => (
              <label key={o.value} style={checkboxBase}>
                <input type="checkbox" value={o.value} checked={coolingMethods.includes(o.value)}
                  onChange={() => handleCoolingToggle(o.value)}
                  style={{ accentColor: 'var(--color-teal-700)' }} />
                <span>{o.label}</span>
              </label>
            ))}
            {errors.coolingMethods && <p className="field-error" role="alert">{errors.coolingMethods}</p>}
          </fieldset>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <NavigationButton variant="secondary" onClick={() => navigate('/check/assessment')}>← Back</NavigationButton>
            <button type="submit" className="btn btn-coral">Get My Heat Score 🔥</button>
          </div>
        </form>
      </div>
    </main>
  )
}
