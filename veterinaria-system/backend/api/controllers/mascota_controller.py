"""
Controller para Mascota - Arquitectura MVC
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Mascota
from ..serializers import MascotaSerializer, MascotaListSerializer, MascotaHistorialCompletoSerializer


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
    - GET /api/mascotas/mis_mascotas/?tutor_id=X (custom action)
    """
    queryset = Mascota.objects.select_related('tutor__usuario').all()
    serializer_class = MascotaSerializer
    filterset_fields = ['tutor', 'especie', 'sexo', 'activo']

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return MascotaListSerializer
        return MascotaSerializer

    @action(detail=False, methods=['get'])
    def mis_mascotas(self, request):
        """
        Retorna las mascotas de un tutor específico.
        GET /api/mascotas/mis_mascotas/?tutor_id=X
        """
        tutor_id = request.query_params.get('tutor_id')
        if not tutor_id:
            return Response({'error': 'tutor_id requerido'}, status=status.HTTP_400_BAD_REQUEST)

        mascotas = self.queryset.filter(tutor_id=tutor_id, activo=True)
        serializer = MascotaListSerializer(mascotas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def historial_completo(self, request, pk=None):
        """
        Retorna el historial médico completo y citas de una mascota.
        GET /api/mascotas/{id}/historial_completo/
        """
        mascota = self.get_object()
        serializer = MascotaHistorialCompletoSerializer(mascota)
        return Response(serializer.data)
