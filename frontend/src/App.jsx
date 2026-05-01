// src/App.jsx — Root router
// ─────────────────────────────────────────────────────────────
// Simple version of the full project's App.jsx
// Routes: / → Home | /doctors → Doctors | /book/:doctorId → Book
//         /appointments → Appointments | /login → Login
// ─────────────────────────────────────────────────────────────
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

import Navbar           from './components/Navbar'
import Toast            from './components/Toast'

import HomePage         from './pages/HomePage'
import DoctorsPage      from './pages/DoctorsPage'
import BookPage         from './pages/BookPage'
import AppointmentsPage from './pages/AppointmentsPage'
import LoginPage        from './pages/LoginPage'

export default function App() {
  return (
    // AppProvider wraps everything → any component can call useApp()
    <AppProvider>

      {/* Navbar stays on every page — same pattern as full project */}
      <Navbar />

      {/* Global toast notifications */}
      <Toast />

      {/* Page-level routing */}
      <Routes>
        <Route path="/"             element={<HomePage />}         />
        <Route path="/doctors"      element={<DoctorsPage />}      />
        <Route path="/book"         element={<BookPage />}         />
        <Route path="/book/:doctorId" element={<BookPage />}       />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/login"        element={<LoginPage />}        />

        {/* Catch-all → redirect home */}
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>

    </AppProvider>
  )
}
