// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────
// Role-aware navigation bar
//  • Guest  → Home, Doctors, Appointments links
//  • Logged in → shows username + Logout
//  • Mobile → hamburger toggle
//
// In the full project this uses react-router <Link> + useLocation
// for active-state detection + react-icons for icons.
// Here we use NavLink from react-router-dom + Unicode symbols.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Nav links for each role
const GUEST_LINKS = [
  { to: '/',              label: '🏠 Home'         },
  { to: '/doctors',       label: '🩺 Find Doctors'  },
  { to: '/appointments',  label: '📅 Appointments'  },
]

export default function Navbar() {
  const { user, logout, toast } = useApp()
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)   // mobile menu state

  const handleLogout = () => {
    logout()
    toast('Logged out successfully.')
    navigate('/')
    setOpen(false)
  }

  const links = GUEST_LINKS  // extend here for role-based links

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* ── Logo ── */}
        <NavLink to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="logo-icon">🏥</div>
          Medi<span>Care</span>
        </NavLink>

        {/* ── Desktop links ── */}
        <div className={`navbar-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className={`navbar-right ${open ? 'open' : ''}`}>
          {user ? (
            <>
              <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                👤 <strong>{user.name}</strong>
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/book" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Book Now
              </NavLink>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>

      </div>
    </nav>
  )
}
