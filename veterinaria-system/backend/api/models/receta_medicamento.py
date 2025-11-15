"""
Modelo RecetaMedicamento - Recetas médicas para mascotas.
Arquitectura MVC - Capa de Modelos
"""
from django.db import models
from .historial_medico import HistorialMedico
from .inventario import Inventario


class RecetaMedicamento(models.Model):
    """
    Modelo para las recetas de medicamentos asociadas a historiales médicos.
    """
    historial = models.ForeignKey(
        HistorialMedico,
        on_delete=models.CASCADE,
        related_name='recetas'
    )
    medicamento = models.ForeignKey(
        Inventario,
        on_delete=models.PROTECT,
        related_name='recetas',
        limit_choices_to={'categoria': 'medicamento'}
    )
    dosis = models.CharField(max_length=200)
    frecuencia = models.CharField(max_length=200)
    duracion_dias = models.IntegerField()
    instrucciones = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Receta de Medicamento'
        verbose_name_plural = 'Recetas de Medicamentos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Receta: {self.medicamento.nombre} - {self.historial.mascota.nombre}"
