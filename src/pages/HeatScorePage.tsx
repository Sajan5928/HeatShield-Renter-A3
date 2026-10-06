import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion'

interface HeatScorePageProps {
  score: number
  classification: 'Low' | 'Medium' | 'High'
  topDrivers: { label: string; explanation: string }[]
}

export default function HeatScorePage({ score, classification, topDrivers }: HeatScorePageProps) {
  const colorMap = {
    Low: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Low Risk' },
    Medium: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Medium Risk' },
    High: { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: 'High Risk' },
  }
  const cls = colorMap[classification]

  return (
    <main className="page-container">
      <div style={{ maxWidth: 'var(--max-width-card)', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>Your Heat Vulnerability Score</h1>

        {/* Score display */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: cls.color, lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', marginBottom: 'var(--space-3)' }}>
            out of 100
          </div>
          <span className="badge" style={{ background: cls.bg, color: cls.color, fontSize: 'var(--font-size-sm)', padding: 'var(--space-2) var(--space-4)' }}>
            {cls.label}
          </span>
        </div>

        {/* Drivers — Accordion (sourced from 21st.dev) */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>
            Main heat drivers for your room
          </h2>
          <Accordion type="single" collapsible>
            {topDrivers.map((driver, i) => (
              <AccordionItem key={`driver-${i}`} value={`driver-${i}`}>
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)' }}>{i + 1}.</span>
                    {driver.label}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {driver.explanation}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          This score is an educational estimate only. It is not professional building, health,
          energy-efficiency or legal advice. Results are based on your self-reported answers.
        </p>

        <div style={{ textAlign: 'center' }}>
          <Link to="/actions" className="btn btn-primary" style={{ fontSize: 'var(--font-size-lg)', padding: 'var(--space-4) var(--space-8)' }}>
            View Action Plan →
          </Link>
        </div>
      </div>
    </main>
  )
}
