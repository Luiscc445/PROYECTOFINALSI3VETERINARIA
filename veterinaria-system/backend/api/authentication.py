"""
Custom Authentication Classes
Para permitir SessionAuthentication sin CSRF en peticiones cross-origin
"""
from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication sin verificación CSRF.
    Permite peticiones cross-origin desde frontend React.
    """
    def enforce_csrf(self, request):
        # No verificar CSRF para peticiones de API
        return
