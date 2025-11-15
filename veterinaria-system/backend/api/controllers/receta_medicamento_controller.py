"""
Controller para el modelo RecetaMedicamento.
Arquitectura MVC - Capa de Controladores
"""
from api.models import RecetaMedicamento


class RecetaMedicamentoController:
    """
    Controlador para la lógica de negocio de Recetas de Medicamentos.
    """

    @staticmethod
    def get_all_recetas(filters=None):
        """Obtiene todas las recetas con filtros opcionales"""
        queryset = RecetaMedicamento.objects.select_related(
            'historial__mascota',
            'medicamento'
        ).all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_receta_by_id(receta_id):
        """Obtiene una receta por ID"""
        return RecetaMedicamento.objects.select_related(
            'historial__mascota',
            'medicamento'
        ).get(id=receta_id)

    @staticmethod
    def get_recetas_by_historial(historial_id):
        """Obtiene todas las recetas de un historial médico"""
        return RecetaMedicamento.objects.filter(
            historial_id=historial_id
        ).select_related('medicamento')

    @staticmethod
    def create_receta(data):
        """
        Crea una nueva receta de medicamento.
        Al crear, descuenta del inventario si hay stock suficiente.
        """
        from api.models import Inventario, MovimientoInventario, Usuario

        receta = RecetaMedicamento.objects.create(**data)

        # Intentar descontar del inventario (si hay stock)
        try:
            medicamento = receta.medicamento
            if medicamento.cantidad >= 1:  # Si hay al menos 1 unidad
                medicamento.cantidad -= 1
                medicamento.save()

                # Registrar movimiento de inventario
                # Usar el veterinario del historial como usuario del movimiento
                veterinario = receta.historial.veterinario
                MovimientoInventario.objects.create(
                    inventario=medicamento,
                    usuario=veterinario,
                    tipo_movimiento='salida',
                    cantidad=1,
                    motivo=f'Receta para {receta.historial.mascota.nombre} - Historial #{receta.historial.id}'
                )
        except:
            pass  # Si falla, continúa sin descontar (solo registra la receta)

        return receta

    @staticmethod
    def update_receta(receta_id, data):
        """Actualiza una receta existente"""
        receta = RecetaMedicamento.objects.get(id=receta_id)
        for key, value in data.items():
            setattr(receta, key, value)
        receta.save()
        return receta

    @staticmethod
    def delete_receta(receta_id):
        """Elimina una receta"""
        receta = RecetaMedicamento.objects.get(id=receta_id)
        receta.delete()
