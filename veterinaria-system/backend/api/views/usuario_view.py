"""
ViewSet para el modelo Usuario.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.controllers import UsuarioController
from api.serializers import UsuarioSerializer, UsuarioListSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios.
    Endpoints:
    - GET /api/usuarios/
    - POST /api/usuarios/
    - GET /api/usuarios/{id}/
    - PUT /api/usuarios/{id}/
    - DELETE /api/usuarios/{id}/
    - GET /api/usuarios/veterinarios/ (custom action)
    """
    serializer_class = UsuarioSerializer
    filterset_fields = ['rol', 'activo', 'email']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return UsuarioController.get_all_users()

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return UsuarioListSerializer
        return UsuarioSerializer

    @action(detail=False, methods=['get'])
    def veterinarios(self, request):
        """
        Retorna solo los usuarios con rol de veterinario.
        GET /api/usuarios/veterinarios/
        """
        veterinarians = UsuarioController.get_veterinarians()
        serializer = UsuarioListSerializer(veterinarians, many=True)
        return Response(serializer.data)
