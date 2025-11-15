/**
 * GestionCitas - Gestión de citas veterinarias
 */
import React, { useState, useEffect } from 'react';
import { citasAPI } from '../../../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/Tables.css';

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await citasAPI.getAll();
      setCitas(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await citasAPI.cambiarEstado(id, nuevoEstado);
      alert('Estado actualizado');
      cargarCitas();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado');
    }
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Citas</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Mascota</th>
              <th>Tutor</th>
              <th>Veterinario</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>
                  {format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                </td>
                <td>{cita.mascota_nombre}</td>
                <td>{cita.tutor_nombre}</td>
                <td>{cita.veterinario_nombre}</td>
                <td>{cita.motivo}</td>
                <td>
                  <span className={`badge badge-${cita.estado}`}>
                    {cita.estado}
                  </span>
                </td>
                <td>
                  {cita.estado === 'pendiente' && (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => cambiarEstado(cita.id, 'confirmada')}
                        style={{ marginRight: '5px' }}
                      >
                        Confirmar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cambiarEstado(cita.id, 'cancelada')}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {cita.estado === 'confirmada' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => cambiarEstado(cita.id, 'completada')}
                    >
                      Completar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionCitas;
