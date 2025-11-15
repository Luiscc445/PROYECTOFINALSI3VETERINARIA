/**
 * HistorialRecetas - Historial de medicamentos recetados por veterinarios
 */
import React, { useState, useEffect } from 'react';
import { inventarioAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import '../../styles/Tables.css';
import '../../styles/Dashboard.css';

const HistorialRecetas = () => {
  const toast = useToast();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroVeterinario, setFiltroVeterinario] = useState('');
  const [filtroMedicamento, setFiltroMedicamento] = useState('');

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      // Obtener todas las recetas con información relacionada
      const response = await axios.get('http://localhost:8000/api/recetas/', {
        withCredentials: true
      });
      setRecetas(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando recetas:', error);
      toast.error('Error al cargar historial de recetas');
    } finally {
      setLoading(false);
    }
  };

  const recetasFiltradas = recetas.filter(receta => {
    const matchVeterinario = filtroVeterinario === '' ||
      (receta.historial_medico_veterinario &&
       receta.historial_medico_veterinario.toLowerCase().includes(filtroVeterinario.toLowerCase()));
    const matchMedicamento = filtroMedicamento === '' ||
      (receta.medicamento_nombre &&
       receta.medicamento_nombre.toLowerCase().includes(filtroMedicamento.toLowerCase()));
    return matchVeterinario && matchMedicamento;
  });

  if (loading) {
    return <div className="loading">Cargando historial de recetas...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>📋 Historial de Recetas Médicas</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Historial completo de medicamentos recetados y stock reducido automáticamente
      </p>

      {/* Filtros */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Filtrar por veterinario..."
            value={filtroVeterinario}
            onChange={(e) => setFiltroVeterinario(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          <input
            type="text"
            placeholder="🔍 Filtrar por medicamento..."
            value={filtroMedicamento}
            onChange={(e) => setFiltroMedicamento(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px', color: '#7f8c8d' }}>
          Mostrando {recetasFiltradas.length} de {recetas.length} recetas
        </div>

        {/* Lista de recetas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {recetasFiltradas.map((receta) => (
            <div
              key={receta.id}
              style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                border: '2px solid #e9ecef',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e9ecef';
                e.currentTarget.style.borderColor = '#3498db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#e9ecef';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2c3e50' }}>
                      💊 {receta.medicamento_nombre || 'Medicamento no disponible'}
                    </span>
                    <span className="badge badge-medicamento" style={{ fontSize: '0.85em' }}>
                      ID Receta: #{receta.id}
                    </span>
                  </div>

                  <div style={{ color: '#666', fontSize: '0.95em' }}>
                    👨‍⚕️ <strong>Veterinario:</strong> {receta.historial_medico_veterinario || 'No disponible'}
                  </div>

                  <div style={{ color: '#666', fontSize: '0.95em' }}>
                    🐾 <strong>Mascota:</strong> {receta.historial_medico_mascota || 'No disponible'}
                  </div>
                </div>

                <div style={{
                  background: '#e74c3c',
                  color: 'white',
                  padding: '15px 25px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  minWidth: '120px'
                }}>
                  <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
                    -{receta.cantidad_total}
                  </div>
                  <div style={{ fontSize: '0.85em', opacity: 0.9 }}>
                    Unidades
                  </div>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid #ddd',
                paddingTop: '15px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                <div>
                  <strong style={{ color: '#7f8c8d', fontSize: '0.85em' }}>DOSIS:</strong>
                  <div>{receta.dosis}</div>
                </div>
                <div>
                  <strong style={{ color: '#7f8c8d', fontSize: '0.85em' }}>FRECUENCIA:</strong>
                  <div>{receta.frecuencia}</div>
                </div>
                <div>
                  <strong style={{ color: '#7f8c8d', fontSize: '0.85em' }}>DURACIÓN:</strong>
                  <div>{receta.duracion}</div>
                </div>
                {receta.instrucciones && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#7f8c8d', fontSize: '0.85em' }}>INSTRUCCIONES:</strong>
                    <div>{receta.instrucciones}</div>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: '15px',
                padding: '10px',
                background: '#fff3cd',
                borderRadius: '6px',
                fontSize: '0.9em',
                color: '#856404'
              }}>
                ⚠️ Stock reducido automáticamente en {new Date(receta.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}

          {recetasFiltradas.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>📋</div>
              <div>No se encontraron recetas con los filtros aplicados</div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{recetas.length}</div>
            <div className="stat-label">Total Recetas</div>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <div className="stat-value">
              {recetas.reduce((sum, r) => sum + (r.cantidad_total || 0), 0)}
            </div>
            <div className="stat-label">Unidades Recetadas</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">
              {new Set(recetas.map(r => r.medicamento_nombre)).size}
            </div>
            <div className="stat-label">Medicamentos Diferentes</div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <div className="stat-value">
              {new Set(recetas.map(r => r.historial_medico_veterinario)).size}
            </div>
            <div className="stat-label">Veterinarios Activos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialRecetas;
