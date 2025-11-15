"""
ViewSet para el modelo Mascota.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.controllers import MascotaController
from api.serializers import (
    MascotaSerializer,
    MascotaListSerializer,
    MascotaHistorialCompletoSerializer
)


class MascotaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar mascotas.
    Endpoints:
    - GET /api/mascotas/
    - POST /api/mascotas/
    - GET /api/mascotas/{id}/
    - PUT /api/mascotas/{id}/
    - DELETE /api/mascotas/{id}/
    - GET /api/mascotas/{id}/historial_completo/ (custom action)
    """
    serializer_class = MascotaSerializer
    filterset_fields = ['tutor', 'especie', 'sexo', 'activo']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return MascotaController.get_all_pets()

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return MascotaListSerializer
        return MascotaSerializer

    @action(detail=True, methods=['get'])
    def historial_completo(self, request, pk=None):
        """
        Retorna el historial médico completo y citas de una mascota.
        GET /api/mascotas/{id}/historial_completo/
        """
        pet = MascotaController.get_pet_complete_history(pk)
        serializer = MascotaHistorialCompletoSerializer(pet)
        return Response(serializer.data)
