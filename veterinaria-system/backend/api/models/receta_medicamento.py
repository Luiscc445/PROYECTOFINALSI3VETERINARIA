"""
Modelo RecetaMedicamento - Arquitectura MVC
"""
from django.db import models
from django.core.validators import MinValueValidator
from .historial_medico import HistorialMedico
from .inventario import Inventario


class RecetaMedicamento(models.Model):
    """
    Modelo para las recetas médicas de medicamentos.
    Asociada a un historial médico y un medicamento del inventario.
    """
    historial_medico = models.ForeignKey(
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
    dosis = models.CharField(max_length=100, help_text='Ej: 1 tableta, 5ml, etc.')
    frecuencia = models.CharField(max_length=100, help_text='Ej: Cada 8 horas, 2 veces al día, etc.')
    duracion = models.CharField(max_length=100, help_text='Ej: 7 días, 2 semanas, etc.')
    instrucciones = models.TextField(blank=True, help_text='Instrucciones adicionales')
    cantidad_total = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text='Cantidad total de unidades recetadas'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Receta de Medicamento'
        verbose_name_plural = 'Recetas de Medicamentos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Receta: {self.medicamento.nombre} - {self.historial_medico.mascota.nombre}"
