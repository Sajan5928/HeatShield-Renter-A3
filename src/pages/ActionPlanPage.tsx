import { useNavigate } from 'react-router-dom'
import type { Action } from '../types/assessment'
import { controlColors } from '../styles/componentStyles'
import NavigationButton from '../components/NavigationButton'

interface Props { actions: Action[]; selectedIds: string[]; onToggle: (id: string) => void }

export default function ActionPlanPage({ actions, selectedIds, onToggle }: Props) {
  const navigate = useNavigate()

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Your Action Plan</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-6)' }}>
          Based on your Heat Check, here are the most effective actions for your situation.
          Select the ones you want to add to your personal Heat Plan.
        </p>
        {actions.map((action) => {
          const sel = selectedIds.includes(action.id)
          const c = controlColors[action.control]
          return (
            <div key={action.id} className="card" onClick={() => onToggle(action.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(action.id) }}
              role="button" tabIndex={0} aria-pressed={sel}
              style={{ marginBottom: 'var(--space-4)', cursor: 'pointer', border: sel ? '2px solid var(--color-teal-500)' : '2px solid transparent', transition: 'border-color 0.15s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0, flex: 1 }}>{sel ? '☑' : '☐'} {action.title}</h3>
                <span className="badge" style={{ background: c.bg, color: c.color, marginLeft: 'var(--space-3)', flexShrink: 0 }}>{action.control}</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>{action.description}</p>
            </div>
          )
        })}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', justifyContent: 'center' }}>
          {Object.entries(controlColors).map(([label, colors]) => (
            <span key={label} className="badge" style={{ background: colors.bg, color: colors.color, fontSize: 'var(--font-size-xs)' }}>{label}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <NavigationButton variant="secondary" onClick={() => navigate('/result')}>← Back to Score</NavigationButton>
          <NavigationButton variant="primary" disabled={selectedIds.length === 0} onClick={() => navigate('/my-plan')}>
            Save My Heat Plan ({selectedIds.length} selected)
          </NavigationButton>
        </div>
      </div>
    </main>
  )
}