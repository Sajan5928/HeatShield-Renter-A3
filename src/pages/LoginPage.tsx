import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

interface LoginPageProps {
  onAuthenticated: (email: string) => void
}

export default function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) newErrors.email = 'Please enter your email.'
    else if (!email.includes('@')) newErrors.email = 'Please enter a valid email.'

    if (!password.trim()) newErrors.password = 'Please enter your password.'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.'

    setErrors(newErrors)
    setAuthMessage('')

    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)

    if (mode === 'sign-in') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      setIsSubmitting(false)

      if (error || !data.user?.email) {
        setAuthMessage('Unable to sign in. Check your email and password and try again.')
        return
      }

      onAuthenticated(data.user.email)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setAuthMessage('Unable to create your account. Please try again.')
      return
    }

    if (data.session && data.user?.email) {
      onAuthenticated(data.user.email)
      return
    }

    setAuthMessage('Check your email to confirm your account, then sign in.')
  }

  return (
    <main className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-teal-700)', marginBottom: 'var(--space-2)' }}>
            🛡️ HeatShield Renter
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginBottom: 0 }}>
            {mode === 'sign-in' ? 'Sign in to start your Heat Check' : 'Create an account to start your Heat Check'}
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
              placeholder="Enter your password"
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

          {authMessage && (
            <p className="field-error" role="alert">
              {authMessage}
            </p>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', textAlign: 'center', marginTop: 'var(--space-4)', marginBottom: 0 }}>
          {mode === 'sign-in' ? 'New to HeatShield Renter?' : 'Already have an account?'}
          {' '}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: 0, border: 0, background: 'none', textDecoration: 'underline' }}
            onClick={() => {
              setMode((currentMode) => currentMode === 'sign-in' ? 'sign-up' : 'sign-in')
              setErrors({})
              setAuthMessage('')
            }}
          >
            {mode === 'sign-in' ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </main>
  )
}
