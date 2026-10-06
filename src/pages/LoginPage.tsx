import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) newErrors.email = 'Please enter your email.'
    else if (!email.includes('@')) newErrors.email = 'Please enter a valid email.'

    if (!password.trim()) newErrors.password = 'Please enter your password.'
    else if (password.length < 4) newErrors.password = 'Password must be at least 4 characters.'

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onLogin()
      navigate('/')
    }
  }

  return (
    <main className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-teal-700)', marginBottom: 'var(--space-2)' }}>
            🛡️ HeatShield Renter
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginBottom: 0 }}>
            Sign in to start your Heat Check
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p id="password-error" className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', textAlign: 'center', marginTop: 'var(--space-4)', marginBottom: 0 }}>
          This is a university demonstration. No credentials are stored or transmitted.
          Enter any email and password to continue.
        </p>
      </div>
    </main>
  )
}
