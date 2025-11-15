/**
 * GestionCitas - Gestión COMPLETA de citas veterinarias
 * Muestra OBSERVACIONES destacadas en amarillo
 * Solo muestra citas del veterinario actual
 */
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { citasAPI } from '../../../models/api';
import '../../../styles/Tables.css';

const GestionCitas = () => {
  const { success, error: showError } = useToast();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [modalPosponer, setModalPosponer] = useState(null);
  const [nuevaFechaHora, setNuevaFechaHora] = useState('');

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      // Obtener SOLO las citas del veterinario actual
      const misCitas = await citasAPI.getMisCitasVeterinario();
      setCitas(misCitas);
    } catch (error) {
      console.error('Error cargando citas:', error);
      showError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleAceptar = async (id) => {
    try {
      await citasAPI.aceptar(id);
      success('Cita aceptada exitosamente');
      cargarCitas();
    } catch (error) {
      console.error('Error al aceptar cita:', error);
      showError('Error al aceptar la cita');
    }
  };

  const handlePosponer = async (id) => {
    if (!nuevaFechaHora) {
      showError('Debe seleccionar una nueva fecha y hora');
      return;
    }

    try {
      await citasAPI.posponer(id, nuevaFechaHora);
      success('Cita pospuesta exitosamente');
      setModalPosponer(null);
      setNuevaFechaHora('');
      cargarCitas();
    } catch (error) {
      console.error('Error al posponer cita:', error);
      showError('Error al posponer la cita');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Está seguro de cancelar esta cita?')) {
      return;
    }

    try {
      await citasAPI.cancelar(id);
      success('Cita cancelada');
      cargarCitas();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      showError('Error al cancelar la cita');
    }
  };

  const handleCompletar = async (id) => {
    try {
      await citasAPI.completar(id);
      success('Cita completada');
      cargarCitas();
    } catch (error) {
      console.error('Error al completar cita:', error);
      showError('Error al completar la cita');
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

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  // Filtrar citas por estado
  const citasFiltradas = citas.filter((cita) => {
    if (filtroEstado === 'todas') return true;
    return cita.estado === filtroEstado;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className="gestion-container">
      <div className="page-header">
        <h1>Gestión de Citas</h1>
        <p>Administre todas sus citas veterinarias</p>
      </div>

      {/* Filtros */}
      <div className="filters">
        <label>Filtrar por estado:</label>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="completada">Completadas</option>
          <option value="cancelada">Canceladas</option>
        </select>

        <span className="badge-info">
          Total: {citasFiltradas.length} cita(s)
        </span>
      </div>

      {/* Tabla de Citas */}
      <div className="table-container">
        {citasFiltradas.length === 0 ? (
          <div className="no-data">
            <p>No hay citas que mostrar.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th>Mascota</th>
                <th>Tutor</th>
                <th>Motivo</th>
                <th className="observaciones-header">Observaciones</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita) => (
                <tr key={cita.id}>
                  <td>{formatFecha(cita.fecha_hora)}</td>
                  <td>{cita.mascota_nombre}</td>
                  <td>{cita.tutor_nombre}</td>
                  <td>{cita.motivo}</td>
                  <td className="observaciones-cell-yellow">
                    {cita.observaciones || '-'}
                  </td>
                  <td>
                    <span className={`badge badge-${cita.estado}`}>{cita.estado}</span>
                  </td>
                  <td className="actions-cell">
                    {cita.estado === 'pendiente' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAceptar(cita.id)}
                        >
                          Aceptar
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setModalPosponer(cita.id)}
                        >
                          Posponer
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancelar(cita.id)}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {cita.estado === 'confirmada' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleCompletar(cita.id)}
                        >
                          Completar
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setModalPosponer(cita.id)}
                        >
                          Posponer
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancelar(cita.id)}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {(cita.estado === 'completada' || cita.estado === 'cancelada') && (
                      <span className="no-actions">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para Posponer */}
      {modalPosponer && (
        <div className="modal-overlay" onClick={() => setModalPosponer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Posponer Cita</h2>
            <p>Seleccione la nueva fecha y hora para la cita:</p>

            <div className="form-group">
              <label>Nueva Fecha y Hora:</label>
              <input
                type="datetime-local"
                value={nuevaFechaHora}
                onChange={(e) => setNuevaFechaHora(e.target.value)}
                min={getMinDateTime()}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => handlePosponer(modalPosponer)}
              >
                Confirmar
              </button>
              <button className="btn btn-secondary" onClick={() => setModalPosponer(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos inline para las observaciones (amarillo) */}
      <style>{`
        .observaciones-cell-yellow {
          background-color: #fef3c7 !important;
          font-weight: 500;
          max-width: 300px;
          white-space: normal;
        }

        .observaciones-header {
          background-color: #fde047;
        }

        .action-buttons {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .actions-cell {
          min-width: 200px;
        }

        .filters {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .badge-info {
          margin-left: auto;
          padding: 6px 12px;
          background: #3b82f6;
          color: white;
          border-radius: 4px;
          font-size: 14px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          min-width: 400px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: flex-end;
        }

        .no-actions {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default GestionCitas;
