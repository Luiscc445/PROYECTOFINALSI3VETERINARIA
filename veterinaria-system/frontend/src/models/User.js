/**
 * Modelo Usuario
 * Arquitectura MVC - Capa de Modelos
 */

class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.nombre_completo = data.nombre_completo || '';
    this.telefono = data.telefono || '';
    this.rol = data.rol || null;
    this.rol_nombre = data.rol_nombre || '';
    this.activo = data.activo !== undefined ? data.activo : true;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  static fromJSON(json) {
    return new User(json);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nombre_completo: this.nombre_completo,
      telefono: this.telefono,
      rol: this.rol,
      activo: this.activo
    };
  }

  isAdmin() {
    return this.rol_nombre === 'administrador';
  }

  isVeterinarian() {
    return this.rol_nombre === 'veterinario';
  }

  isTutor() {
    return this.rol_nombre === 'tutor';
  }
}

export default User;
