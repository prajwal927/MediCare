// ─────────────────────────────────────────────────────────────
//  MediCare Simple Backend  –  server.js
//  Stack: Node.js + Express
//  No database — data lives in memory (perfect for demos)
// ─────────────────────────────────────────────────────────────

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── In-Memory Data Store ──────────────────────────────────────
// This replaces MongoDB — data resets when server restarts.
// In the real project this comes from MongoDB via Mongoose.

let doctors = [
  { id: 1, name: 'Dr. Priya Sharma',  specialization: 'Cardiologist',      fee: 800,  available: true,  image: '👩‍⚕️', experience: '12 yrs' },
  { id: 2, name: 'Dr. Rahul Mehta',   specialization: 'Neurologist',        fee: 900,  available: true,  image: '👨‍⚕️', experience: '15 yrs' },
  { id: 3, name: 'Dr. Sneha Patel',   specialization: 'Dermatologist',      fee: 600,  available: false, image: '👩‍⚕️', experience: '8 yrs'  },
  { id: 4, name: 'Dr. Arjun Singh',   specialization: 'Orthopedic',         fee: 750,  available: true,  image: '👨‍⚕️', experience: '10 yrs' },
  { id: 5, name: 'Dr. Kavya Nair',    specialization: 'Pediatrician',       fee: 500,  available: true,  image: '👩‍⚕️', experience: '6 yrs'  },
  { id: 6, name: 'Dr. Vikram Joshi',  specialization: 'General Physician',  fee: 400,  available: true,  image: '👨‍⚕️', experience: '20 yrs' },
];

let appointments = [
  { id: 1, doctorId: 1, doctorName: 'Dr. Priya Sharma', patientName: 'Rohan Kumar',    date: '2026-04-20', time: '10:00 AM', status: 'confirmed' },
  { id: 2, doctorId: 3, doctorName: 'Dr. Sneha Patel',  patientName: 'Anita Sharma',   date: '2026-04-21', time: '11:30 AM', status: 'pending'   },
  { id: 3, doctorId: 2, doctorName: 'Dr. Rahul Mehta',  patientName: 'Suresh Pillai',  date: '2026-04-22', time: '02:00 PM', status: 'confirmed' },
];

let nextAppointmentId = 4;

// ── ROUTES ────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🏥 MediCare Simple API is running ✅', port: PORT });
});

// GET  /api/doctors  — list all doctors (optional ?spec= filter)
app.get('/api/doctors', (req, res) => {
  const { spec } = req.query;
  let result = doctors;
  if (spec) {
    result = doctors.filter(d =>
      d.specialization.toLowerCase().includes(spec.toLowerCase())
    );
  }
  res.json({ success: true, data: result });
});

// GET  /api/doctors/:id
app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: doctor });
});

// GET  /api/appointments
app.get('/api/appointments', (req, res) => {
  res.json({ success: true, data: appointments });
});

// POST /api/appointments  — book a new appointment
app.post('/api/appointments', (req, res) => {
  const { doctorId, patientName, date, time } = req.body;

  // Basic validation
  if (!doctorId || !patientName || !date || !time) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  if (!doctor.available) return res.status(400).json({ success: false, message: 'Doctor not available' });

  const newAppointment = {
    id: nextAppointmentId++,
    doctorId: parseInt(doctorId),
    doctorName: doctor.name,
    patientName: patientName.trim(),
    date,
    time,
    status: 'pending',
  };

  appointments.push(newAppointment);
  res.status(201).json({ success: true, message: 'Appointment booked!', data: newAppointment });
});

// DELETE /api/appointments/:id  — cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = appointments.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });
  appointments.splice(idx, 1);
  res.json({ success: true, message: 'Appointment cancelled' });
});

// GET  /api/stats  — dashboard numbers
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalDoctors:      doctors.length,
      availableDoctors:  doctors.filter(d => d.available).length,
      totalAppointments: appointments.length,
      confirmed:         appointments.filter(a => a.status === 'confirmed').length,
    }
  });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 MediCare Simple API → http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  /api/doctors`);
  console.log(`   GET  /api/appointments`);
  console.log(`   POST /api/appointments`);
  console.log(`   DELETE /api/appointments/:id`);
  console.log(`   GET  /api/stats\n`);
});
