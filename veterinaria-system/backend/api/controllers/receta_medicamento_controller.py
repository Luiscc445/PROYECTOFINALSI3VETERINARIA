"""
Controller para RecetaMedicamento - Arquitectura MVC
"""
from rest_framework import viewsets, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import RecetaMedicamento
from ..serializers import RecetaMedicamentoSerializer


class RecetaMedicamentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar recetas de medicamentos.
    Endpoints:
    - GET /api/recetas/
    - POST /api/recetas/
    - GET /api/recetas/{id}/
    - PUT /api/recetas/{id}/
    - DELETE /api/recetas/{id}/
    - GET /api/recetas/por_historial/{historial_id}/ (custom action)
    """
    queryset = RecetaMedicamento.objects.select_related(
        'historial_medico__mascota',
        'medicamento'
    ).all()
    serializer_class = RecetaMedicamentoSerializer
    filterset_fields = ['historial_medico', 'medicamento']

    def perform_create(self, serializer):
        """
        Al crear una receta, reduce automáticamente el stock del medicamento.
        """
        receta = serializer.save()

        # Reducir stock del inventario
        medicamento = receta.medicamento
        cantidad_recetada = receta.cantidad_total

        if medicamento.cantidad < cantidad_recetada:
            # Si no hay suficiente stock, revertir la creación
            receta.delete()
            raise serializers.ValidationError({
                'error': f'Stock insuficiente. Disponible: {medicamento.cantidad}, Solicitado: {cantidad_recetada}'
            })

        # Reducir stock
        medicamento.cantidad -= cantidad_recetada
        medicamento.save()

    @action(detail=False, methods=['get'], url_path='por_historial/(?P<historial_id>[^/.]+)')
    def por_historial(self, request, historial_id=None):
        """
        Retorna todas las recetas de un historial médico específico.
        GET /api/recetas/por_historial/{historial_id}/
        """
        recetas = self.queryset.filter(historial_medico_id=historial_id)
        serializer = self.get_serializer(recetas, many=True)
        return Response(serializer.data)
