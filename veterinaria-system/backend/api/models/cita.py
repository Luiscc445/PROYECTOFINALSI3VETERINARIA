"""
Modelo Cita - Citas veterinarias.
Arquitectura MVC - Capa de Modelos
"""
from django.db import models
from .mascota import Mascota
from .usuario import Usuario


class Cita(models.Model):
    """
    Modelo para las citas veterinarias.
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]

    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='citas')
    veterinario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='citas_veterinario')
    fecha_hora = models.DateTimeField()
    motivo = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    observaciones = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['-fecha_hora']

    def __str__(self):
        return f"Cita: {self.mascota.nombre} - {self.fecha_hora.strftime('%d/%m/%Y %H:%M')}"
