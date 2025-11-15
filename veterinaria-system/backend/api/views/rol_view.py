"""
ViewSet para el modelo Rol.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from api.controllers import RolController
from api.serializers import RolSerializer


class RolViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar roles.
    Endpoints:
    - GET /api/roles/
    - POST /api/roles/
    - GET /api/roles/{id}/
    - PUT /api/roles/{id}/
    - DELETE /api/roles/{id}/
    """
    serializer_class = RolSerializer
    filterset_fields = ['nombre']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return RolController.get_all_roles()
