/**
 * AdminHome - Página de inicio del administrador con estadísticas
 * Muestra resumen general del sistema
 * Arquitectura MVC - Vista de Admin
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { usuariosAPI, mascotasAPI, citasAPI, inventarioAPI } from '../../../models/api';
import '../../../styles/AdminHome.css';

const AdminHome = () => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const [estadisticas, setEstadisticas] = useState({
    total_usuarios: 0,
    total_mascotas: 0,
    total_citas: 0,
    citas_pendientes: 0,
    productos_bajo_stock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo cargar datos si hay usuario autenticado
    if (user) {
      cargarEstadisticas();
    }
  }, [user]); // Ejecutar cuando cambie el usuario

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);

      // Cargar datos en paralelo
      const [usuarios, mascotas, citas, inventarioBajo] = await Promise.all([
        usuariosAPI.getAll().catch(() => []),
        mascotasAPI.getAll().catch(() => []),
        citasAPI.getAll().catch(() => []),
        inventarioAPI.getBajoStock().catch(() => []),
      ]);

      // Calcular estadísticas
      const citasPendientes = Array.isArray(citas)
        ? citas.filter((c) => c.estado === 'pendiente').length
        : 0;

      setEstadisticas({
        total_usuarios: Array.isArray(usuarios) ? usuarios.length : 0,
        total_mascotas: Array.isArray(mascotas) ? mascotas.length : 0,
        total_citas: Array.isArray(citas) ? citas.length : 0,
        citas_pendientes: citasPendientes,
        productos_bajo_stock: Array.isArray(inventarioBajo) ? inventarioBajo.length : 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      showError('Error al cargar las estadísticas del sistema');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando estadísticas...</h2>
      </div>
    );
  }

  return (
    <div className="admin-home">
      <div className="page-header">
        <h1>Bienvenido, {user?.nombre_completo}</h1>
        <p>Panel de administración del sistema veterinario</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/admin/usuarios')}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Usuarios</h3>
            <p className="stat-number">{estadisticas.total_usuarios}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/admin/mascotas')}>
          <div className="stat-icon">🐾</div>
          <div className="stat-info">
            <h3>Mascotas</h3>
            <p className="stat-number">{estadisticas.total_mascotas}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/admin/citas')}>
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Citas Totales</h3>
            <p className="stat-number">{estadisticas.total_citas}</p>
          </div>
        </div>

        <div className="stat-card warning" onClick={() => navigate('/admin/citas')}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Citas Pendientes</h3>
            <p className="stat-number">{estadisticas.citas_pendientes}</p>
          </div>
        </div>

        <div className="stat-card danger" onClick={() => navigate('/admin/inventario')}>
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Stock Bajo</h3>
            <p className="stat-number">{estadisticas.productos_bajo_stock}</p>
          </div>
        </div>
      </div>

      {/* Acceso Rápido */}
      <div className="quick-access">
        <h2>Acceso Rápido</h2>
        <div className="quick-actions">
          <button
            className="action-btn"
            onClick={() => navigate('/admin/usuarios')}
          >
            <span className="btn-icon">👤</span>
            <span>Gestionar Usuarios</span>
          </button>
          <button
            className="action-btn"
            onClick={() => navigate('/admin/tutores')}
          >
            <span className="btn-icon">👨‍👩‍👧</span>
            <span>Gestionar Tutores</span>
          </button>
          <button
            className="action-btn"
            onClick={() => navigate('/admin/mascotas')}
          >
            <span className="btn-icon">🐕</span>
            <span>Gestionar Mascotas</span>
          </button>
          <button
            className="action-btn"
            onClick={() => navigate('/admin/citas')}
          >
            <span className="btn-icon">🗓️</span>
            <span>Gestionar Citas</span>
          </button>
          <button
            className="action-btn"
            onClick={() => navigate('/admin/inventario')}
          >
            <span className="btn-icon">📋</span>
            <span>Gestionar Inventario</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-home {
          padding: 20px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 28px;
          margin-bottom: 5px;
        }

        .page-header p {
          color: #666;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-card.warning {
          background: #fef3c7;
        }

        .stat-card.danger {
          background: #fee2e2;
        }

        .stat-icon {
          font-size: 40px;
        }

        .stat-info h3 {
          font-size: 14px;
          color: #666;
          margin: 0 0 8px 0;
        }

        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }

        .quick-access {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .quick-access h2 {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .action-btn:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .btn-icon {
          font-size: 24px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
      `}</style>
    </div>
  );
};

export default AdminHome;
