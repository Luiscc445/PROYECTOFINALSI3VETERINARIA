/**
 * AdminDashboard - Dashboard del administrador
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminHome from '../components/admin/AdminHome';
import GestionUsuarios from '../components/admin/GestionUsuarios';
import GestionTutores from '../components/admin/GestionTutores';
import GestionMascotas from '../components/admin/GestionMascotas';
import GestionInventario from '../components/admin/GestionInventario';
import HistorialRecetas from '../components/admin/HistorialRecetas';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const sidebarLinks = [
    { path: '/admin', label: 'Inicio', icon: '🏠', end: true },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/admin/tutores', label: 'Tutores', icon: '👨‍👩‍👧' },
    { path: '/admin/mascotas', label: 'Mascotas', icon: '🐾' },
    { path: '/admin/inventario', label: 'Inventario', icon: '📦' },
    { path: '/admin/historial-recetas', label: 'Historial Recetas', icon: '📋' },
  ];

  return (
    <div className="dashboard-container">
      <Navbar title="Panel de Administración" />
      <div className="dashboard-content">
        <Sidebar links={sidebarLinks} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/usuarios" element={<GestionUsuarios />} />
            <Route path="/tutores" element={<GestionTutores />} />
            <Route path="/mascotas" element={<GestionMascotas />} />
            <Route path="/inventario" element={<GestionInventario />} />
            <Route path="/historial-recetas" element={<HistorialRecetas />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
