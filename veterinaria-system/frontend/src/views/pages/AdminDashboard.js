/**
 * AdminDashboard - Dashboard del administrador
 * Arquitectura MVC - Capa de Vistas
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/common';
import { AdminHome, GestionUsuarios, GestionTutores, GestionMascotas, GestionCitas, GestionInventario } from '../components/admin';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
  const sidebarLinks = [
    { path: '/admin', label: 'Inicio', icon: '🏠', end: true },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/admin/tutores', label: 'Tutores', icon: '👨‍👩‍👧' },
    { path: '/admin/mascotas', label: 'Mascotas', icon: '🐾' },
    { path: '/admin/citas', label: 'Citas', icon: '📅' },
    { path: '/admin/inventario', label: 'Inventario', icon: '📦' },
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
            <Route path="/citas" element={<GestionCitas />} />
            <Route path="/inventario" element={<GestionInventario />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
