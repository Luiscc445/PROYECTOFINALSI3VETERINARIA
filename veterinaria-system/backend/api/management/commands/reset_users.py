"""
Comando de Django para resetear usuarios con contraseñas hasheadas.
Uso: python manage.py reset_users
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from api.models import (
    Usuario, Tutor, Rol, MovimientoInventario,
    HistorialMedico, Cita, Mascota, Inventario
)


class Command(BaseCommand):
    help = 'Elimina todos los usuarios y crea 3 usuarios de prueba con contraseñas hasheadas'

    def handle(self, *args, **kwargs):
        self.stdout.write('=== Reseteando usuarios ===\n')

        # Eliminar en orden de dependencias (de hijos a padres)

        # 1. MovimientoInventario (referencia a Usuario e Inventario)
        count = MovimientoInventario.objects.count()
        MovimientoInventario.objects.all().delete()
        self.stdout.write(f'✓ Eliminados {count} movimientos de inventario')

        # 2. Inventario (puede tener referencias)
        count = Inventario.objects.count()
        Inventario.objects.all().delete()
        self.stdout.write(f'✓ Eliminados {count} productos de inventario')

        # 3. HistorialMedico (referencia a Mascota y Usuario)
        count = HistorialMedico.objects.count()
        HistorialMedico.objects.all().delete()
        self.stdout.write(f'✓ Eliminados {count} historiales médicos')

        # 4. Cita (referencia a Mascota y Usuario)
        count = Cita.objects.count()
        Cita.objects.all().delete()
        self.stdout.write(f'✓ Eliminadas {count} citas')

        # 5. Mascota (referencia a Tutor)
        count = Mascota.objects.count()
        Mascota.objects.all().delete()
        self.stdout.write(f'✓ Eliminadas {count} mascotas')

        # 6. Tutor (referencia a Usuario)
        count = Tutor.objects.count()
        Tutor.objects.all().delete()
        self.stdout.write(f'✓ Eliminados {count} tutores')

        # 7. Usuario (raíz de la jerarquía)
        count = Usuario.objects.count()
        Usuario.objects.all().delete()
        self.stdout.write(f'✓ Eliminados {count} usuarios')

        # 3. Obtener los roles
        try:
            rol_admin = Rol.objects.get(nombre='administrador')
            rol_vet = Rol.objects.get(nombre='veterinario')
            rol_tutor = Rol.objects.get(nombre='tutor')
        except Rol.DoesNotExist:
            self.stdout.write(self.style.ERROR('ERROR: No se encontraron los roles. Ejecuta las migraciones primero.'))
            return

        # 4. Crear usuarios con contraseñas hasheadas
        usuarios_nuevos = [
            {
                'email': 'admin@vet.com',
                'password': 'admin123',
                'nombre_completo': 'Administrador Sistema',
                'telefono': '77111111',
                'rol': rol_admin,
                'activo': True,
            },
            {
                'email': 'vet@vet.com',
                'password': 'vet123',
                'nombre_completo': 'Dr. Carlos Veterinario',
                'telefono': '77222222',
                'rol': rol_vet,
                'activo': True,
            },
            {
                'email': 'tutor@vet.com',
                'password': 'tutor123',
                'nombre_completo': 'Juan Pérez Tutor',
                'telefono': '77333333',
                'rol': rol_tutor,
                'activo': True,
            },
        ]

        usuarios_creados = []
        for user_data in usuarios_nuevos:
            password = user_data.pop('password')
            password_hash = make_password(password)

            usuario = Usuario.objects.create(
                email=user_data['email'],
                password_hash=password_hash,
                nombre_completo=user_data['nombre_completo'],
                telefono=user_data['telefono'],
                rol=user_data['rol'],
                activo=user_data['activo']
            )
            usuarios_creados.append(usuario)
            self.stdout.write(f'✓ Creado usuario: {usuario.email} ({usuario.rol.nombre})')

        # 5. Crear el tutor para el usuario con rol tutor
        usuario_tutor = usuarios_creados[2]  # El tercer usuario es el tutor
        tutor = Tutor.objects.create(
            usuario=usuario_tutor,
            ci='1234567 LP',
            direccion='Av. Principal #123, La Paz',
            fecha_nacimiento='1990-01-15'
        )
        self.stdout.write(f'✓ Creado tutor para: {usuario_tutor.email}')

        # 8. Mostrar resumen
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('✓ RESET COMPLETADO\n'))
        self.stdout.write(self.style.WARNING('ATENCIÓN: Se eliminaron TODOS los datos del sistema'))
        self.stdout.write('(movimientos, inventario, historiales, citas, mascotas)\n')
        self.stdout.write('Usuarios creados:')
        self.stdout.write('1. Administrador: admin@vet.com / admin123')
        self.stdout.write('2. Veterinario:   vet@vet.com / vet123')
        self.stdout.write('3. Tutor:         tutor@vet.com / tutor123')
        self.stdout.write('='*60)
