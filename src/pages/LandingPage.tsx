import { Link } from 'react-router-dom'

interface LandingPageProps {
  onSignOut: () => void
}

export default function LandingPage({ onSignOut }: LandingPageProps) {
  return (
    <main className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <div style={{ maxWidth: '520px' }}>
        {/* Brand mark */}
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🛡️</div>

        <h1 style={{ color: 'var(--color-teal-700)', marginBottom: 'var(--space-3)' }}>
          HeatShield Renter
        </h1>

        <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-coral-600)', fontWeight: 600, lineHeight: 'var(--line-height-tight)', marginBottom: 'var(--space-6)' }}>
          Your rental gets hot.
          <br />
          Find out what you can actually do.
        </p>

        <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-3)' }}>
            How it works
          </h2>
          <ol style={{ paddingLeft: 'var(--space-5)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Heat Check</strong> — answer a few questions about your room and heat experience
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <strong>Heat Score</strong> — see your personalised Heat Vulnerability Score and understand the main drivers
            </li>
            <li>
              <strong>Action Plan</strong> — get prioritised recommendations classified by what you can do yourself, what needs permission, and what your rental provider should handle
            </li>
          </ol>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link to="/check/room" className="btn btn-primary" style={{ fontSize: 'var(--font-size-lg)', padding: 'var(--space-4) var(--space-8)' }}>
            Start Heat Check
          </Link>
          <Link to="/previous-assessments" className="btn btn-secondary">
            My Previous Assessments
          </Link>
        </div>

        <div style={{ marginTop: 'var(--space-4)' }}>
          <button type="button" className="btn btn-secondary" onClick={onSignOut}>
            Sign Out
          </button>
        </div>

        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', marginTop: 'var(--space-6)', marginBottom: 0 }}>
          HeatShield Renter is an educational MVP. The Heat Vulnerability Score is an estimate
          and is not professional building, health, energy-efficiency or legal advice.
        </p>
      </div>
    </main>
  )
}
