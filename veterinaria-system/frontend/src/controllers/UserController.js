/**
 * Controller para Usuarios
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../models/api';
import { User } from '../models';

class UserController {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise<User[]>} Lista de usuarios
   */
  static async getAll() {
    try {
      const response = await api.get('/usuarios/');
      return response.data.map(user => User.fromJSON(user));
    } catch (error) {
      throw new Error('Error al obtener usuarios');
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<User>} Usuario
   */
  static async getById(id) {
    try {
      const response = await api.get(`/usuarios/${id}/`);
      return User.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al obtener usuario');
    }
  }

  /**
   * Obtiene solo los veterinarios
   * @returns {Promise<User[]>} Lista de veterinarios
   */
  static async getVeterinarians() {
    try {
      const response = await api.get('/usuarios/veterinarios/');
      return response.data.map(user => User.fromJSON(user));
    } catch (error) {
      throw new Error('Error al obtener veterinarios');
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<User>} Usuario creado
   */
  static async create(userData) {
    try {
      const response = await api.post('/usuarios/', userData);
      return User.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al crear usuario');
    }
  }

  /**
   * Actualiza un usuario
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos actualizados
   * @returns {Promise<User>} Usuario actualizado
   */
  static async update(id, userData) {
    try {
      const response = await api.put(`/usuarios/${id}/`, userData);
      return User.fromJSON(response.data);
    } catch (error) {
      throw new Error('Error al actualizar usuario');
    }
  }

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario
   */
  static async delete(id) {
    try {
      await api.delete(`/usuarios/${id}/`);
    } catch (error) {
      throw new Error('Error al eliminar usuario');
    }
  }
}

export default UserController;
