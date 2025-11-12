/**
 * VeterinarioDashboard - Dashboard del veterinario
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VetHome from '../components/veterinario/VetHome';
import VeterinarioConsultas from '../components/veterinario/VeterinarioConsultas';
import HistorialesMedicos from '../components/veterinario/HistorialesMedicos';
import '../styles/Dashboard.css';

const VeterinarioDashboard = () => {
  const sidebarLinks = [
    { path: '/veterinario', label: 'Inicio', icon: '🏠', end: true },
    { path: '/veterinario/consultas', label: 'Consultas y Recetas', icon: '🩺' },
    { path: '/veterinario/historiales', label: 'Historiales', icon: '📋' },
  ];

  return (
    <div className="dashboard-container">
      <Navbar title="Panel Veterinario" />
      <div className="dashboard-content">
        <Sidebar links={sidebarLinks} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VetHome />} />
            <Route path="/consultas" element={<VeterinarioConsultas />} />
            <Route path="/historiales" element={<HistorialesMedicos />} />
            <Route path="*" element={<Navigate to="/veterinario" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default VeterinarioDashboard;
