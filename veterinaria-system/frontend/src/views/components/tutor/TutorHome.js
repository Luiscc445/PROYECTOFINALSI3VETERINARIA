/**
 * TutorHome - Página de inicio del tutor
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI, citasAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TutorHome = () => {
  const [resumen, setResumen] = useState({
    totalMascotas: 0,
    citasPendientes: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      // Aquí normalmente harías llamadas específicas para el tutor
      // Por simplicidad, usamos valores de ejemplo
      const mascotasRes = await mascotasAPI.getAll();
      const citasRes = await citasAPI.getAll();

      setResumen({
        totalMascotas: mascotasRes.data.results?.length || 0,
        citasPendientes: citasRes.data.results?.filter(c => c.estado === 'pendiente').length || 0,
      });
    } catch (error) {
      console.error('Error cargando resumen:', error);
    }
  };

  return (
    <div className="tutor-home">
      <h1>Bienvenido, {user.nombre_completo}</h1>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">🐾</div>
          <div className="stat-content">
            <h3>{resumen.totalMascotas}</h3>
            <p>Mis Mascotas</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{resumen.citasPendientes}</h3>
            <p>Citas Pendientes</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Acceso Rápido</h2>
        <div className="quick-links">
          <button className="btn btn-primary btn-large">
            🐕 Ver Mis Mascotas
          </button>
          <button className="btn btn-success btn-large">
            📅 Mis Citas
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorHome;
