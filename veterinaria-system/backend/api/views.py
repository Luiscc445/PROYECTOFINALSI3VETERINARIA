"""
Views principales - Arquitectura MVC
Importa todos los controllers desde la carpeta controllers/
"""
from .controllers import (
    RolViewSet,
    UsuarioViewSet,
    TutorViewSet,
    MascotaViewSet,
    CitaViewSet,
    HistorialMedicoViewSet,
    InventarioViewSet,
    MovimientoInventarioViewSet,
    RecetaMedicamentoViewSet,
    DashboardViewSet,
    LoginView,
    LogoutView,
)

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
