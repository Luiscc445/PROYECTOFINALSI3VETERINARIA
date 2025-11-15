"""
ViewSet para el modelo Cita.
Arquitectura MVC - Capa de Vistas
SISTEMA COMPLETO DE CITAS
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_datetime
from api.controllers import CitaController
from api.serializers import CitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar citas.
    Endpoints:
    - GET /api/citas/
    - POST /api/citas/
    - GET /api/citas/{id}/
    - PUT /api/citas/{id}/
    - DELETE /api/citas/{id}/
    - GET /api/citas/proximas/
    - GET /api/citas/mis_citas_veterinario/
    - GET /api/citas/mis_citas_tutor/
    - GET /api/citas/pendientes/
    - POST /api/citas/{id}/cambiar_estado/
    - POST /api/citas/{id}/aceptar/
    - POST /api/citas/{id}/posponer/
    - POST /api/citas/{id}/cancelar/
    """
    serializer_class = CitaSerializer
    filterset_fields = ['mascota', 'veterinario', 'estado']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return CitaController.get_all_appointments()

    @action(detail=False, methods=['get'])
    def proximas(self, request):
        """
        Retorna las citas de los próximos 7 días.
        GET /api/citas/proximas/
        """
        appointments = CitaController.get_upcoming_appointments(days=7)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mis_citas_veterinario(self, request):
        """
        Retorna todas las citas del veterinario logueado.
        GET /api/citas/mis_citas_veterinario/
        """
        user_id = request.session.get('user_id')
        if not user_id:
            return Response(
                {'error': 'No hay sesión activa'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        appointments = CitaController.get_citas_by_veterinario(user_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mis_citas_tutor(self, request):
        """
        Retorna todas las citas de las mascotas del tutor logueado.
        GET /api/citas/mis_citas_tutor/
        """
        user_id = request.session.get('user_id')
        if not user_id:
            return Response(
                {'error': 'No hay sesión activa'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Obtener tutor_id del usuario
        from api.models import Usuario
        try:
            usuario = Usuario.objects.select_related('tutor').get(id=user_id)
            tutor_id = usuario.tutor.id
            appointments = CitaController.get_citas_by_tutor(tutor_id)
            serializer = self.get_serializer(appointments, many=True)
            return Response(serializer.data)
        except:
            return Response(
                {'error': 'Usuario no es tutor'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """
        Retorna las citas PENDIENTES del veterinario logueado.
        Para mostrar en la sección destacada de VetHome.
        GET /api/citas/pendientes/
        """
        user_id = request.session.get('user_id')
        if not user_id:
            return Response(
                {'error': 'No hay sesión activa'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        appointments = CitaController.get_citas_pendientes_veterinario(user_id)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """
        Cambia el estado de una cita.
        POST /api/citas/{id}/cambiar_estado/
        Body: {"estado": "confirmada"}
        """
        new_status = request.data.get('estado')

        try:
            appointment = CitaController.change_appointment_status(pk, new_status)
            serializer = self.get_serializer(appointment)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def aceptar(self, request, pk=None):
        """
        Acepta una cita (cambia estado a 'confirmada').
        POST /api/citas/{id}/aceptar/
        """
        try:
            appointment = CitaController.aceptar_cita(pk)
            serializer = self.get_serializer(appointment)
            return Response({
                'message': 'Cita aceptada exitosamente',
                'cita': serializer.data
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def posponer(self, request, pk=None):
        """
        Pospone una cita a una nueva fecha/hora.
        POST /api/citas/{id}/posponer/
        Body: {"nueva_fecha_hora": "2024-01-15T10:00:00"}
        """
        nueva_fecha_hora_str = request.data.get('nueva_fecha_hora')

        if not nueva_fecha_hora_str:
            return Response(
                {'error': 'nueva_fecha_hora es requerida'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            nueva_fecha_hora = parse_datetime(nueva_fecha_hora_str)
            if not nueva_fecha_hora:
                raise ValueError('Formato de fecha inválido')

            appointment = CitaController.posponer_cita(pk, nueva_fecha_hora)
            serializer = self.get_serializer(appointment)
            return Response({
                'message': 'Cita pospuesta exitosamente',
                'cita': serializer.data
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """
        Cancela una cita (cambia estado a 'cancelada').
        POST /api/citas/{id}/cancelar/
        """
        try:
            appointment = CitaController.cancelar_cita(pk)
            serializer = self.get_serializer(appointment)
            return Response({
                'message': 'Cita cancelada exitosamente',
                'cita': serializer.data
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
