/**
 * VetHome - Página de inicio del veterinario
 * Muestra citas PENDIENTES destacadas y próximas confirmadas
 * FILTRADO POR ID DEL VETERINARIO (no por nombre)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { citasAPI } from '../../../models/api';

const VetHome = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [citasPendientes, setCitasPendientes] = useState([]);
  const [citasProximas, setCitasProximas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);

      // Obtener CITAS PENDIENTES (destacadas)
      const pendientes = await citasAPI.getPendientes();
      setCitasPendientes(pendientes);

      // Obtener TODAS las citas del veterinario
      const todasMisCitas = await citasAPI.getMisCitasVeterinario();

      // Filtrar solo confirmadas para la sección de "Próximas Citas"
      const proximasConfirmadas = todasMisCitas.filter(
        (cita) => cita.estado === 'confirmada'
      );
      setCitasProximas(proximasConfirmadas);
    } catch (error) {
      console.error('Error cargando citas:', error);
      showError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleAceptar = async (citaId) => {
    try {
      await citasAPI.aceptar(citaId);
      success('Cita aceptada exitosamente');
      cargarCitas(); // Recargar citas
    } catch (error) {
      console.error('Error al aceptar cita:', error);
      showError('Error al aceptar la cita');
    }
  };

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className="vet-home">
      <div className="page-header">
        <h1>Bienvenido, Dr(a). {user?.nombre_completo}</h1>
        <p>Panel de gestión de consultas veterinarias</p>
      </div>

      {/* SECCIÓN DESTACADA: CITAS PENDIENTES */}
      {citasPendientes.length > 0 && (
        <div className="section highlighted-section">
          <div className="section-header">
            <h2>⚠️ Citas Pendientes de Confirmación ({citasPendientes.length})</h2>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/veterinario/citas')}
            >
              Ver Todas las Citas
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Mascota</th>
                  <th>Tutor</th>
                  <th>Motivo</th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasPendientes.map((cita) => (
                  <tr key={cita.id} className="pending-row">
                    <td>{formatFecha(cita.fecha_hora)}</td>
                    <td>{cita.mascota_nombre}</td>
                    <td>{cita.tutor_nombre}</td>
                    <td>{cita.motivo}</td>
                    <td className="observaciones-cell">
                      {cita.observaciones || '-'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAceptar(cita.id)}
                      >
                        Aceptar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECCIÓN: PRÓXIMAS CITAS CONFIRMADAS */}
      <div className="section">
        <h2>Próximas Citas Confirmadas</h2>
        {citasProximas.length === 0 ? (
          <div className="no-data">
            <p>No hay citas confirmadas programadas.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Mascota</th>
                  <th>Tutor</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citasProximas.slice(0, 10).map((cita) => (
                  <tr key={cita.id}>
                    <td>{formatFecha(cita.fecha_hora)}</td>
                    <td>{cita.mascota_nombre}</td>
                    <td>{cita.tutor_nombre}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <span className="badge badge-confirmada">Confirmada</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACCESO RÁPIDO */}
      <div className="quick-actions">
        <h3>Acceso Rápido</h3>
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/veterinario/citas')}
          >
            Gestionar Todas las Citas
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/veterinario/historiales')}
          >
            Ver Historiales Médicos
          </button>
        </div>
      </div>
    </div>
  );
};

export default VetHome;
