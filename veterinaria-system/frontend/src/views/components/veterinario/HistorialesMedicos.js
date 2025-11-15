/**
 * HistorialesMedicos - Consulta de historiales médicos
 */
import React, { useState, useEffect } from 'react';
import { historialesAPI } from '../../../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/Tables.css';

const HistorialesMedicos = () => {
  const [historiales, setHistoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalleModal, setDetalleModal] = useState(null);

  useEffect(() => {
    cargarHistoriales();
  }, []);

  const cargarHistoriales = async () => {
    try {
      const response = await historialesAPI.getAll();
      setHistoriales(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando historiales:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = (historial) => {
    setDetalleModal(historial);
  };

  if (loading) {
    return <div className="loading">Cargando historiales...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Historiales Médicos</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Mascota</th>
              <th>Tipo</th>
              <th>Veterinario</th>
              <th>Diagnóstico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historiales.map((historial) => (
              <tr key={historial.id}>
                <td>
                  {format(new Date(historial.fecha), 'dd/MM/yyyy', { locale: es })}
                </td>
                <td>{historial.mascota_nombre}</td>
                <td>
                  <span className="badge">{historial.tipo}</span>
                </td>
                <td>{historial.veterinario_nombre}</td>
                <td>{historial.diagnostico.substring(0, 50)}...</td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => verDetalle(historial)}
                    title="Ver detalle"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalleModal && (
        <div className="modal-overlay" onClick={() => setDetalleModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle del Historial</h2>
              <button className="modal-close" onClick={() => setDetalleModal(null)}>×</button>
            </div>
            <div className="historial-detalle">
              <p><strong>Fecha:</strong> {format(new Date(detalleModal.fecha), 'dd/MM/yyyy', { locale: es })}</p>
              <p><strong>Mascota:</strong> {detalleModal.mascota_nombre}</p>
              <p><strong>Veterinario:</strong> {detalleModal.veterinario_nombre}</p>
              <p><strong>Tipo:</strong> {detalleModal.tipo}</p>
              <p><strong>Diagnóstico:</strong> {detalleModal.diagnostico}</p>
              <p><strong>Tratamiento:</strong> {detalleModal.tratamiento}</p>
              {detalleModal.medicamentos && (
                <p><strong>Medicamentos:</strong> {detalleModal.medicamentos}</p>
              )}
              {detalleModal.peso_kg && (
                <p><strong>Peso:</strong> {detalleModal.peso_kg} kg</p>
              )}
              {detalleModal.temperatura_c && (
                <p><strong>Temperatura:</strong> {detalleModal.temperatura_c} °C</p>
              )}
              {detalleModal.observaciones && (
                <p><strong>Observaciones:</strong> {detalleModal.observaciones}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialesMedicos;
