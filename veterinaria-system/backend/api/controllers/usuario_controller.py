"""
Controller para el modelo Usuario.
Arquitectura MVC - Capa de Controladores
"""
from api.models import Usuario


class UsuarioController:
    """
    Controlador para la lógica de negocio de Usuarios.
    """

    @staticmethod
    def get_all_users(filters=None):
        """Obtiene todos los usuarios con filtros opcionales"""
        queryset = Usuario.objects.select_related('rol').all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_user_by_id(user_id):
        """Obtiene un usuario por ID"""
        return Usuario.objects.select_related('rol').get(id=user_id)

    @staticmethod
    def get_veterinarians():
        """Obtiene solo los veterinarios activos"""
        return Usuario.objects.filter(
            rol__nombre='veterinario',
            activo=True
        ).select_related('rol')

    @staticmethod
    def create_user(data):
        """Crea un nuevo usuario"""
        return Usuario.objects.create(**data)

    @staticmethod
    def update_user(user_id, data):
        """Actualiza un usuario existente"""
        user = Usuario.objects.get(id=user_id)
        for key, value in data.items():
            setattr(user, key, value)
        user.save()
        return user

    @staticmethod
    def delete_user(user_id):
        """Elimina un usuario"""
        user = Usuario.objects.get(id=user_id)
        user.delete()

    @staticmethod
    def authenticate_user(email, password_hash):
        """Autentica un usuario por email y password"""
        return Usuario.objects.filter(
            email=email,
            password_hash=password_hash,
            activo=True
        ).select_related('rol').first()
