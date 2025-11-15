/**
 * GestionCitas - Gestión de citas veterinarias mejorada
 */
import React, { useState, useEffect } from 'react';
import { citasAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CrearHistorial from './CrearHistorial';
import '../../styles/Tables.css';

const GestionCitas = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPosponerModal, setShowPosponerModal] = useState(false);
  const [showAtenderModal, setShowAtenderModal] = useState(false);
  const [citaPosponer, setCitaPosponer] = useState(null);
  const [citaAtender, setCitaAtender] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await citasAPI.getAll();
      const todasCitas = response.data.results || response.data;

      // Filtrar citas del veterinario actual
      const citasVeterinario = todasCitas.filter(
        cita => cita.veterinario_nombre === user.nombre_completo
      );

      setCitas(citasVeterinario);
    } catch (error) {
      console.error('Error cargando citas:', error);
      toast.error('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await citasAPI.cambiarEstado(id, nuevoEstado);
      toast.success(\`Cita \${nuevoEstado} exitosamente\`);
      cargarCitas();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast.error('Error al cambiar estado de la cita');
    }
  };

  const abrirModalPosponer = (cita) => {
    setCitaPosponer(cita);
    const fechaActual = new Date(cita.fecha_hora);
    const fechaFormateada = fechaActual.toISOString().slice(0, 16);
    setNuevaFecha(fechaFormateada);
    setShowPosponerModal(true);
  };

  const abrirModalAtender = (cita) => {
    setCitaAtender(cita);
    setShowAtenderModal(true);
  };

  const posponerCita = async () => {
    if (!nuevaFecha) {
      toast.error('Debe seleccionar una nueva fecha');
      return;
    }

    try {
      await citasAPI.posponer(citaPosponer.id, nuevaFecha);
      toast.success('Cita pospuesta exitosamente para ' + format(new Date(nuevaFecha), 'dd/MM/yyyy HH:mm', { locale: es }));
      setShowPosponerModal(false);
      setCitaPosponer(null);
      setNuevaFecha('');
      cargarCitas();
    } catch (error) {
      console.error('Error posponiendo cita:', error);
      toast.error('Error al posponer la cita');
    }
  };

  const citasFiltradas = filtroEstado === 'todos'
    ? citas
    : citas.filter(c => c.estado === filtroEstado);

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Mis Citas Médicas</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label htmlFor="filtro-estado" style={{ fontWeight: 'bold' }}>Filtrar:</label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '2px solid #ddd' }}
          >
            <option value="todos">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Mascota</th>
              <th>Tutor</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                  No hay citas {filtroEstado !== 'todos' && \`en estado \${filtroEstado}\`}
                </td>
              </tr>
            ) : (
              citasFiltradas.map((cita) => (
                <tr key={cita.id}>
                  <td>
                    <strong>{format(new Date(cita.fecha_hora), 'dd/MM/yyyy', { locale: es })}</strong>
                    <br />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      {format(new Date(cita.fecha_hora), 'HH:mm', { locale: es })}
                    </span>
                  </td>
                  <td><strong>{cita.mascota_nombre}</strong></td>
                  <td>{cita.tutor_nombre}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <span className={\`badge badge-\${cita.estado}\`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td>
                    {cita.estado === 'pendiente' && (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => cambiarEstado(cita.id, 'confirmada')}
                          title="Aceptar cita"
                        >
                          ✓ Aceptar
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => abrirModalPosponer(cita)}
                          title="Posponer para otra fecha"
                        >
                          📅 Posponer
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => cambiarEstado(cita.id, 'cancelada')}
                          title="Cancelar cita"
                        >
                          ✗ Cancelar
                        </button>
                      </div>
                    )}
                    {cita.estado === 'confirmada' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => abrirModalAtender(cita)}
                        style={{ fontWeight: 'bold' }}
                      >
                        🏥 Atender Paciente
                      </button>
                    )}
                    {(cita.estado === 'completada' || cita.estado === 'cancelada') && (
                      <span style={{ color: '#999' }}>Finalizada</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para posponer cita */}
      {showPosponerModal && citaPosponer && (
        <div className="modal-overlay" onClick={() => setShowPosponerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Posponer Cita</h2>
              <button className="modal-close" onClick={() => setShowPosponerModal(false)}>×</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p><strong>Mascota:</strong> {citaPosponer.mascota_nombre}</p>
              <p><strong>Tutor:</strong> {citaPosponer.tutor_nombre}</p>
              <p><strong>Motivo:</strong> {citaPosponer.motivo}</p>
              <p><strong>Fecha actual:</strong> {format(new Date(citaPosponer.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
            </div>

            <div className="form-group">
              <label htmlFor="nueva-fecha">Nueva Fecha y Hora *</label>
              <input
                id="nueva-fecha"
                type="datetime-local"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPosponerModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={posponerCita}
              >
                Posponer Cita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para atender paciente */}
      {showAtenderModal && citaAtender && (
        <CrearHistorial
          cita={citaAtender}
          onClose={() => {
            setShowAtenderModal(false);
            setCitaAtender(null);
          }}
          onSuccess={() => {
            cargarCitas();
          }}
        />
      )}
    </div>
  );
};

export default GestionCitas;
