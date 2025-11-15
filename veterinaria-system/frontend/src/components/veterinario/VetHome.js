/**
 * VetHome - Página de inicio del veterinario
 */
import React, { useState, useEffect } from 'react';
import { citasAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const VetHome = () => {
  const { user } = useAuth();
  const [citasProximas, setCitasProximas] = useState([]);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitasProximas();
  }, []);

  const cargarCitasProximas = async () => {
    try {
      const response = await citasAPI.getProximas();
      const todasCitas = response.data;

      // Filtrar citas del veterinario actual
      const misCitas = todasCitas.filter(
        cita => cita.veterinario_nombre === user.nombre_completo
      );

      // Separar pendientes de confirmadas
      const pendientes = misCitas.filter(c => c.estado === 'pendiente');
      const confirmadas = misCitas.filter(c => c.estado === 'confirmada');

      setCitasPendientes(pendientes);
      setCitasProximas(confirmadas);
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
      <h1>Bienvenido, Dr(a). {user.nombre_completo}</h1>

      {/* Citas Pendientes - Requieren Atención */}
      {citasPendientes.length > 0 && (
        <div className="section" style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#e74c3c' }}>
            ⚠️ Solicitudes de Atención Pendientes ({citasPendientes.length})
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Mascota que Solicitó Atención</th>
                  <th>Tutor</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citasPendientes.map((cita) => (
                  <tr key={cita.id} style={{ background: '#fff3e0' }}>
                    <td>
                      <strong>{format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}</strong>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                        {cita.mascota_nombre}
                      </strong>
                    </td>
                    <td>{cita.tutor_nombre}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <span className="badge badge-pendiente">
                        PENDIENTE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '10px', color: '#e67e22', fontWeight: 'bold' }}>
            💡 Ve a "Citas" para aceptar o posponer estas solicitudes
          </p>
        </div>
      )}

      {/* Citas Confirmadas */}
      <div className="section">
        <h2>📅 Próximas Citas Confirmadas (7 días)</h2>
        {citasProximas.length === 0 ? (
          <p>No hay citas confirmadas para los próximos 7 días.</p>
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
                    <td><strong>{cita.mascota_nombre}</strong></td>
                    <td>{cita.tutor_nombre}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <span className="badge badge-confirmada">
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
