/**
 * GestionMascotas - Gestión completa de mascotas para administradores
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import '../../styles/Tables.css';

const GestionMascotas = () => {
  const toast = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mascotaDetalle, setMascotaDetalle] = useState(null);

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      const response = await mascotasAPI.getAll();
      setMascotas(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      toast.error('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const verHistorial = async (id) => {
    try {
      const response = await mascotasAPI.getHistorialCompleto(id);
      setMascotaDetalle(response.data);
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast.error('Error al cargar el historial de la mascota');
    }
  };

  const toggleActivo = async (mascota) => {
    try {
      await mascotasAPI.update(mascota.id, {
        ...mascota,
        activo: !mascota.activo
      });
      toast.success(`Mascota ${mascota.activo ? 'desactivada' : 'activada'} exitosamente`);
      cargarMascotas();
    } catch (error) {
      console.error('Error actualizando mascota:', error);
      toast.error('Error al actualizar mascota');
    }
  };

  if (loading) {
    return <div className="loading">Cargando mascotas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Mascotas</h1>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          Total de mascotas: {mascotas.length}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Tutor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((mascota) => (
              <tr key={mascota.id}>
                <td>{mascota.id}</td>
                <td><strong>{mascota.nombre}</strong></td>
                <td>{mascota.especie}</td>
                <td>{mascota.raza}</td>
                <td>{mascota.edad_anos} años</td>
                <td>{mascota.sexo}</td>
                <td>{mascota.tutor_nombre}</td>
                <td>
                  <span className={`badge ${mascota.activo ? 'badge-completada' : 'badge-cancelada'}`}>
                    {mascota.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => verHistorial(mascota.id)}
                    title="Ver historial médico completo"
                  >
                    📋
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => toggleActivo(mascota)}
                    title={mascota.activo ? 'Desactivar' : 'Activar'}
                  >
                    {mascota.activo ? '🔴' : '🟢'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de historial/ficha médica completa */}
      {mascotaDetalle && (
        <div className="modal-overlay" onClick={() => setMascotaDetalle(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ficha Médica Completa - {mascotaDetalle.nombre}</h2>
              <button className="modal-close" onClick={() => setMascotaDetalle(null)}>×</button>
            </div>

            <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Información General</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div>
                  <strong>Especie:</strong> {mascotaDetalle.especie}
                </div>
                <div>
                  <strong>Raza:</strong> {mascotaDetalle.raza}
                </div>
                <div>
                  <strong>Edad:</strong> {mascotaDetalle.edad_anos} años
                </div>
                <div>
                  <strong>Sexo:</strong> {mascotaDetalle.sexo}
                </div>
                <div>
                  <strong>Color:</strong> {mascotaDetalle.color}
                </div>
                <div>
                  <strong>Peso:</strong> {mascotaDetalle.peso_kg} kg
                </div>
                <div>
                  <strong>Tutor:</strong> {mascotaDetalle.tutor_nombre}
                </div>
                <div>
                  <strong>Estado:</strong> {mascotaDetalle.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Historiales Médicos</h3>
              {mascotaDetalle.historiales?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Diagnóstico</th>
                      <th>Tratamiento</th>
                      <th>Medicamentos</th>
                      <th>Veterinario</th>
                      <th>Peso (kg)</th>
                      <th>Temp (°C)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotaDetalle.historiales.map((h) => (
                      <tr key={h.id}>
                        <td>{new Date(h.fecha).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${h.tipo}`}>{h.tipo}</span></td>
                        <td>{h.diagnostico}</td>
                        <td>{h.tratamiento}</td>
                        <td>{h.medicamentos || '-'}</td>
                        <td>{h.veterinario_nombre}</td>
                        <td>{h.peso_kg || '-'}</td>
                        <td>{h.temperatura_c || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Sin historiales médicos registrados
                </p>
              )}
            </div>

            <div>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Citas Médicas</h3>
              {mascotaDetalle.citas?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha/Hora</th>
                      <th>Motivo</th>
                      <th>Estado</th>
                      <th>Veterinario</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotaDetalle.citas.map((c) => (
                      <tr key={c.id}>
                        <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                        <td>{c.motivo}</td>
                        <td>
                          <span className={`badge badge-${c.estado}`}>{c.estado}</span>
                        </td>
                        <td>{c.veterinario_nombre}</td>
                        <td>{c.observaciones || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Sin citas programadas
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMascotas;
