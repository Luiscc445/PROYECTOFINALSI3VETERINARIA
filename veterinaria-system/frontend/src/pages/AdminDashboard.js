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
import GestionInventario from '../components/admin/GestionInventario';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const sidebarLinks = [
    { path: '/admin', label: 'Inicio', icon: '🏠', end: true },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/admin/tutores', label: 'Tutores', icon: '👨‍👩‍👧' },
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
            <Route path="/inventario" element={<GestionInventario />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
