"""
URLs para la API REST del sistema veterinaria.
Configura los routers para todos los ViewSets.
Arquitectura MVC - Configuración de Rutas
SISTEMA COMPLETO CON AUTENTICACIÓN
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    RolViewSet, UsuarioViewSet, TutorViewSet, MascotaViewSet,
    CitaViewSet, HistorialMedicoViewSet, InventarioViewSet,
    MovimientoInventarioViewSet, RecetaMedicamentoViewSet, DashboardViewSet
)
from api.controllers import LoginView, LogoutView, CurrentUserView, RegisterView

# Crear router para registrar los ViewSets
router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'tutores', TutorViewSet, basename='tutor')
router.register(r'mascotas', MascotaViewSet, basename='mascota')
router.register(r'citas', CitaViewSet, basename='cita')
router.register(r'historiales', HistorialMedicoViewSet, basename='historial')
router.register(r'recetas', RecetaMedicamentoViewSet, basename='receta')
router.register(r'inventario', InventarioViewSet, basename='inventario')
router.register(r'movimientos', MovimientoInventarioViewSet, basename='movimiento')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    # Endpoints de autenticación (NO usan router)
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/current-user/', CurrentUserView.as_view(), name='current-user'),
    path('auth/register/', RegisterView.as_view(), name='register'),

    # Todos los endpoints del router
    path('', include(router.urls)),
]
