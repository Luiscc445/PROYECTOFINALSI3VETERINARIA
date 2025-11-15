/**
 * AdminHome - Página de inicio del administrador con estadísticas
 */
import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../../services/api';
import '../../styles/AdminHome.css';

const AdminHome = () => {
  const [estadisticas, setEstadisticas] = useState({
    total_mascotas: 0,
    total_tutores: 0,
    citas_pendientes: 0,
    citas_hoy: 0,
    productos_bajo_stock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await dashboardAPI.getEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="admin-home">
      <h1>Panel de Control - Administrador</h1>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">🐾</div>
          <div className="stat-content">
            <h3>{estadisticas.total_mascotas}</h3>
            <p>Mascotas Registradas</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">👨‍👩‍👧</div>
          <div className="stat-content">
            <h3>{estadisticas.total_tutores}</h3>
            <p>Tutores Activos</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{estadisticas.citas_pendientes}</h3>
            <p>Citas Pendientes</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">🕐</div>
          <div className="stat-content">
            <h3>{estadisticas.citas_hoy}</h3>
            <p>Citas Hoy</p>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{estadisticas.productos_bajo_stock}</h3>
            <p>Productos Bajo Stock</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-btn btn-primary">
            👥 Gestionar Usuarios
          </button>
          <button className="action-btn btn-success">
            👨‍👩‍👧 Gestionar Tutores
          </button>
          <button className="action-btn btn-warning">
            📦 Ver Inventario
          </button>
          <button className="action-btn btn-info">
            📊 Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
