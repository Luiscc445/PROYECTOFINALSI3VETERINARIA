"""
Modelo Rol - Arquitectura MVC
"""
from django.db import models


class Rol(models.Model):
    """
    Modelo para definir los roles de usuario en el sistema.
    """
    ROLES_CHOICES = [
        ('administrador', 'Administrador'),
        ('veterinario', 'Veterinario'),
        ('tutor', 'Tutor'),
    ]

    nombre = models.CharField(max_length=50, unique=True, choices=ROLES_CHOICES)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
