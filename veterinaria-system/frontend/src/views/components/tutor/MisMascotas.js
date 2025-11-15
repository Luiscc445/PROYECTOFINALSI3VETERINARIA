/**
 * MisMascotas - Vista de las mascotas del tutor
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI } from '../../services/api';
import '../../styles/Tables.css';

const MisMascotas = () => {
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
    }
  };

  if (loading) {
    return <div className="loading">Cargando mascotas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Mis Mascotas</h1>
      </div>

      <div className="mascotas-grid">
        {mascotas.map((mascota) => (
          <div key={mascota.id} className="mascota-card">
            {mascota.foto_url && (
              <img src={mascota.foto_url} alt={mascota.nombre} className="mascota-foto" />
            )}
            <h3>{mascota.nombre}</h3>
            <p><strong>Especie:</strong> {mascota.especie}</p>
            <p><strong>Raza:</strong> {mascota.raza}</p>
            <p><strong>Edad:</strong> {mascota.edad_anos} años</p>
            <p><strong>Sexo:</strong> {mascota.sexo}</p>
            <p><strong>Peso:</strong> {mascota.peso_kg} kg</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => verHistorial(mascota.id)}
            >
              Ver Historial
            </button>
          </div>
        ))}
      </div>

      {mascotaDetalle && (
        <div className="modal-overlay" onClick={() => setMascotaDetalle(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Historial de {mascotaDetalle.nombre}</h2>
              <button className="modal-close" onClick={() => setMascotaDetalle(null)}>×</button>
            </div>

            <div className="historial-section">
              <h3>Historiales Médicos</h3>
              {mascotaDetalle.historiales?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Diagnóstico</th>
                      <th>Veterinario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotaDetalle.historiales.map((h) => (
                      <tr key={h.id}>
                        <td>{new Date(h.fecha).toLocaleDateString()}</td>
                        <td>{h.tipo}</td>
                        <td>{h.diagnostico}</td>
                        <td>{h.veterinario_nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Sin historiales médicos</p>
              )}
            </div>

            <div className="historial-section">
              <h3>Citas</h3>
              {mascotaDetalle.citas?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Motivo</th>
                      <th>Estado</th>
                      <th>Veterinario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotaDetalle.citas.map((c) => (
                      <tr key={c.id}>
                        <td>{new Date(c.fecha_hora).toLocaleDateString()}</td>
                        <td>{c.motivo}</td>
                        <td>
                          <span className={`badge badge-${c.estado}`}>{c.estado}</span>
                        </td>
                        <td>{c.veterinario_nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Sin citas programadas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisMascotas;
