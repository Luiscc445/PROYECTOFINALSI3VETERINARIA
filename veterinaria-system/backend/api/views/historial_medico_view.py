"""
ViewSet para el modelo HistorialMedico.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
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

    @action(detail=True, methods=['get'])
    def descargar_pdf(self, request, pk=None):
        """
        Genera y descarga el PDF del historial médico.
        GET /api/historiales/{id}/descargar_pdf/
        """
        try:
            # Generar PDF usando el controller
            pdf_buffer = HistorialMedicoController.generar_pdf(pk)

            # Obtener el historial para el nombre del archivo
            record = HistorialMedicoController.get_medical_record_by_id(pk)
            filename = f"historial_{record.mascota.nombre}_{record.fecha.strftime('%Y%m%d')}.pdf"

            # Crear respuesta HTTP con el PDF
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'

            return response

        except Exception as e:
            return Response(
                {'error': f'Error al generar PDF: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
