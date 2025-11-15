"""
Controller para Autenticación
Arquitectura MVC - Capa de Controladores
AUTENTICACIÓN REAL CON BCRYPT - NO SIMULADO
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from api.models import Usuario
import bcrypt


class LoginView(APIView):
    """
    Vista para login de usuarios con autenticación real usando bcrypt.
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
            # Buscar usuario por email
            usuario = Usuario.objects.select_related('rol').get(
                email=email,
                activo=True
            )

            # Verificar contraseña con bcrypt
            password_bytes = password.encode('utf-8')
            hash_bytes = usuario.password_hash.encode('utf-8')

            if bcrypt.checkpw(password_bytes, hash_bytes):
                # Contraseña correcta - crear sesión
                request.session['user_id'] = usuario.id
                request.session['user_email'] = usuario.email
                request.session['user_rol'] = usuario.rol.nombre

                # Preparar datos del usuario
                user_data = {
                    'id': usuario.id,
                    'email': usuario.email,
                    'nombre_completo': usuario.nombre_completo,
                    'telefono': usuario.telefono,
                    'rol_nombre': usuario.rol.nombre,
                    'activo': usuario.activo
                }

                # Si es tutor, incluir datos adicionales
                if usuario.rol.nombre == 'tutor':
                    try:
                        tutor = usuario.tutor
                        user_data['tutor_id'] = tutor.id
                        user_data['ci'] = tutor.ci
                    except:
                        pass

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
        except Exception as e:
            return Response(
                {'error': f'Error en el servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    """
    Vista para logout de usuarios.
    """
    def post(self, request):
        try:
            # Limpiar sesión
            request.session.flush()
            return Response(
                {'message': 'Logout exitoso'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'Error al cerrar sesión: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CurrentUserView(APIView):
    """
    Vista para obtener el usuario actual de la sesión.
    """
    def get(self, request):
        user_id = request.session.get('user_id')

        if not user_id:
            return Response(
                {'error': 'No hay sesión activa'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            usuario = Usuario.objects.select_related('rol').get(
                id=user_id,
                activo=True
            )

            user_data = {
                'id': usuario.id,
                'email': usuario.email,
                'nombre_completo': usuario.nombre_completo,
                'telefono': usuario.telefono,
                'rol_nombre': usuario.rol.nombre,
                'activo': usuario.activo
            }

            # Si es tutor, incluir datos adicionales
            if usuario.rol.nombre == 'tutor':
                try:
                    tutor = usuario.tutor
                    user_data['tutor_id'] = tutor.id
                    user_data['ci'] = tutor.ci
                except:
                    pass

            return Response({'user': user_data}, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            # Usuario no existe o inactivo - limpiar sesión
            request.session.flush()
            return Response(
                {'error': 'Usuario no encontrado o inactivo'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {'error': f'Error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RegisterView(APIView):
    """
    Vista para registro de nuevos usuarios (solo para admin).
    Hash de contraseña con bcrypt.
    """
    def post(self, request):
        # Verificar que quien registra sea admin
        user_rol = request.session.get('user_rol')
        if user_rol != 'administrador':
            return Response(
                {'error': 'Solo administradores pueden registrar usuarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        email = request.data.get('email')
        password = request.data.get('password')
        nombre_completo = request.data.get('nombre_completo')
        telefono = request.data.get('telefono', '')
        rol_id = request.data.get('rol')

        if not all([email, password, nombre_completo, rol_id]):
            return Response(
                {'error': 'Todos los campos obligatorios son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verificar que el email no exista
            if Usuario.objects.filter(email=email).exists():
                return Response(
                    {'error': 'El email ya está registrado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Hash de la contraseña con bcrypt
            password_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt)
            password_hash = hashed.decode('utf-8')

            # Crear usuario
            from api.models import Rol
            rol = Rol.objects.get(id=rol_id)

            usuario = Usuario.objects.create(
                email=email,
                password_hash=password_hash,
                nombre_completo=nombre_completo,
                telefono=telefono,
                rol=rol,
                activo=True
            )

            return Response({
                'message': 'Usuario registrado exitosamente',
                'user': {
                    'id': usuario.id,
                    'email': usuario.email,
                    'nombre_completo': usuario.nombre_completo,
                    'rol_nombre': usuario.rol.nombre
                }
            }, status=status.HTTP_201_CREATED)

        except Rol.DoesNotExist:
            return Response(
                {'error': 'Rol no válido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Error al registrar usuario: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
