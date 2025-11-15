/**
 * VeterinarioDashboard - Dashboard del veterinario
 * Arquitectura MVC - Capa de Vistas
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/common';
import { VetHome, GestionCitas, HistorialesMedicos } from '../components/veterinario';
import '../../styles/Dashboard.css';

const VeterinarioDashboard = () => {
  const sidebarLinks = [
    { path: '/veterinario', label: 'Inicio', icon: '🏠', end: true },
    { path: '/veterinario/citas', label: 'Citas', icon: '📅' },
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
            <Route path="/citas" element={<GestionCitas />} />
            <Route path="/historiales" element={<HistorialesMedicos />} />
            <Route path="*" element={<Navigate to="/veterinario" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default VeterinarioDashboard;
