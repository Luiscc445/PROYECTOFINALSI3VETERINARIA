"""
Controller para Rol - Arquitectura MVC
"""
from rest_framework import viewsets
from ..models import Rol
from ..serializers import RolSerializer


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
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    filterset_fields = ['nombre']
