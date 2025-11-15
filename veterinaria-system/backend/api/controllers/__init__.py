"""
Controllers (ViewSets) para el sistema veterinaria - Arquitectura MVC
"""
from .rol_controller import RolViewSet
from .usuario_controller import UsuarioViewSet
from .tutor_controller import TutorViewSet
from .mascota_controller import MascotaViewSet
from .cita_controller import CitaViewSet
from .historial_medico_controller import HistorialMedicoViewSet
from .inventario_controller import InventarioViewSet
from .movimiento_inventario_controller import MovimientoInventarioViewSet
from .receta_medicamento_controller import RecetaMedicamentoViewSet
from .dashboard_controller import DashboardViewSet
from .auth_controller import LoginView, LogoutView

__all__ = [
    'RolViewSet',
    'UsuarioViewSet',
    'TutorViewSet',
    'MascotaViewSet',
    'CitaViewSet',
    'HistorialMedicoViewSet',
    'InventarioViewSet',
    'MovimientoInventarioViewSet',
    'RecetaMedicamentoViewSet',
    'DashboardViewSet',
    'LoginView',
    'LogoutView',
]
