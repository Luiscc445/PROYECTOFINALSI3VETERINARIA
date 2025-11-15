"""
Serializers para la API REST del sistema veterinaria.
Arquitectura MVC - Capa de Serialización
"""
from .rol_serializer import RolSerializer
from .usuario_serializer import UsuarioSerializer, UsuarioListSerializer
from .tutor_serializer import TutorSerializer, TutorListSerializer
from .mascota_serializer import (
    MascotaSerializer,
    MascotaListSerializer,
    MascotaHistorialCompletoSerializer
)
from .cita_serializer import CitaSerializer
from .historial_medico_serializer import HistorialMedicoSerializer
from .inventario_serializer import InventarioSerializer
from .movimiento_inventario_serializer import MovimientoInventarioSerializer
from .receta_medicamento_serializer import RecetaMedicamentoSerializer

__all__ = [
    'RolSerializer',
    'UsuarioSerializer',
    'UsuarioListSerializer',
    'TutorSerializer',
    'TutorListSerializer',
    'MascotaSerializer',
    'MascotaListSerializer',
    'MascotaHistorialCompletoSerializer',
    'CitaSerializer',
    'HistorialMedicoSerializer',
    'InventarioSerializer',
    'MovimientoInventarioSerializer',
    'RecetaMedicamentoSerializer',
]
