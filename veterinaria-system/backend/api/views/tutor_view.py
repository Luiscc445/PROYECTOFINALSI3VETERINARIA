"""
ViewSet para el modelo Tutor.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.controllers import TutorController
from api.serializers import TutorSerializer, TutorListSerializer, MascotaListSerializer


class TutorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar tutores.
    Endpoints:
    - GET /api/tutores/
    - POST /api/tutores/
    - GET /api/tutores/{id}/
    - PUT /api/tutores/{id}/
    - DELETE /api/tutores/{id}/
    - GET /api/tutores/{id}/mascotas/ (custom action)
    """
    serializer_class = TutorSerializer
    filterset_fields = ['ci']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return TutorController.get_all_tutors()

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return TutorListSerializer
        return TutorSerializer

    @action(detail=True, methods=['get'])
    def mascotas(self, request, pk=None):
        """
        Retorna todas las mascotas de un tutor.
        GET /api/tutores/{id}/mascotas/
        """
        pets = TutorController.get_tutor_pets(pk)
        serializer = MascotaListSerializer(pets, many=True)
        return Response(serializer.data)
