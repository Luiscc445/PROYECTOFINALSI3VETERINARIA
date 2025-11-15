/**
 * Aplicación Principal
 * Arquitectura MVC - Punto de Entrada
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Login, AdminDashboard, VeterinarioDashboard, TutorDashboard } from './views/pages';
import { ProtectedRoute } from './views/components/common';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas del Administrador */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Rutas del Veterinario */}
            <Route
              path="/veterinario/*"
              element={
                <ProtectedRoute allowedRoles={['veterinario']}>
                  <VeterinarioDashboard />
                </ProtectedRoute>
              }
            />

            {/* Rutas del Tutor */}
            <Route
              path="/tutor/*"
              element={
                <ProtectedRoute allowedRoles={['tutor']}>
                  <TutorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
