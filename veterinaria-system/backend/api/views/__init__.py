"""
Views del sistema de gestión veterinaria.
Arquitectura MVC - Capa de Vistas (Endpoints API)
"""
from .rol_view import RolViewSet
from .usuario_view import UsuarioViewSet
from .tutor_view import TutorViewSet
from .mascota_view import MascotaViewSet
from .cita_view import CitaViewSet
from .historial_medico_view import HistorialMedicoViewSet
from .inventario_view import InventarioViewSet
from .movimiento_inventario_view import MovimientoInventarioViewSet
from .dashboard_view import DashboardViewSet

__all__ = [
    'RolViewSet',
    'UsuarioViewSet',
    'TutorViewSet',
    'MascotaViewSet',
    'CitaViewSet',
    'HistorialMedicoViewSet',
    'InventarioViewSet',
    'MovimientoInventarioViewSet',
    'DashboardViewSet',
]
