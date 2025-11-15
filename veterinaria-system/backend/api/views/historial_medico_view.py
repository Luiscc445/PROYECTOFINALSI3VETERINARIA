"""
ViewSet para el modelo HistorialMedico.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from api.controllers import HistorialMedicoController
from api.serializers import HistorialMedicoSerializer


class HistorialMedicoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar historiales médicos.
    Endpoints:
    - GET /api/historiales/
    - POST /api/historiales/
    - GET /api/historiales/{id}/
    - PUT /api/historiales/{id}/
    - DELETE /api/historiales/{id}/
    """
    serializer_class = HistorialMedicoSerializer
    filterset_fields = ['mascota', 'veterinario', 'tipo', 'fecha']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return HistorialMedicoController.get_all_medical_records()
