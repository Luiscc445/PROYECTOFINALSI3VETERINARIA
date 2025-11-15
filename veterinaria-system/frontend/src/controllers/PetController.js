/**
 * Controller para Mascotas
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../services/api';
import { Pet } from '../models';

class PetController {
  /**
   * Obtiene todas las mascotas
   * @returns {Promise<Pet[]>} Lista de mascotas
   */
  static async getAll() {
    try {
      const response = await api.get('/mascotas/');
      return response.data.map(pet => Pet.fromJSON(pet));
    } catch (error) {
      throw new Error('Error al obtener mascotas');
    }
  }

  /**
   * Obtiene una mascota por ID
   * @param {number} id - ID de la mascota
   * @returns {Promise<Pet>} Mascota
   */
  static async getById(id) {
    try {
      const response = await api.get(`/mascotas/${id}/`);
      return Pet.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al obtener mascota');
    }
  }

  /**
   * Obtiene el historial completo de una mascota
   * @param {number} id - ID de la mascota
   * @returns {Promise<Object>} Historial completo
   */
  static async getCompleteHistory(id) {
    try {
      const response = await api.get(`/mascotas/${id}/historial_completo/`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener historial completo');
    }
  }

  /**
   * Crea una nueva mascota
   * @param {Object} petData - Datos de la mascota
   * @returns {Promise<Pet>} Mascota creada
   */
  static async create(petData) {
    try {
      const response = await api.post('/mascotas/', petData);
      return Pet.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al crear mascota');
    }
  }

  /**
   * Actualiza una mascota
   * @param {number} id - ID de la mascota
   * @param {Object} petData - Datos actualizados
   * @returns {Promise<Pet>} Mascota actualizada
   */
  static async update(id, petData) {
    try {
      const response = await api.put(`/mascotas/${id}/`, petData);
      return Pet.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al actualizar mascota');
    }
  }

  /**
   * Elimina una mascota (soft delete)
   * @param {number} id - ID de la mascota
   */
  static async delete(id) {
    try {
      await api.delete(`/mascotas/${id}/`);
    } catch (error) {
      throw new Error('Error al eliminar mascota');
    }
  }
}

export default PetController;
