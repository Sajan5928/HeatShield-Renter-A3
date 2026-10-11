import type { Action } from '../types/assessment'
import { controlColors } from '../styles/componentStyles'

interface Props {
  selectedActions: Action[]; score: number
  classification: 'Low' | 'Medium' | 'High'; onRestart: () => void
}

export default function MyPlanPage({ selectedActions, score, classification, onRestart }: Props) {
  const grouped = {
    'You can act': selectedActions.filter((a) => a.control === 'You can act'),
    'Check permission': selectedActions.filter((a) => a.control === 'Check permission'),
    'Rental provider action': selectedActions.filter((a) => a.control === 'Rental provider action'),
  }

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>✅</div>
          <h1 style={{ color: 'var(--color-teal-700)', marginBottom: 'var(--space-2)' }}>Your Heat Plan is Ready</h1>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: 0 }}>
            Heat Vulnerability Score: <strong>{score}/100</strong> — {classification} risk
          </p>
        </div>

        {Object.entries(grouped).map(([control, actions]) => {
          if (actions.length === 0) return null
          const c = controlColors[control]
          return (
            <div key={control} style={{ marginBottom: 'var(--space-6)' }}>
              <span className="badge" style={{ background: c.bg, color: c.color, marginBottom: 'var(--space-3)', display: 'inline-block' }}>{control}</span>
              {actions.map((a) => (
                <div key={a.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0, marginBottom: 'var(--space-1)' }}>{a.title}</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', margin: 0 }}>{a.description}</p>
                </div>
              ))}
            </div>
          )
        })}

        <div className="card" style={{ background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)', marginBottom: 'var(--space-6)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>
            <strong>Important:</strong> This Heat Plan is an educational tool only. The Heat Vulnerability Score
            and recommendations are based on your self-reported answers and simple rules — they are not
            professional building, health, energy-efficiency or legal advice. For serious heat concerns,
            please consult a qualified professional or contact your local council.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button type="button" className="btn btn-secondary" onClick={onRestart}>🔄 Start New Heat Check</button>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', textAlign: 'center', marginTop: 'var(--space-6)', marginBottom: 0 }}>
          We’ll attempt to save your assessment while this page is open. Closing this page will clear your Heat Plan.
        </p>
      </div>
    </main>
  )
}