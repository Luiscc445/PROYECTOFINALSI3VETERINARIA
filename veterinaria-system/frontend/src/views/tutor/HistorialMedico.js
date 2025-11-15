/**
 * HistorialMedico - Vista del historial médico completo para tutores
 */
import React, { useState, useEffect } from 'react';
import { mascotasAPI, historialesAPI, tutoresAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import '../../styles/Tables.css';

const HistorialMedico = () => {
  const toast = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [historiales, setHistoriales] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Obtener tutor actual
      const tutorResponse = await tutoresAPI.getMe();
      const tutorId = tutorResponse.data.id;

      // Obtener mascotas del tutor
      const mascotasResponse = await mascotasAPI.getMisMascotas(tutorId);
      const misMascotas = mascotasResponse.data || [];
      setMascotas(misMascotas);

      // Obtener historiales de todas las mascotas del tutor
      const historialesResponse = await historialesAPI.getAll();
      const todosHistoriales = historialesResponse.data.results || historialesResponse.data;

      // Filtrar solo historiales de las mascotas del tutor
      const mascotasIds = misMascotas.map(m => m.id);
      const misHistoriales = todosHistoriales.filter(h =>
        mascotasIds.includes(h.mascota)
      );

      setHistoriales(misHistoriales);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar el historial médico');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (historialId, mascotaNombre) => {
    try {
      const response = await historialesAPI.descargarPDF(historialId);

      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historial_${historialId}_${mascotaNombre}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error descargando PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const historialesFiltrados = mascotaSeleccionada === 'todas'
    ? historiales
    : historiales.filter(h => h.mascota === parseInt(mascotaSeleccionada));

  if (loading) {
    return <div className="loading">Cargando historial médico...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Historial Médico de Mis Mascotas</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label htmlFor="filtro-mascota" style={{ fontWeight: 'bold' }}>Filtrar por mascota:</label>
          <select
            id="filtro-mascota"
            value={mascotaSeleccionada}
            onChange={(e) => setMascotaSeleccionada(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '2px solid #ddd' }}
          >
            <option value="todas">Todas mis mascotas</option>
            {mascotas.map((mascota) => (
              <option key={mascota.id} value={mascota.id}>
                {mascota.nombre} ({mascota.especie})
              </option>
            ))}
          </select>
        </div>
      </div>

      {historialesFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            No hay historiales médicos registrados
            {mascotaSeleccionada !== 'todas' && ' para esta mascota'}.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Mascota</th>
                <th>Tipo</th>
                <th>Veterinario</th>
                <th>Diagnóstico</th>
                <th>Tratamiento</th>
                <th>Medicamentos</th>
                <th>Observaciones</th>
                <th>Peso/Temp.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialesFiltrados.map((historial) => {
                const mascota = mascotas.find(m => m.id === historial.mascota);
                return (
                  <tr key={historial.id}>
                    <td>
                      <strong>{new Date(historial.fecha).toLocaleDateString()}</strong>
                    </td>
                    <td>
                      <strong>{historial.mascota_nombre}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${historial.tipo}`}>
                        {historial.tipo}
                      </span>
                    </td>
                    <td>{historial.veterinario_nombre}</td>
                    <td>{historial.diagnostico}</td>
                    <td>{historial.tratamiento}</td>
                    <td>{historial.medicamentos || '-'}</td>
                    <td>
                      {historial.observaciones ? (
                        <div style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}>
                          {historial.observaciones}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      {historial.peso_kg && <div>{historial.peso_kg} kg</div>}
                      {historial.temperatura_c && <div>{historial.temperatura_c} °C</div>}
                      {!historial.peso_kg && !historial.temperatura_c && '-'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => descargarPDF(historial.id, mascota?.nombre || 'mascota')}
                        title="Descargar PDF"
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {historialesFiltrados.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <p style={{ margin: 0, color: '#1976d2' }}>
            <strong>📋 Total de consultas:</strong> {historialesFiltrados.length}
            {mascotaSeleccionada !== 'todas' && ` para ${mascotas.find(m => m.id === parseInt(mascotaSeleccionada))?.nombre}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistorialMedico;
