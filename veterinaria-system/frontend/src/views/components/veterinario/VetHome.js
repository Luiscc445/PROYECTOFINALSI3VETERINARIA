/**
 * VetHome - Página de inicio del veterinario
 */
import React, { useState, useEffect } from 'react';
import { citasAPI } from '../../../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const VetHome = () => {
  const [citasProximas, setCitasProximas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitasProximas();
  }, []);

  const cargarCitasProximas = async () => {
    try {
      const response = await citasAPI.getProximas();
      setCitasProximas(response.data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="vet-home">
      <h1>Bienvenido, Doctor</h1>

      <div className="section">
        <h2>Próximas Citas (7 días)</h2>
        {citasProximas.length === 0 ? (
          <p>No hay citas programadas para los próximos 7 días.</p>
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
                {citasProximas.map((cita) => (
                  <tr key={cita.id}>
                    <td>
                      {format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </td>
                    <td>{cita.mascota_nombre}</td>
                    <td>{cita.tutor_nombre}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <span className={`badge badge-${cita.estado}`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetHome;
