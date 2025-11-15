"""
ViewSet para el modelo RecetaMedicamento.
Arquitectura MVC - Capa de Vistas
"""
from rest_framework import viewsets
from api.controllers.receta_medicamento_controller import RecetaMedicamentoController
from api.serializers import RecetaMedicamentoSerializer


class RecetaMedicamentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar recetas de medicamentos.
    Endpoints:
    - GET /api/recetas/
    - POST /api/recetas/
    - GET /api/recetas/{id}/
    - PUT /api/recetas/{id}/
    - DELETE /api/recetas/{id}/
    """
    serializer_class = RecetaMedicamentoSerializer
    filterset_fields = ['historial', 'medicamento']

    def get_queryset(self):
        """Obtiene el queryset usando el controller"""
        return RecetaMedicamentoController.get_all_recetas()

    def perform_create(self, serializer):
        """
        Sobrescribe create para usar el controller.
        El controller se encarga de descontar del inventario.
        """
        # Guardar los datos del serializer
        data = serializer.validated_data
        # Crear usando el controller (que maneja el inventario)
        receta = RecetaMedicamentoController.create_receta(data)
        # Actualizar el serializer con la instancia creada
        serializer.instance = receta
