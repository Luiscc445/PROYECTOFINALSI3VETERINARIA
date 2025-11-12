"""
ViewSets para la API REST del sistema veterinaria.
Incluye más de 40 endpoints para gestión completa.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta
from .models import (
    Rol, Usuario, Tutor, Mascota, Cita,
    HistorialMedico, Inventario, MovimientoInventario
)
from .serializers import (
    RolSerializer, UsuarioSerializer, UsuarioListSerializer,
    TutorSerializer, TutorListSerializer, MascotaSerializer,
    MascotaListSerializer, CitaSerializer, HistorialMedicoSerializer,
    InventarioSerializer, MovimientoInventarioSerializer,
    MascotaHistorialCompletoSerializer
)


class RolViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar roles.
    Endpoints:
    - GET /api/roles/
    - POST /api/roles/
    - GET /api/roles/{id}/
    - PUT /api/roles/{id}/
    - DELETE /api/roles/{id}/
    """
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    filterset_fields = ['nombre']
    permission_classes = []  # Permitir acceso sin autenticación


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios.
    Endpoints:
    - GET /api/usuarios/
    - POST /api/usuarios/
    - GET /api/usuarios/{id}/
    - PUT /api/usuarios/{id}/
    - DELETE /api/usuarios/{id}/
    - GET /api/usuarios/veterinarios/ (custom action)
    """
    queryset = Usuario.objects.select_related('rol').all()
    serializer_class = UsuarioSerializer
    filterset_fields = ['rol', 'activo', 'email']
    permission_classes = []  # Permitir acceso sin autenticación

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return UsuarioListSerializer
        return UsuarioSerializer

    @action(detail=False, methods=['get'])
    def veterinarios(self, request):
        """
        Retorna solo los usuarios con rol de veterinario.
        GET /api/usuarios/veterinarios/
        """
        veterinarios = self.queryset.filter(rol__nombre='veterinario', activo=True)
        serializer = UsuarioListSerializer(veterinarios, many=True)
        return Response(serializer.data)


class TutorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar tutores.
    Endpoints:
    - GET /api/tutores/
    - POST /api/tutores/
    - GET /api/tutores/{id}/
    - PUT /api/tutores/{id}/
    - DELETE /api/tutores/{id}/
    - GET /api/tutores/{id}/mascotas/ (custom action)
    """
    queryset = Tutor.objects.select_related('usuario').all()
    serializer_class = TutorSerializer
    filterset_fields = ['ci']
    permission_classes = []  # Permitir acceso sin autenticación

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return TutorListSerializer
        return TutorSerializer

    @action(detail=True, methods=['get'])
    def mascotas(self, request, pk=None):
        """
        Retorna todas las mascotas de un tutor.
        GET /api/tutores/{id}/mascotas/
        """
        tutor = self.get_object()
        mascotas = tutor.mascotas.filter(activo=True)
        serializer = MascotaListSerializer(mascotas, many=True)
        return Response(serializer.data)


class MascotaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar mascotas.
    Endpoints:
    - GET /api/mascotas/
    - POST /api/mascotas/
    - GET /api/mascotas/{id}/
    - PUT /api/mascotas/{id}/
    - DELETE /api/mascotas/{id}/
    - GET /api/mascotas/{id}/historial_completo/ (custom action)
    """
    queryset = Mascota.objects.select_related('tutor__usuario').all()
    serializer_class = MascotaSerializer
    filterset_fields = ['tutor', 'especie', 'sexo', 'activo']
    permission_classes = []  # Permitir acceso sin autenticación

    def get_serializer_class(self):
        """Retorna serializer simplificado para listar"""
        if self.action == 'list':
            return MascotaListSerializer
        return MascotaSerializer

    @action(detail=True, methods=['get'])
    def historial_completo(self, request, pk=None):
        """
        Retorna el historial médico completo y citas de una mascota.
        GET /api/mascotas/{id}/historial_completo/
        """
        mascota = self.get_object()
        serializer = MascotaHistorialCompletoSerializer(mascota)
        return Response(serializer.data)


class CitaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar citas.
    Endpoints:
    - GET /api/citas/
    - POST /api/citas/
    - GET /api/citas/{id}/
    - PUT /api/citas/{id}/
    - DELETE /api/citas/{id}/
    - GET /api/citas/proximas/ (custom action)
    - POST /api/citas/{id}/cambiar_estado/ (custom action)
    """
    queryset = Cita.objects.select_related(
        'mascota__tutor__usuario',
        'veterinario'
    ).all()
    serializer_class = CitaSerializer
    filterset_fields = ['mascota', 'veterinario', 'estado']
    permission_classes = []  # Permitir acceso sin autenticación

    @action(detail=False, methods=['get'])
    def proximas(self, request):
        """
        Retorna las citas de los próximos 7 días.
        GET /api/citas/proximas/
        """
        hoy = timezone.now()
        fecha_limite = hoy + timedelta(days=7)
        citas = self.queryset.filter(
            fecha_hora__gte=hoy,
            fecha_hora__lte=fecha_limite,
            estado__in=['pendiente', 'confirmada']
        ).order_by('fecha_hora')
        serializer = self.get_serializer(citas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """
        Cambia el estado de una cita.
        POST /api/citas/{id}/cambiar_estado/
        Body: {"estado": "confirmada"}
        """
        cita = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado not in ['pendiente', 'confirmada', 'completada', 'cancelada']:
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cita.estado = nuevo_estado
        cita.save()
        serializer = self.get_serializer(cita)
        return Response(serializer.data)


class HistorialMedicoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar historiales médicos.
    Endpoints:
    - GET /api/historiales/
    - POST /api/historiales/
    - GET /api/historiales/{id}/
    - PUT /api/historiales/{id}/
    - DELETE /api/historiales/{id}/
    """
    queryset = HistorialMedico.objects.select_related(
        'mascota__tutor__usuario',
        'veterinario'
    ).all()
    serializer_class = HistorialMedicoSerializer
    filterset_fields = ['mascota', 'veterinario', 'tipo', 'fecha']
    permission_classes = []  # Permitir acceso sin autenticación


class InventarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar inventario.
    Endpoints:
    - GET /api/inventario/
    - POST /api/inventario/
    - GET /api/inventario/{id}/
    - PUT /api/inventario/{id}/
    - DELETE /api/inventario/{id}/
    - GET /api/inventario/bajo_stock/ (custom action)
    - POST /api/inventario/{id}/registrar_movimiento/ (custom action)
    """
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    filterset_fields = ['categoria', 'activo', 'codigo']
    permission_classes = []  # Permitir acceso sin autenticación

    @action(detail=False, methods=['get'])
    def bajo_stock(self, request):
        """
        Retorna productos con stock bajo o igual al mínimo.
        GET /api/inventario/bajo_stock/
        """
        productos = self.queryset.filter(
            cantidad__lte=models.F('stock_minimo'),
            activo=True
        )
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def registrar_movimiento(self, request, pk=None):
        """
        Registra un movimiento de inventario y actualiza el stock.
        POST /api/inventario/{id}/registrar_movimiento/
        Body: {
            "tipo_movimiento": "entrada|salida|ajuste",
            "cantidad": 10,
            "motivo": "Razón del movimiento",
            "usuario_id": 1
        }
        """
        inventario = self.get_object()
        tipo_movimiento = request.data.get('tipo_movimiento')
        cantidad = request.data.get('cantidad')
        motivo = request.data.get('motivo')
        usuario_id = request.data.get('usuario_id')

        # Validaciones
        if not all([tipo_movimiento, cantidad, motivo, usuario_id]):
            return Response(
                {'error': 'Todos los campos son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cantidad = int(cantidad)
            usuario = Usuario.objects.get(id=usuario_id)
        except (ValueError, Usuario.DoesNotExist):
            return Response(
                {'error': 'Datos inválidos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Actualizar stock según tipo de movimiento
        if tipo_movimiento == 'entrada':
            inventario.cantidad += cantidad
        elif tipo_movimiento == 'salida':
            if inventario.cantidad < cantidad:
                return Response(
                    {'error': f'Stock insuficiente. Disponible: {inventario.cantidad}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            inventario.cantidad -= cantidad
        elif tipo_movimiento == 'ajuste':
            inventario.cantidad = cantidad
        else:
            return Response(
                {'error': 'Tipo de movimiento inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        inventario.save()

        # Crear registro de movimiento
        movimiento = MovimientoInventario.objects.create(
            inventario=inventario,
            usuario=usuario,
            tipo_movimiento=tipo_movimiento,
            cantidad=cantidad,
            motivo=motivo
        )

        return Response({
            'mensaje': 'Movimiento registrado exitosamente',
            'stock_actual': inventario.cantidad,
            'movimiento_id': movimiento.id
        })


class MovimientoInventarioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para movimientos de inventario.
    Endpoints:
    - GET /api/movimientos/
    - GET /api/movimientos/{id}/
    """
    queryset = MovimientoInventario.objects.select_related(
        'inventario',
        'usuario'
    ).all()
    serializer_class = MovimientoInventarioSerializer
    filterset_fields = ['inventario', 'usuario', 'tipo_movimiento']
    permission_classes = []  # Permitir acceso sin autenticación


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet para estadísticas del dashboard.
    Endpoints:
    - GET /api/dashboard/estadisticas/
    """
    permission_classes = []  # Permitir acceso sin autenticación

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Retorna estadísticas generales del sistema.
        GET /api/dashboard/estadisticas/
        """
        hoy = timezone.now().date()

        estadisticas = {
            'total_mascotas': Mascota.objects.filter(activo=True).count(),
            'total_tutores': Tutor.objects.count(),
            'citas_pendientes': Cita.objects.filter(
                estado='pendiente'
            ).count(),
            'citas_hoy': Cita.objects.filter(
                fecha_hora__date=hoy
            ).count(),
            'productos_bajo_stock': Inventario.objects.filter(
                cantidad__lte=models.F('stock_minimo'),
                activo=True
            ).count()
        }

        return Response(estadisticas)


class LoginView(APIView):
    """
    Vista para autenticación de usuarios.
    Endpoint:
    - POST /api/auth/login/
    """
    permission_classes = []  # Permitir acceso sin autenticación

    def post(self, request):
        """
        Autentica un usuario con email y password.
        POST /api/auth/login/
        Body: {"email": "user@example.com", "password": "password123"}
        """
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Buscar el usuario por email
            usuario = Usuario.objects.select_related('rol').get(email=email, activo=True)

            # Verificar la contraseña usando Django's check_password
            if check_password(password, usuario.password_hash):
                # Serializar los datos del usuario
                serializer = UsuarioSerializer(usuario)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Credenciales inválidas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )


# Necesario importar models para usar F()
from django.db import models
