/**
 * Navbar - Barra de navegación superior
 */
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Navbar.css';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{title || 'Sistema Veterinaria'}</h1>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-name">{user?.nombre_completo}</span>
          <span className="user-role">{user?.rol_nombre}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
