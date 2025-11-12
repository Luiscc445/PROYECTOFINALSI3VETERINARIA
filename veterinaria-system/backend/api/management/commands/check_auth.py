"""
Script de diagnóstico para verificar usuarios y autenticación.
Uso: python manage.py check_auth
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import check_password, make_password
from api.models import Usuario, Rol


class Command(BaseCommand):
    help = 'Verifica que los usuarios y la autenticación funcionen correctamente'

    def handle(self, *args, **kwargs):
        self.stdout.write('='*70)
        self.stdout.write(self.style.SUCCESS('🔍 DIAGNÓSTICO DE AUTENTICACIÓN'))
        self.stdout.write('='*70 + '\n')

        # 1. Verificar roles
        self.stdout.write('1️⃣  Verificando roles...')
        roles = Rol.objects.all()
        if roles.count() == 0:
            self.stdout.write(self.style.ERROR('  ❌ No hay roles en la BD'))
            return
        else:
            for rol in roles:
                self.stdout.write(f'  ✓ {rol.nombre}')
        self.stdout.write('')

        # 2. Verificar usuarios
        self.stdout.write('2️⃣  Verificando usuarios...')
        usuarios = Usuario.objects.all()
        if usuarios.count() == 0:
            self.stdout.write(self.style.ERROR('  ❌ No hay usuarios en la BD'))
            return
        else:
            for usuario in usuarios:
                self.stdout.write(f'  ✓ {usuario.email} - {usuario.rol.nombre} - Activo: {usuario.activo}')
        self.stdout.write(f'\n  Total: {usuarios.count()} usuarios\n')

        # 3. Verificar contraseñas hasheadas
        self.stdout.write('3️⃣  Verificando hashes de contraseñas...')
        credenciales = [
            ('admin@vet.com', 'admin123'),
            ('vet@vet.com', 'vet123'),
            ('tutor@vet.com', 'tutor123'),
        ]

        for email, password in credenciales:
            try:
                usuario = Usuario.objects.get(email=email)

                # Mostrar info del hash
                self.stdout.write(f'\n  Usuario: {email}')
                self.stdout.write(f'  Hash almacenado: {usuario.password_hash[:50]}...')

                # Verificar si es un hash válido de Django
                if usuario.password_hash.startswith('pbkdf2_sha256$'):
                    self.stdout.write('  ✓ Formato de hash correcto (pbkdf2_sha256)')
                else:
                    self.stdout.write(self.style.WARNING('  ⚠️  Formato de hash incorrecto'))

                # Probar la verificación
                if check_password(password, usuario.password_hash):
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Contraseña "{password}" verifica correctamente'))
                else:
                    self.stdout.write(self.style.ERROR(f'  ❌ Contraseña "{password}" NO verifica'))

            except Usuario.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'  ❌ Usuario {email} NO existe'))

        # 4. Probar creación de hash y verificación
        self.stdout.write('\n4️⃣  Probando creación de hash nuevo...')
        test_password = 'test123'
        test_hash = make_password(test_password)
        self.stdout.write(f'  Hash generado: {test_hash[:50]}...')

        if check_password(test_password, test_hash):
            self.stdout.write(self.style.SUCCESS('  ✓ Hash y verificación funcionan correctamente'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ Problema con el sistema de hashing'))

        # 5. Resumen
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✅ DIAGNÓSTICO COMPLETADO'))
        self.stdout.write('='*70)

        # Recomendaciones
        self.stdout.write('\n💡 SOLUCIÓN RECOMENDADA:')
        self.stdout.write('   Si hay problemas con los hashes, ejecuta:')
        self.stdout.write('   python manage.py rebuild_database')
        self.stdout.write('')
