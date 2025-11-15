"""
Controller para Autenticación - Arquitectura MVC
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from ..models import Usuario
import bcrypt


class LoginView(APIView):
    """
    Vista para autenticación de usuarios.
    Endpoint: POST /api/auth/login/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Buscar el usuario por email
            usuario = Usuario.objects.select_related('rol').get(email=email)

            # Verificar la contraseña con bcrypt
            password_bytes = password.encode('utf-8')
            hash_bytes = usuario.password_hash.encode('utf-8')

            if bcrypt.checkpw(password_bytes, hash_bytes):
                # Autenticar y crear sesión
                request.session['user_id'] = usuario.id
                request.session['user_email'] = usuario.email
                request.session['user_rol'] = usuario.rol.nombre if usuario.rol else None

                # Forzar guardado de sesión
                request.session.modified = True
                request.session.save()

                # Preparar datos del usuario para respuesta
                user_data = {
                    'id': usuario.id,
                    'email': usuario.email,
                    'nombre': usuario.nombre_completo,
                    'rol_nombre': usuario.rol.nombre if usuario.rol else None,
                    'especialidad': usuario.get_especialidad_display() if usuario.especialidad else None,
                }

                return Response({
                    'message': 'Login exitoso',
                    'user': user_data
                }, status=status.HTTP_200_OK)
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


class LogoutView(APIView):
    """
    Vista para cerrar sesión.
    Endpoint: POST /api/auth/logout/
    """
    def post(self, request):
        # Limpiar la sesión
        request.session.flush()

        return Response(
            {'message': 'Logout exitoso'},
            status=status.HTTP_200_OK
        )
