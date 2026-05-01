// src/pages/LoginPage.jsx
// ─────────────────────────────────────────────────────────────
// Demo login — no real JWT, just sets user in Context
// Shows: controlled form, role selection, context update
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login, toast } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', role: 'patient' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast('Please enter your name', 'error'); return }

    setLoading(true)
    // Simulate an API delay (in real project: POST /api/auth/login → JWT)
    await new Promise(r => setTimeout(r, 800))
    login(form.name.trim(), form.role)
    toast(`Welcome back, ${form.name}! 👋`)
    navigate('/')
    setLoading(false)
  }

  return (
    <div className="fade-in" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--gray-50)' }}>
      <div className="booking-form" style={{ width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
          <h2 style={{ fontSize: 26, marginBottom: 6 }}>Welcome Back</h2>
          <p style={{ fontSize: 14 }}>Sign in to manage your appointments</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="e.g. Rahul Kumar"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Role selector — shows how role-based access works */}
          <div className="form-group" style={{ marginBottom: 28 }}>
            <label>Login As</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {['patient', 'doctor', 'admin'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: r }))}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius)',
                    border: '2px solid',
                    borderColor: form.role === r ? 'var(--primary)' : 'var(--gray-200)',
                    background: form.role === r ? 'var(--primary-light)' : '#fff',
                    color: form.role === r ? 'var(--primary)' : 'var(--gray-600)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'var(--trans)',
                  }}
                >
                  {r === 'patient' ? '🙋' : r === 'doctor' ? '👨‍⚕️' : '⚙️'}<br />
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-500)' }}>
          Don't have an account?{' '}
          <Link to="/book" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Book as Guest →
          </Link>
        </p>

        {/* Note for demo */}
        <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.7 }}>
          💡 <strong>Demo mode:</strong> No password needed. In the full project, this sends credentials
          to <code>POST /api/auth/login</code> and receives a JWT token stored in localStorage.
        </div>
      </div>
    </div>
  )
}
