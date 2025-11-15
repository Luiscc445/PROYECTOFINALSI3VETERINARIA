"""
Modelo MovimientoInventario - Arquitectura MVC
"""
from django.db import models
from .inventario import Inventario
from .usuario import Usuario


class MovimientoInventario(models.Model):
    """
    Modelo para registrar movimientos del inventario.
    """
    TIPO_MOVIMIENTO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste'),
    ]

    inventario = models.ForeignKey(Inventario, on_delete=models.CASCADE, related_name='movimientos')
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='movimientos_inventario')
    tipo_movimiento = models.CharField(max_length=20, choices=TIPO_MOVIMIENTO_CHOICES)
    cantidad = models.IntegerField()
    motivo = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Movimiento de Inventario'
        verbose_name_plural = 'Movimientos de Inventario'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.tipo_movimiento} - {self.inventario.nombre} - {self.cantidad} - {self.fecha.strftime('%d/%m/%Y')}"
