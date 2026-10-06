import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AboutRoom } from '../types/assessment'
import { dwellingOptions, floorPositionOptions, roomTypeOptions, suburbOptions } from '../data/roomOptions'
import PageHeader from '../components/PageHeader'
import OptionCard from '../components/OptionCard'
import NavigationButton from '../components/NavigationButton'

interface Props { data: AboutRoom; onUpdate: (room: AboutRoom) => void }

export default function AboutRoomPage({ data, onUpdate }: Props) {
  const navigate = useNavigate()
  const [dwellingType, setDwellingType] = useState(data.dwellingType)
  const [floorPosition, setFloorPosition] = useState(data.floorPosition ?? '')
  const [roomType, setRoomType] = useState(data.roomType)
  const [suburb, setSuburb] = useState(data.suburb)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const showFloor = dwellingType === 'Apartment'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!dwellingType) err.dwellingType = 'Please select your dwelling type.'
    if (showFloor && !floorPosition) err.floorPosition = 'Please select your floor level.'
    if (!roomType) err.roomType = 'Please select the room type.'
    if (!suburb) err.suburb = 'Please select your area.'
    setErrors(err)
    if (Object.keys(err).length === 0) {
      onUpdate({ dwellingType, floorPosition: showFloor ? floorPosition : undefined, roomType, suburb })
      navigate('/check/assessment')
    }
  }

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <PageHeader
          step={1}
          totalSteps={3}
          title="About Your Room"
          description="Tell us about your living situation so we can tailor your Heat Check."
        />
        <form onSubmit={handleSubmit} noValidate>
          <fieldset style={{ marginBottom: 'var(--space-6)' }}>
            <legend>What type of dwelling do you live in?</legend>
            {dwellingOptions.map((o) => (
              <OptionCard
                key={o.value}
                value={o.value}
                label={o.label}
                selected={dwellingType === o.value}
                onSelect={(v) => { setDwellingType(v); if (v !== 'Apartment') setFloorPosition('') }}
                name="dwellingType"
              />
            ))}
            {errors.dwellingType && <p className="field-error" role="alert">{errors.dwellingType}</p>}
          </fieldset>

          {showFloor && (
            <fieldset style={{ marginBottom: 'var(--space-6)' }}>
              <legend>What floor is your apartment on?</legend>
              {floorPositionOptions.map((o) => (
                <OptionCard
                  key={o.value}
                  value={o.value}
                  label={o.label}
                  selected={floorPosition === o.value}
                  onSelect={setFloorPosition}
                  name="floorPosition"
                />
              ))}
              {errors.floorPosition && <p className="field-error" role="alert">{errors.floorPosition}</p>}
            </fieldset>
          )}

          <fieldset style={{ marginBottom: 'var(--space-6)' }}>
            <legend>Which room gets hottest?</legend>
            {roomTypeOptions.map((o) => (
              <OptionCard
                key={o.value}
                value={o.value}
                label={o.label}
                selected={roomType === o.value}
                onSelect={setRoomType}
                name="roomType"
              />
            ))}
            {errors.roomType && <p className="field-error" role="alert">{errors.roomType}</p>}
          </fieldset>

          <div style={{ marginBottom: 'var(--space-8)' }}>
            <label htmlFor="suburb">General area (broad region only)</label>
            <select id="suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)}
              aria-describedby={errors.suburb ? 'suburb-error' : undefined} aria-invalid={!!errors.suburb}>
              {suburbOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.suburb && <p id="suburb-error" className="field-error" role="alert">{errors.suburb}</p>}
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginTop: 'var(--space-1)', marginBottom: 0 }}>
              We never ask for your exact address.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <NavigationButton variant="secondary" onClick={() => navigate('/')}>← Back</NavigationButton>
            <NavigationButton variant="primary" type="submit">Next →</NavigationButton>
          </div>
        </form>
      </div>
    </main>
  )
}
