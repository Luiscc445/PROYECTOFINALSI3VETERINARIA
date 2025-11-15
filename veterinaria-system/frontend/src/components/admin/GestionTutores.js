/**
 * GestionTutores - Gestión de tutores (dueños de mascotas)
 */
import React, { useState, useEffect } from 'react';
import { tutoresAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import '../../styles/Tables.css';

const GestionTutores = () => {
  const toast = useToast();
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTutores();
  }, []);

  const cargarTutores = async () => {
    try {
      const response = await tutoresAPI.getAll();
      setTutores(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando tutores:', error);
      toast.error('Error al cargar tutores');
    } finally {
      setLoading(false);
    }
  };

  const verMascotas = async (id) => {
    try {
      const response = await tutoresAPI.getMascotas(id);
      const mascotas = response.data;
      if (mascotas && mascotas.length > 0) {
        toast.info(`Mascotas: ${mascotas.map(m => m.nombre).join(', ')}`);
      } else {
        toast.info('Este tutor no tiene mascotas registradas');
      }
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      toast.error('Error al cargar mascotas del tutor');
    }
  };

  if (loading) {
    return <div className="loading">Cargando tutores...</div>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Tutores</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>CI</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tutores.map((tutor) => (
              <tr key={tutor.id}>
                <td>{tutor.id}</td>
                <td>{tutor.nombre_completo}</td>
                <td>{tutor.email}</td>
                <td>{tutor.telefono || '-'}</td>
                <td>{tutor.ci}</td>
                <td>{tutor.direccion}</td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => verMascotas(tutor.id)}
                    title="Ver mascotas"
                  >
                    🐕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionTutores;
