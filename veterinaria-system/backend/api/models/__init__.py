"""
Models para el sistema veterinaria - Arquitectura MVC
"""
from .rol import Rol
from .usuario import Usuario
from .tutor import Tutor
from .mascota import Mascota
from .cita import Cita
from .historial_medico import HistorialMedico
from .inventario import Inventario
from .movimiento_inventario import MovimientoInventario
from .receta_medicamento import RecetaMedicamento

__all__ = [
    'Rol',
    'Usuario',
    'Tutor',
    'Mascota',
    'Cita',
    'HistorialMedico',
    'Inventario',
    'MovimientoInventario',
    'RecetaMedicamento',
]
