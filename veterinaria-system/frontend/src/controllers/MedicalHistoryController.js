/**
 * Controller para Historiales Médicos
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../services/api';
import { MedicalHistory } from '../models';

class MedicalHistoryController {
  /**
   * Obtiene todos los historiales médicos
   * @returns {Promise<MedicalHistory[]>} Lista de historiales
   */
  static async getAll() {
    try {
      const response = await api.get('/historiales/');
      return response.data.map(history => MedicalHistory.fromJSON(history));
    } catch (error) {
      throw new Error('Error al obtener historiales médicos');
    }
  }

  /**
   * Obtiene un historial médico por ID
   * @param {number} id - ID del historial
   * @returns {Promise<MedicalHistory>} Historial médico
   */
  static async getById(id) {
    try {
      const response = await api.get(`/historiales/${id}/`);
      return MedicalHistory.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al obtener historial médico');
    }
  }

  /**
   * Crea un nuevo historial médico
   * @param {Object} historyData - Datos del historial
   * @returns {Promise<MedicalHistory>} Historial creado
   */
  static async create(historyData) {
    try {
      const response = await api.post('/historiales/', historyData);
      return MedicalHistory.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al crear historial médico');
    }
  }

  /**
   * Actualiza un historial médico
   * @param {number} id - ID del historial
   * @param {Object} historyData - Datos actualizados
   * @returns {Promise<MedicalHistory>} Historial actualizado
   */
  static async update(id, historyData) {
    try {
      const response = await api.put(`/historiales/${id}/`, historyData);
      return MedicalHistory.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al actualizar historial médico');
    }
  }

  /**
   * Elimina un historial médico
   * @param {number} id - ID del historial
   */
  static async delete(id) {
    try {
      await api.delete(`/historiales/${id}/`);
    } catch (error) {
      throw new Error('Error al eliminar historial médico');
    }
  }
}

export default MedicalHistoryController;
