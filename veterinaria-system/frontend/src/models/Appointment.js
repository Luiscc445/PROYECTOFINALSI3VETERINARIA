/**
 * Modelo Cita (Appointment)
 * Arquitectura MVC - Capa de Modelos
 */

class Appointment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.mascota = data.mascota || null;
    this.mascota_nombre = data.mascota_nombre || '';
    this.veterinario = data.veterinario || null;
    this.veterinario_nombre = data.veterinario_nombre || '';
    this.tutor_nombre = data.tutor_nombre || '';
    this.fecha_hora = data.fecha_hora || '';
    this.motivo = data.motivo || '';
    this.estado = data.estado || 'pendiente';
    this.observaciones = data.observaciones || '';
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  static fromJSON(json) {
    return new Appointment(json);
  }

  toJSON() {
    return {
      id: this.id,
      mascota: this.mascota,
      veterinario: this.veterinario,
      fecha_hora: this.fecha_hora,
      motivo: this.motivo,
      estado: this.estado,
      observaciones: this.observaciones
    };
  }

  isPending() {
    return this.estado === 'pendiente';
  }

  isConfirmed() {
    return this.estado === 'confirmada';
  }

  isCompleted() {
    return this.estado === 'completada';
  }

  isCancelled() {
    return this.estado === 'cancelada';
  }
}

export default Appointment;
