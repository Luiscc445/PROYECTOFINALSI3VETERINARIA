/**
 * ProtectedRoute - Componente para proteger rutas por rol
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el rol del usuario está permitido
  if (allowedRoles && !allowedRoles.includes(user.rol_nombre)) {
    // Redirigir según el rol
    if (user.rol_nombre === 'administrador') {
      return <Navigate to="/admin" replace />;
    } else if (user.rol_nombre === 'veterinario') {
      return <Navigate to="/veterinario" replace />;
    } else if (user.rol_nombre === 'tutor') {
      return <Navigate to="/tutor" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
