"""
Modelo Usuario - Usuarios del sistema.
Arquitectura MVC - Capa de Modelos
"""
from django.db import models
from .rol import Rol


class Usuario(models.Model):
    """
    Modelo para los usuarios del sistema.
    Puede ser administrador, veterinario o tutor.
    """
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    nombre_completo = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name='usuarios')
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nombre_completo} ({self.email})"
