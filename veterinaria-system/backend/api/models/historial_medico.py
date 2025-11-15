"""
Modelo HistorialMedico - Arquitectura MVC
"""
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from .mascota import Mascota
from .usuario import Usuario


class HistorialMedico(models.Model):
    """
    Modelo para el historial médico de las mascotas.
    """
    TIPO_CHOICES = [
        ('consulta', 'Consulta'),
        ('vacunacion', 'Vacunación'),
        ('cirugia', 'Cirugía'),
        ('emergencia', 'Emergencia'),
    ]

    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='historiales')
    veterinario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='historiales_realizados')
    fecha = models.DateField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    diagnostico = models.TextField()
    tratamiento = models.TextField()
    medicamentos = models.TextField(blank=True)
    peso_kg = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        blank=True,
        null=True
    )
    temperatura_c = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True
    )
    observaciones = models.TextField(blank=True)
    proxima_visita = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Historial Médico'
        verbose_name_plural = 'Historiales Médicos'
        ordering = ['-fecha']

    def __str__(self):
        return f"Historial: {self.mascota.nombre} - {self.fecha.strftime('%d/%m/%Y')} - {self.tipo}"
