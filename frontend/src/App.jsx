// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
// import NurseDashboard from './pages/nurse/Dashboard';
import PharmacistDashboard from './pages/pharmacist/Dashboard';
// import LabDashboard from './pages/lab/Dashboard';
import ReceptionistDashboard from './pages/receptionist/Dashboard';
// import AdminDashboard from './pages/admin/Dashboard';
import Layout from './components/layout/Layout';
import LabDashboard from './pages/lab/Dashboard';
// import PublicHome from './pages/public/Home';

function App() {
  const [userRole, setUserRole] = React.useState(null);

  // Simulating authentication
  const isAuthenticated = userRole !== null;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<PublicHome />} /> */}
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/patient/*" element={<Layout role="patient"><PatientDashboard /></Layout>} />
            <Route path="/doctor/*" element={<Layout role="doctor"><DoctorDashboard /></Layout>} />
            {/* <Route path="/nurse/*" element={<Layout role="nurse"><NurseDashboard /></Layout>} /> */}
            <Route path="/pharmacist/*" element={<Layout role="pharmacist"><PharmacistDashboard /></Layout>} />
            <Route path="/lab_technician/*" element={<Layout role="lab"><LabDashboard /></Layout>} />
            <Route path="/receptionist/*" element={<Layout role="receptionist"><ReceptionistDashboard /></Layout>} />
            {/* <Route path="/admin/*" element={<Layout role="admin"><AdminDashboard /></Layout>} /> */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;