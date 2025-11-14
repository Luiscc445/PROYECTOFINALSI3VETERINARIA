"""
Autenticación personalizada para Django REST Framework.
Permite autenticar usando el modelo Usuario personalizado con sesiones.
"""
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Usuario


class SessionAuthentication(BaseAuthentication):
    """
    Autenticación basada en sesión para el modelo Usuario personalizado.
    """

    def authenticate(self, request):
        """
        Autentica al usuario basándose en la sesión.
        Retorna una tupla (user, None) si la autenticación es exitosa.
        """
        # Obtener user_id de la sesión
        user_id = request.session.get('user_id')

        if not user_id:
            return None  # No hay usuario en sesión

        try:
            # Buscar el usuario en la base de datos
            usuario = Usuario.objects.select_related('rol').get(id=user_id)

            # DRF espera un objeto user con is_authenticated
            # Añadimos esta propiedad dinámicamente
            usuario.is_authenticated = True

            return (usuario, None)
        except Usuario.DoesNotExist:
            # Usuario en sesión no existe en BD
            return None

    def authenticate_header(self, request):
        """
        Retorna el encabezado WWW-Authenticate que debe usarse en respuestas 401.
        """
        return 'Session'
