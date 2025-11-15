"""
Modelo Tutor - Tutores (dueños) de mascotas.
Arquitectura MVC - Capa de Modelos
"""
from django.db import models
from datetime import date
from .usuario import Usuario


class Tutor(models.Model):
    """
    Modelo para los tutores (dueños) de mascotas.
    Tiene relación ONE-TO-ONE con Usuario.
    """
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='tutor')
    ci = models.CharField(max_length=20, unique=True, verbose_name='Cédula de Identidad')
    direccion = models.TextField()
    fecha_nacimiento = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Tutor'
        verbose_name_plural = 'Tutores'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.usuario.nombre_completo} - CI: {self.ci}"

    @property
    def edad(self):
        """Calcula la edad del tutor"""
        today = date.today()
        return today.year - self.fecha_nacimiento.year - (
            (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )
