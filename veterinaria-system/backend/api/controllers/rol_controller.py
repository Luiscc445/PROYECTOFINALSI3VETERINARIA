"""
Controller para el modelo Rol.
Arquitectura MVC - Capa de Controladores
"""
from api.models import Rol


class RolController:
    """
    Controlador para la lógica de negocio de Roles.
    """

    @staticmethod
    def get_all_roles():
        """Obtiene todos los roles"""
        return Rol.objects.all()

    @staticmethod
    def get_role_by_id(role_id):
        """Obtiene un rol por ID"""
        return Rol.objects.get(id=role_id)

    @staticmethod
    def get_role_by_name(name):
        """Obtiene un rol por nombre"""
        return Rol.objects.filter(nombre=name).first()

    @staticmethod
    def create_role(data):
        """Crea un nuevo rol"""
        return Rol.objects.create(**data)

    @staticmethod
    def update_role(role_id, data):
        """Actualiza un rol existente"""
        role = Rol.objects.get(id=role_id)
        for key, value in data.items():
            setattr(role, key, value)
        role.save()
        return role

    @staticmethod
    def delete_role(role_id):
        """Elimina un rol"""
        role = Rol.objects.get(id=role_id)
        role.delete()
