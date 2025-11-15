"""
Controller para Tutor - Arquitectura MVC
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date
from ..models import Tutor
from ..serializers import TutorSerializer, TutorListSerializer, MascotaListSerializer


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
    - GET /api/tutores/me/ (custom action - obtener tutor actual)
    """
    queryset = Tutor.objects.select_related('usuario').all()
    serializer_class = TutorSerializer
    filterset_fields = ['ci']

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return TutorListSerializer
        return TutorSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retorna el tutor correspondiente al usuario autenticado.
        GET /api/tutores/me/
        """
        usuario = request.user

        if not usuario or not hasattr(usuario, 'is_authenticated') or not usuario.is_authenticated:
            return Response({'error': 'Usuario no autenticado'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Intentar obtener el tutor asociado al usuario autenticado
            tutor = Tutor.objects.select_related('usuario').get(usuario=usuario)
            serializer = self.get_serializer(tutor)
            return Response(serializer.data)
        except Tutor.DoesNotExist:
            # Si no existe, verificar si el usuario es tutor y crear el registro
            if usuario.rol and usuario.rol.nombre == 'tutor':
                # Generar un CI temporal único basado en el ID del usuario
                ci_temporal = f'TEMP-{usuario.id:06d}'
                tutor = Tutor.objects.create(
                    usuario=usuario,
                    ci=ci_temporal,
                    direccion='Pendiente de actualización',
                    fecha_nacimiento=date(2000, 1, 1)
                )
                serializer = self.get_serializer(tutor)
                return Response(serializer.data)
            else:
                return Response({
                    'error': 'El usuario autenticado no es un tutor'
                }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def mascotas(self, request, pk=None):
        """
        Retorna todas las mascotas de un tutor.
        GET /api/tutores/{id}/mascotas/
        """
        tutor = self.get_object()
        mascotas = tutor.mascotas.filter(activo=True)
        serializer = MascotaListSerializer(mascotas, many=True)
        return Response(serializer.data)
