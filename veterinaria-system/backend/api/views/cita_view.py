"""
ViewSet para el modelo Cita.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
    - GET /api/citas/proximas/ (custom action)
    - POST /api/citas/{id}/cambiar_estado/ (custom action)
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
