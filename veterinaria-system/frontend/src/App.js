import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Controllers (lógica de negocio y contexts)
import { AuthProvider, ToastProvider } from './controllers';
// Views (componentes de presentación)
import {
  Login,
  AdminDashboard,
  VeterinarioDashboard,
  TutorDashboard,
  ProtectedRoute
} from './views';
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
