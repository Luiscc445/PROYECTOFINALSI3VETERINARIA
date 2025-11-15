/**
 * MisCitas - Vista de citas del tutor
 */
import React, { useState, useEffect } from 'react';
import { citasAPI } from '../../../models/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../../styles/Tables.css';

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await citasAPI.getAll();
      // En producción, filtrar por tutor actual
      setCitas(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Mis Citas</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Mascota</th>
              <th>Veterinario</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>
                  {format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                </td>
                <td>{cita.mascota_nombre}</td>
                <td>{cita.veterinario_nombre}</td>
                <td>{cita.motivo}</td>
                <td>
                  <span className={`badge badge-${cita.estado}`}>
                    {cita.estado}
                  </span>
                </td>
                <td>{cita.observaciones || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MisCitas;
