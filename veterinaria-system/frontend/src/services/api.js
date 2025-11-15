/**
 * Servicio de API para el sistema veterinaria
 * Maneja todas las llamadas HTTP al backend Django
 */
import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para enviar cookies de sesión
});

// Interceptor para incluir CSRF token si es necesario
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Función helper para obtener cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
};

// ============================================
// USUARIOS API
// ============================================
export const usuariosAPI = {
  getAll: (params) => api.get('/usuarios/', { params }),
  getById: (id) => api.get(`/usuarios/${id}/`),
  create: (data) => api.post('/usuarios/', data),
  update: (id, data) => api.put(`/usuarios/${id}/`, data),
  delete: (id) => api.delete(`/usuarios/${id}/`),
  getVeterinarios: (especialidad) => {
    const params = especialidad ? { especialidad } : {};
    return api.get('/usuarios/veterinarios/', { params });
  },
};

// ============================================
// TUTORES API
// ============================================
export const tutoresAPI = {
  getAll: (params) => api.get('/tutores/', { params }),
  getById: (id) => api.get(`/tutores/${id}/`),
  create: (data) => api.post('/tutores/', data),
  update: (id, data) => api.put(`/tutores/${id}/`, data),
  delete: (id) => api.delete(`/tutores/${id}/`),
  getMascotas: (id) => api.get(`/tutores/${id}/mascotas/`),
  getMe: () => api.get('/tutores/me/'),  // Usa la sesión autenticada, no requiere email
};

// ============================================
// MASCOTAS API
// ============================================
export const mascotasAPI = {
  getAll: (params) => api.get('/mascotas/', { params }),
  getById: (id) => api.get(`/mascotas/${id}/`),
  create: (data) => {
    // Si hay foto, usar FormData
    if (data.foto_url instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      return api.post('/mascotas/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/mascotas/', data);
  },
  update: (id, data) => {
    // Si hay foto, usar FormData
    if (data.foto_url instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      return api.put(`/mascotas/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/mascotas/${id}/`, data);
  },
  delete: (id) => api.delete(`/mascotas/${id}/`),
  getHistorialCompleto: (id) => api.get(`/mascotas/${id}/historial_completo/`),
  getMisMascotas: (tutorId) => api.get('/mascotas/mis_mascotas/', { params: { tutor_id: tutorId } }),
};

// ============================================
// CITAS API
// ============================================
export const citasAPI = {
  getAll: (params) => api.get('/citas/', { params }),
  getById: (id) => api.get(`/citas/${id}/`),
  create: (data) => api.post('/citas/', data),
  update: (id, data) => api.put(`/citas/${id}/`, data),
  delete: (id) => api.delete(`/citas/${id}/`),
  getProximas: () => api.get('/citas/proximas/'),
  cambiarEstado: (id, estado) => api.post(`/citas/${id}/cambiar_estado/`, { estado }),
  getMisCitas: (tutorId) => api.get('/citas/mis_citas/', { params: { tutor_id: tutorId } }),
};

// ============================================
// HISTORIALES API
// ============================================
export const historialesAPI = {
  getAll: (params) => api.get('/historiales/', { params }),
  getById: (id) => api.get(`/historiales/${id}/`),
  create: (data) => api.post('/historiales/', data),
  update: (id, data) => api.put(`/historiales/${id}/`, data),
  delete: (id) => api.delete(`/historiales/${id}/`),
};

// ============================================
// INVENTARIO API
// ============================================
export const inventarioAPI = {
  getAll: (params) => api.get('/inventario/', { params }),
  getById: (id) => api.get(`/inventario/${id}/`),
  create: (data) => api.post('/inventario/', data),
  update: (id, data) => api.put(`/inventario/${id}/`, data),
  delete: (id) => api.delete(`/inventario/${id}/`),
  getBajoStock: () => api.get('/inventario/bajo_stock/'),
  getMedicamentos: () => api.get('/inventario/medicamentos/'),
  registrarMovimiento: (id, movimiento) => api.post(`/inventario/${id}/registrar_movimiento/`, movimiento),
};

// ============================================
// MOVIMIENTOS API
// ============================================
export const movimientosAPI = {
  getAll: (params) => api.get('/movimientos/', { params }),
  getById: (id) => api.get(`/movimientos/${id}/`),
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  getEstadisticas: () => api.get('/dashboard/estadisticas/'),
};

// ============================================
// ROLES API
// ============================================
export const rolesAPI = {
  getAll: () => api.get('/roles/'),
  getById: (id) => api.get(`/roles/${id}/`),
};

// Exportar instancia de axios por defecto
export default api;
