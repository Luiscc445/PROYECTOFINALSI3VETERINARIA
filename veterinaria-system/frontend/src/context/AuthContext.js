/**
 * AuthContext - Contexto de autenticación
 * Maneja el estado de autenticación del usuario en toda la aplicación
 * REAL API - Conexión con backend Django
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../models/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión activa al cargar la aplicación
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          // Verificar con el backend si la sesión sigue activa
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          // Actualizar localStorage con datos frescos
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          // Sesión expirada o inválida
          console.error('Sesión inválida:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Login con API real
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    }
  };

  // Logout con API real
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Siempre limpiar el estado local
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
