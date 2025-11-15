"""
Controller para Cita - Arquitectura MVC
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from ..models import Cita
from ..serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar citas.
    Endpoints:
    - GET /api/citas/
    - POST /api/citas/
    - GET /api/citas/{id}/
    - PUT /api/citas/{id}/
    - DELETE /api/citas/{id}/
    - GET /api/citas/proximas/ (custom action)
    - GET /api/citas/mis_citas/?tutor_id=X (custom action)
    - POST /api/citas/{id}/cambiar_estado/ (custom action)
    - POST /api/citas/{id}/posponer/ (custom action)
    """
    queryset = Cita.objects.select_related(
        'mascota__tutor__usuario',
        'veterinario'
    ).all()
    serializer_class = CitaSerializer
    filterset_fields = ['mascota', 'veterinario', 'estado']

    @action(detail=False, methods=['get'])
    def proximas(self, request):
        """
        Retorna las citas de los próximos 7 días.
        GET /api/citas/proximas/
        """
        hoy = timezone.now()
        fecha_limite = hoy + timedelta(days=7)
        citas = self.queryset.filter(
            fecha_hora__gte=hoy,
            fecha_hora__lte=fecha_limite,
            estado__in=['pendiente', 'confirmada']
        ).order_by('fecha_hora')
        serializer = self.get_serializer(citas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mis_citas(self, request):
        """
        Retorna las citas de las mascotas de un tutor específico.
        GET /api/citas/mis_citas/?tutor_id=X
        """
        tutor_id = request.query_params.get('tutor_id')
        if not tutor_id:
            return Response({'error': 'tutor_id requerido'}, status=status.HTTP_400_BAD_REQUEST)

        citas = self.queryset.filter(mascota__tutor_id=tutor_id).order_by('-fecha_hora')
        serializer = self.get_serializer(citas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """
        Cambia el estado de una cita.
        POST /api/citas/{id}/cambiar_estado/
        Body: {"estado": "confirmada"}
        """
        cita = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado not in ['pendiente', 'confirmada', 'completada', 'cancelada']:
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cita.estado = nuevo_estado
        cita.save()
        serializer = self.get_serializer(cita)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def posponer(self, request, pk=None):
        """
        Pospone una cita a una nueva fecha.
        POST /api/citas/{id}/posponer/
        Body: {"nueva_fecha_hora": "2024-12-01T10:00:00"}
        """
        cita = self.get_object()
        nueva_fecha_hora = request.data.get('nueva_fecha_hora')

        if not nueva_fecha_hora:
            return Response(
                {'error': 'nueva_fecha_hora es requerida'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils.dateparse import parse_datetime
        fecha_parseada = parse_datetime(nueva_fecha_hora)

        if not fecha_parseada:
            return Response(
                {'error': 'Formato de fecha inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cita.fecha_hora = fecha_parseada
        cita.estado = 'pendiente'  # Volver a pendiente cuando se pospone
        cita.save()

        serializer = self.get_serializer(cita)
        return Response(serializer.data)
