"""
Controller para Usuario - Arquitectura MVC
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Usuario
from ..serializers import UsuarioSerializer, UsuarioListSerializer


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
    queryset = Usuario.objects.select_related('rol').all()
    serializer_class = UsuarioSerializer
    filterset_fields = ['rol', 'activo', 'email']

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
        GET /api/usuarios/veterinarios/?especialidad=cirugia
        """
        veterinarios = self.queryset.filter(rol__nombre='veterinario', activo=True)

        # Filtrar por especialidad si se proporciona
        especialidad = request.query_params.get('especialidad', None)
        if especialidad:
            veterinarios = veterinarios.filter(especialidad=especialidad)

        serializer = UsuarioListSerializer(veterinarios, many=True)
        return Response(serializer.data)
