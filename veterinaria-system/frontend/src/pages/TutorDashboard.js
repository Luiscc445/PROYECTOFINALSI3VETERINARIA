/**
 * TutorDashboard - Dashboard del tutor (dueño de mascotas)
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TutorHome from '../components/tutor/TutorHome';
import MisMascotas from '../components/tutor/MisMascotas';
import MisCitas from '../components/tutor/MisCitas';
import SolicitarCita from '../components/tutor/SolicitarCita';
import HistorialMedico from '../components/tutor/HistorialMedico';
import '../styles/Dashboard.css';

const TutorDashboard = () => {
  const sidebarLinks = [
    { path: '/tutor', label: 'Inicio', icon: '🏠', end: true },
    { path: '/tutor/mascotas', label: 'Mis Mascotas', icon: '🐕' },
    { path: '/tutor/solicitar-cita', label: 'Solicitar Cita', icon: '🏥' },
    { path: '/tutor/citas', label: 'Mis Citas', icon: '📅' },
    { path: '/tutor/historial', label: 'Historial Médico', icon: '📋' },
  ];

  return (
    <div className="dashboard-container">
      <Navbar title="Panel del Tutor" />
      <div className="dashboard-content">
        <Sidebar links={sidebarLinks} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TutorHome />} />
            <Route path="/mascotas" element={<MisMascotas />} />
            <Route path="/solicitar-cita" element={<SolicitarCita />} />
            <Route path="/citas" element={<MisCitas />} />
            <Route path="/historial" element={<HistorialMedico />} />
            <Route path="*" element={<Navigate to="/tutor" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TutorDashboard;
