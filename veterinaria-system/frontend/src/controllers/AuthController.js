/**
 * Controller para Autenticación
 * Arquitectura MVC - Capa de Controladores
 */

import api from '../services/api';
import { User } from '../models';

class AuthController {
  /**
   * Inicia sesión de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<User>} Usuario autenticado
   */
  static async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = User.fromJSON(response.data);

      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Cierra sesión del usuario
   */
  static logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   * Obtiene el usuario actual del localStorage
   * @returns {User|null} Usuario actual o null
   */
  static getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? User.fromJSON(JSON.parse(userData)) : null;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si está autenticado
   */
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtiene el token de autenticación
   * @returns {string|null} Token o null
   */
  static getToken() {
    return localStorage.getItem('token');
  }
}

export default AuthController;
