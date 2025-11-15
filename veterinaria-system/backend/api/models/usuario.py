"""
Modelo Usuario - Arquitectura MVC
"""
from django.db import models
from .rol import Rol


class Usuario(models.Model):
    """
    Modelo para los usuarios del sistema.
    Puede ser administrador, veterinario o tutor.
    """
    ESPECIALIDAD_CHOICES = [
        ('general', 'Medicina General'),
        ('cirugia', 'Cirugía'),
        ('dermatologia', 'Dermatología'),
        ('cardiologia', 'Cardiología'),
        ('oftalmologia', 'Oftalmología'),
        ('traumatologia', 'Traumatología'),
        ('odontologia', 'Odontología'),
        ('neurologia', 'Neurología'),
        ('oncologia', 'Oncología'),
    ]

    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name='usuarios')
    especialidad = models.CharField(
        max_length=50,
        choices=ESPECIALIDAD_CHOICES,
        blank=True,
        null=True,
        help_text='Especialidad del veterinario (solo aplica para veterinarios)'
    )
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']

    def __str__(self):
        if self.especialidad:
            return f"Dr. {self.nombre_completo} - {self.get_especialidad_display()}"
        return f"{self.nombre_completo} ({self.email})"
