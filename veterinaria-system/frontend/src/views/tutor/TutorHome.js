/**
 * TutorHome - Página de inicio del tutor
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI, citasAPI, tutoresAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TutorHome = () => {
  const [resumen, setResumen] = useState({
    totalMascotas: 0,
    citasPendientes: 0,
  });
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      // Obtener datos del tutor actual
      const tutorResponse = await tutoresAPI.getMe();
      const tutorId = tutorResponse.data.id;

      // Obtener solo las mascotas de este tutor
      const mascotasRes = await mascotasAPI.getMisMascotas(tutorId);

      // Obtener solo las citas de este tutor
      const citasRes = await citasAPI.getMisCitas(tutorId);

      setResumen({
        totalMascotas: mascotasRes.data?.length || 0,
        citasPendientes: citasRes.data?.filter(c => c.estado === 'pendiente').length || 0,
      });
    } catch (error) {
      console.error('Error cargando resumen:', error);
      toast.error('Error al cargar el resumen');
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
