/**
 * Modelo Historial Médico (MedicalHistory)
 * Arquitectura MVC - Capa de Modelos
 */

class MedicalHistory {
  constructor(data = {}) {
    this.id = data.id || null;
    this.mascota = data.mascota || null;
    this.mascota_nombre = data.mascota_nombre || '';
    this.veterinario = data.veterinario || null;
    this.veterinario_nombre = data.veterinario_nombre || '';
    this.fecha = data.fecha || '';
    this.tipo = data.tipo || '';
    this.diagnostico = data.diagnostico || '';
    this.tratamiento = data.tratamiento || '';
    this.medicamentos = data.medicamentos || '';
    this.peso_kg = data.peso_kg || null;
    this.temperatura_c = data.temperatura_c || null;
    this.observaciones = data.observaciones || '';
    this.proxima_visita = data.proxima_visita || null;
    this.created_at = data.created_at || null;
  }

  static fromJSON(json) {
    return new MedicalHistory(json);
  }

  toJSON() {
    return {
      id: this.id,
      mascota: this.mascota,
      veterinario: this.veterinario,
      fecha: this.fecha,
      tipo: this.tipo,
      diagnostico: this.diagnostico,
      tratamiento: this.tratamiento,
      medicamentos: this.medicamentos,
      peso_kg: this.peso_kg,
      temperatura_c: this.temperatura_c,
      observaciones: this.observaciones,
      proxima_visita: this.proxima_visita
    };
  }
}

export default MedicalHistory;
