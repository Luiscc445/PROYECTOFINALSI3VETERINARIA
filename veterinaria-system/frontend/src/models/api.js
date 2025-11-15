/**
 * API Client - Servicios para comunicación con el backend
 * Arquitectura MVC - Capa de Modelos (API)
 * REAL API - Conexión con Django Backend
 */
import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para las sesiones de Django
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si hay error 401, podría ser sesión expirada
    if (error.response?.status === 401) {
      // Limpiar localStorage si la sesión expiró
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ======================
// AUTENTICACIÓN
// ======================

export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login/', { email, password });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout/');
    return response.data;
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/current-user/');
    return response.data;
  },

  // Registrar nuevo usuario (solo admin)
  register: async (userData) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },
};

// ======================
// ROLES
// ======================

export const rolesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/roles/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/roles/${id}/`);
    return response.data;
  },
};

// ======================
// USUARIOS
// ======================

export const usuariosAPI = {
  getAll: async () => {
    const response = await apiClient.get('/usuarios/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/usuarios/${id}/`);
    return response.data;
  },

  create: async (userData) => {
    const response = await apiClient.post('/usuarios/', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await apiClient.put(`/usuarios/${id}/`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/usuarios/${id}/`);
    return response.data;
  },
};

// ======================
// TUTORES
// ======================

export const tutoresAPI = {
  getAll: async () => {
    const response = await apiClient.get('/tutores/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/tutores/${id}/`);
    return response.data;
  },

  create: async (tutorData) => {
    const response = await apiClient.post('/tutores/', tutorData);
    return response.data;
  },

  update: async (id, tutorData) => {
    const response = await apiClient.put(`/tutores/${id}/`, tutorData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/tutores/${id}/`);
    return response.data;
  },
};

// ======================
// MASCOTAS
// ======================

export const mascotasAPI = {
  getAll: async () => {
    const response = await apiClient.get('/mascotas/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/mascotas/${id}/`);
    return response.data;
  },

  // Obtener mascotas de un tutor específico
  getByTutor: async (tutorId) => {
    const response = await apiClient.get('/mascotas/', {
      params: { tutor: tutorId },
    });
    return response.data;
  },

  create: async (mascotaData) => {
    const response = await apiClient.post('/mascotas/', mascotaData);
    return response.data;
  },

  update: async (id, mascotaData) => {
    const response = await apiClient.put(`/mascotas/${id}/`, mascotaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/mascotas/${id}/`);
    return response.data;
  },

  // Obtener historial completo de una mascota
  getHistorialCompleto: async (id) => {
    const response = await apiClient.get(`/mascotas/${id}/historial_completo/`);
    return response.data;
  },
};

// ======================
// CITAS
// ======================

export const citasAPI = {
  getAll: async () => {
    const response = await apiClient.get('/citas/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/citas/${id}/`);
    return response.data;
  },

  create: async (citaData) => {
    const response = await apiClient.post('/citas/', citaData);
    return response.data;
  },

  update: async (id, citaData) => {
    const response = await apiClient.put(`/citas/${id}/`, citaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/citas/${id}/`);
    return response.data;
  },

  // Obtener citas del veterinario actual
  getMisCitasVeterinario: async () => {
    const response = await apiClient.get('/citas/mis_citas_veterinario/');
    return response.data;
  },

  // Obtener citas del tutor actual
  getMisCitasTutor: async () => {
    const response = await apiClient.get('/citas/mis_citas_tutor/');
    return response.data;
  },

  // Obtener citas pendientes del veterinario (para destacar en VetHome)
  getPendientes: async () => {
    const response = await apiClient.get('/citas/pendientes/');
    return response.data;
  },

  // Aceptar cita
  aceptar: async (id) => {
    const response = await apiClient.post(`/citas/${id}/aceptar/`);
    return response.data;
  },

  // Posponer cita
  posponer: async (id, nueva_fecha_hora) => {
    const response = await apiClient.post(`/citas/${id}/posponer/`, {
      nueva_fecha_hora,
    });
    return response.data;
  },

  // Cancelar cita
  cancelar: async (id) => {
    const response = await apiClient.post(`/citas/${id}/cancelar/`);
    return response.data;
  },

  // Completar cita
  completar: async (id) => {
    const response = await apiClient.post(`/citas/${id}/completar/`);
    return response.data;
  },
};

// ======================
// HISTORIALES MÉDICOS
// ======================

export const historialesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/historiales/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/historiales/${id}/`);
    return response.data;
  },

  // Obtener historiales de una mascota específica
  getByMascota: async (mascotaId) => {
    const response = await apiClient.get('/historiales/', {
      params: { mascota: mascotaId },
    });
    return response.data;
  },

  create: async (historialData) => {
    const response = await apiClient.post('/historiales/', historialData);
    return response.data;
  },

  update: async (id, historialData) => {
    const response = await apiClient.put(`/historiales/${id}/`, historialData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/historiales/${id}/`);
    return response.data;
  },

  // Descargar PDF del historial
  descargarPDF: async (id) => {
    const response = await apiClient.get(`/historiales/${id}/descargar_pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ======================
// RECETAS DE MEDICAMENTOS
// ======================

export const recetasAPI = {
  getAll: async () => {
    const response = await apiClient.get('/recetas/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/recetas/${id}/`);
    return response.data;
  },

  // Obtener recetas de un historial específico
  getByHistorial: async (historialId) => {
    const response = await apiClient.get('/recetas/', {
      params: { historial: historialId },
    });
    return response.data;
  },

  create: async (recetaData) => {
    const response = await apiClient.post('/recetas/', recetaData);
    return response.data;
  },

  update: async (id, recetaData) => {
    const response = await apiClient.put(`/recetas/${id}/`, recetaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/recetas/${id}/`);
    return response.data;
  },
};

// ======================
// INVENTARIO
// ======================

export const inventarioAPI = {
  getAll: async () => {
    const response = await apiClient.get('/inventario/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/inventario/${id}/`);
    return response.data;
  },

  // Obtener solo medicamentos (para recetas)
  getMedicamentos: async () => {
    const response = await apiClient.get('/inventario/medicamentos/');
    return response.data;
  },

  // Obtener productos con stock bajo
  getBajoStock: async () => {
    const response = await apiClient.get('/inventario/bajo_stock/');
    return response.data;
  },

  create: async (productoData) => {
    const response = await apiClient.post('/inventario/', productoData);
    return response.data;
  },

  update: async (id, productoData) => {
    const response = await apiClient.put(`/inventario/${id}/`, productoData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/inventario/${id}/`);
    return response.data;
  },

  // Registrar movimiento de inventario
  registrarMovimiento: async (id, movimientoData) => {
    const response = await apiClient.post(
      `/inventario/${id}/registrar_movimiento/`,
      movimientoData
    );
    return response.data;
  },
};

// ======================
// MOVIMIENTOS DE INVENTARIO
// ======================

export const movimientosAPI = {
  getAll: async () => {
    const response = await apiClient.get('/movimientos/');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/movimientos/${id}/`);
    return response.data;
  },

  // Obtener movimientos de un producto específico
  getByProducto: async (productoId) => {
    const response = await apiClient.get('/movimientos/', {
      params: { inventario: productoId },
    });
    return response.data;
  },
};

// ======================
// DASHBOARD
// ======================

export const dashboardAPI = {
  // Estadísticas generales (admin)
  getEstadisticas: async () => {
    const response = await apiClient.get('/dashboard/estadisticas/');
    return response.data;
  },

  // Obtener citas recientes
  getCitasRecientes: async () => {
    const response = await apiClient.get('/dashboard/citas-recientes/');
    return response.data;
  },

  // Obtener alertas de inventario
  getAlertasInventario: async () => {
    const response = await apiClient.get('/dashboard/alertas-inventario/');
    return response.data;
  },
};

export default apiClient;
