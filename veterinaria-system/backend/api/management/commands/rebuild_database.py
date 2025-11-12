"""
Comando de Django para reconstruir toda la base de datos con datos de prueba.
Uso: python manage.py rebuild_database
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from datetime import timedelta, date
from api.models import (
    Rol, Usuario, Tutor, Mascota, Cita,
    HistorialMedico, Inventario, MovimientoInventario
)


class Command(BaseCommand):
    help = 'Reconstruye la base de datos con datos de prueba completos'

    def handle(self, *args, **kwargs):
        self.stdout.write('='*70)
        self.stdout.write(self.style.SUCCESS('🔄 RECONSTRUYENDO BASE DE DATOS'))
        self.stdout.write('='*70 + '\n')

        # Eliminar todos los datos en orden de dependencias
        self._eliminar_datos()

        # Crear roles si no existen
        self._crear_roles()

        # Crear usuarios con contraseñas hasheadas
        usuarios = self._crear_usuarios()

        # Crear tutores
        tutores = self._crear_tutores(usuarios)

        # Crear mascotas
        mascotas = self._crear_mascotas(tutores)

        # Crear inventario
        inventario = self._crear_inventario()

        # Crear movimientos de inventario
        self._crear_movimientos_inventario(inventario, usuarios)

        # Crear citas
        self._crear_citas(mascotas, usuarios)

        # Crear historiales médicos
        self._crear_historiales(mascotas, usuarios)

        # Resumen final
        self._mostrar_resumen()

    def _eliminar_datos(self):
        self.stdout.write('📦 Eliminando datos antiguos...')

        count = MovimientoInventario.objects.count()
        MovimientoInventario.objects.all().delete()
        self.stdout.write(f'  ✓ {count} movimientos de inventario')

        count = Inventario.objects.count()
        Inventario.objects.all().delete()
        self.stdout.write(f'  ✓ {count} productos de inventario')

        count = HistorialMedico.objects.count()
        HistorialMedico.objects.all().delete()
        self.stdout.write(f'  ✓ {count} historiales médicos')

        count = Cita.objects.count()
        Cita.objects.all().delete()
        self.stdout.write(f'  ✓ {count} citas')

        count = Mascota.objects.count()
        Mascota.objects.all().delete()
        self.stdout.write(f'  ✓ {count} mascotas')

        count = Tutor.objects.count()
        Tutor.objects.all().delete()
        self.stdout.write(f'  ✓ {count} tutores')

        count = Usuario.objects.count()
        Usuario.objects.all().delete()
        self.stdout.write(f'  ✓ {count} usuarios\n')

    def _crear_roles(self):
        self.stdout.write('👥 Verificando roles...')
        roles = ['administrador', 'veterinario', 'tutor']
        for rol_nombre in roles:
            Rol.objects.get_or_create(
                nombre=rol_nombre,
                defaults={'descripcion': f'Rol de {rol_nombre}'}
            )
        self.stdout.write(f'  ✓ 3 roles verificados\n')

    def _crear_usuarios(self):
        self.stdout.write('👤 Creando usuarios...')

        rol_admin = Rol.objects.get(nombre='administrador')
        rol_vet = Rol.objects.get(nombre='veterinario')
        rol_tutor = Rol.objects.get(nombre='tutor')

        usuarios_data = [
            # Administrador
            {'email': 'admin@vet.com', 'password': 'admin123', 'nombre': 'Admin Sistema',
             'telefono': '77111111', 'rol': rol_admin},

            # Veterinarios
            {'email': 'vet@vet.com', 'password': 'vet123', 'nombre': 'Dr. Carlos Veterinario',
             'telefono': '77222222', 'rol': rol_vet},
            {'email': 'vet2@vet.com', 'password': 'vet123', 'nombre': 'Dra. María López',
             'telefono': '77333333', 'rol': rol_vet},

            # Tutores
            {'email': 'tutor@vet.com', 'password': 'tutor123', 'nombre': 'Juan Pérez García',
             'telefono': '77444444', 'rol': rol_tutor},
            {'email': 'tutor2@vet.com', 'password': 'tutor123', 'nombre': 'Ana Martínez Silva',
             'telefono': '77555555', 'rol': rol_tutor},
            {'email': 'tutor3@vet.com', 'password': 'tutor123', 'nombre': 'Pedro Rodríguez',
             'telefono': '77666666', 'rol': rol_tutor},
        ]

        usuarios = []
        for data in usuarios_data:
            usuario = Usuario.objects.create(
                email=data['email'],
                password_hash=make_password(data['password']),
                nombre_completo=data['nombre'],
                telefono=data['telefono'],
                rol=data['rol'],
                activo=True
            )
            usuarios.append(usuario)
            self.stdout.write(f'  ✓ {usuario.email} ({usuario.rol.nombre})')

        self.stdout.write(f'\n  Total: {len(usuarios)} usuarios creados\n')
        return usuarios

    def _crear_tutores(self, usuarios):
        self.stdout.write('🏠 Creando tutores...')

        # Filtrar solo usuarios con rol tutor (últimos 3)
        tutores_usuarios = [u for u in usuarios if u.rol.nombre == 'tutor']

        tutores_data = [
            {'ci': '1234567 LP', 'direccion': 'Av. 6 de Agosto #2500, La Paz',
             'fecha_nacimiento': '1990-01-15'},
            {'ci': '2345678 LP', 'direccion': 'Calle Comercio #1234, La Paz',
             'fecha_nacimiento': '1985-06-20'},
            {'ci': '3456789 LP', 'direccion': 'Av. Busch #567, El Alto',
             'fecha_nacimiento': '1992-03-10'},
        ]

        tutores = []
        for i, data in enumerate(tutores_data):
            tutor = Tutor.objects.create(
                usuario=tutores_usuarios[i],
                ci=data['ci'],
                direccion=data['direccion'],
                fecha_nacimiento=data['fecha_nacimiento']
            )
            tutores.append(tutor)
            self.stdout.write(f'  ✓ {tutor.usuario.nombre_completo} - CI: {tutor.ci}')

        self.stdout.write(f'\n  Total: {len(tutores)} tutores creados\n')
        return tutores

    def _crear_mascotas(self, tutores):
        self.stdout.write('🐾 Creando mascotas...')

        mascotas_data = [
            # Mascotas del tutor 1
            {'tutor_idx': 0, 'nombre': 'Rocky', 'especie': 'Perro', 'raza': 'Labrador',
             'fecha_nacimiento': '2020-03-10', 'sexo': 'Macho', 'color': 'Dorado', 'peso': 28.50},
            {'tutor_idx': 0, 'nombre': 'Luna', 'especie': 'Gato', 'raza': 'Siamés',
             'fecha_nacimiento': '2021-07-22', 'sexo': 'Hembra', 'color': 'Crema', 'peso': 4.20},

            # Mascotas del tutor 2
            {'tutor_idx': 1, 'nombre': 'Max', 'especie': 'Perro', 'raza': 'Pastor Alemán',
             'fecha_nacimiento': '2019-05-15', 'sexo': 'Macho', 'color': 'Negro y café', 'peso': 35.00},
            {'tutor_idx': 1, 'nombre': 'Nala', 'especie': 'Gato', 'raza': 'Persa',
             'fecha_nacimiento': '2020-11-30', 'sexo': 'Hembra', 'color': 'Blanco', 'peso': 5.00},

            # Mascotas del tutor 3
            {'tutor_idx': 2, 'nombre': 'Toby', 'especie': 'Perro', 'raza': 'Beagle',
             'fecha_nacimiento': '2021-01-20', 'sexo': 'Macho', 'color': 'Tricolor', 'peso': 12.00},
        ]

        mascotas = []
        for data in mascotas_data:
            mascota = Mascota.objects.create(
                tutor=tutores[data['tutor_idx']],
                nombre=data['nombre'],
                especie=data['especie'],
                raza=data['raza'],
                fecha_nacimiento=data['fecha_nacimiento'],
                sexo=data['sexo'],
                color=data['color'],
                peso_kg=data['peso'],
                activo=True
            )
            mascotas.append(mascota)
            self.stdout.write(f'  ✓ {mascota.nombre} ({mascota.especie}) - Tutor: {mascota.tutor.usuario.nombre_completo}')

        self.stdout.write(f'\n  Total: {len(mascotas)} mascotas creadas\n')
        return mascotas

    def _crear_inventario(self):
        self.stdout.write('📦 Creando inventario...')

        productos_data = [
            {'codigo': 'MED-001', 'nombre': 'Amoxicilina 500mg', 'categoria': 'medicamento',
             'descripcion': 'Antibiótico de amplio espectro', 'cantidad': 50,
             'unidad': 'unidades', 'precio': 15.50, 'stock_min': 20,
             'fecha_venc': date.today() + timedelta(days=540), 'proveedor': 'Farmacia Vet Central'},

            {'codigo': 'MED-002', 'nombre': 'Vacuna Antirrábica', 'categoria': 'medicamento',
             'descripcion': 'Vacuna contra la rabia', 'cantidad': 30,
             'unidad': 'dosis', 'precio': 45.00, 'stock_min': 15,
             'fecha_venc': date.today() + timedelta(days=365), 'proveedor': 'Laboratorios VetPro'},

            {'codigo': 'ALI-001', 'nombre': 'Alimento Premium Perro Adulto', 'categoria': 'alimento',
             'descripcion': 'Alimento balanceado 15kg', 'cantidad': 25,
             'unidad': 'bolsas', 'precio': 120.00, 'stock_min': 10,
             'fecha_venc': date.today() + timedelta(days=180), 'proveedor': 'Distribuidora PetFood'},

            {'codigo': 'ACC-001', 'nombre': 'Collar Antipulgas', 'categoria': 'accesorio',
             'descripcion': 'Collar antipulgas 6 meses', 'cantidad': 40,
             'unidad': 'unidades', 'precio': 35.00, 'stock_min': 15,
             'fecha_venc': date.today() + timedelta(days=730), 'proveedor': 'Importadora PetCare'},
        ]

        inventario = []
        for data in productos_data:
            producto = Inventario.objects.create(
                codigo=data['codigo'],
                nombre=data['nombre'],
                categoria=data['categoria'],
                descripcion=data['descripcion'],
                cantidad=data['cantidad'],
                unidad_medida=data['unidad'],
                precio_unitario=data['precio'],
                stock_minimo=data['stock_min'],
                fecha_vencimiento=data['fecha_venc'],
                proveedor=data['proveedor'],
                activo=True
            )
            inventario.append(producto)
            self.stdout.write(f'  ✓ {producto.codigo} - {producto.nombre} ({producto.cantidad} {producto.unidad_medida})')

        self.stdout.write(f'\n  Total: {len(inventario)} productos creados\n')
        return inventario

    def _crear_movimientos_inventario(self, inventario, usuarios):
        self.stdout.write('📋 Creando movimientos de inventario...')

        admin = usuarios[0]  # El administrador

        movimientos = []
        for producto in inventario:
            # Movimiento de entrada inicial
            mov = MovimientoInventario.objects.create(
                inventario=producto,
                usuario=admin,
                tipo_movimiento='entrada',
                cantidad=producto.cantidad,
                motivo='Stock inicial del producto',
                fecha=timezone.now() - timedelta(days=60)
            )
            movimientos.append(mov)

        self.stdout.write(f'  ✓ {len(movimientos)} movimientos iniciales registrados\n')
        return movimientos

    def _crear_citas(self, mascotas, usuarios):
        self.stdout.write('📅 Creando citas...')

        # Veterinario (usuario índice 1)
        veterinario = [u for u in usuarios if u.rol.nombre == 'veterinario'][0]

        citas_data = [
            {'mascota_idx': 0, 'dias': 2, 'motivo': 'Control de rutina y vacunación', 'estado': 'pendiente'},
            {'mascota_idx': 1, 'dias': 3, 'motivo': 'Revisión general', 'estado': 'confirmada'},
            {'mascota_idx': 2, 'dias': 5, 'motivo': 'Consulta por pérdida de apetito', 'estado': 'pendiente'},
            {'mascota_idx': 3, 'dias': 7, 'motivo': 'Baño y corte de pelo', 'estado': 'pendiente'},
        ]

        citas = []
        for data in citas_data:
            cita = Cita.objects.create(
                mascota=mascotas[data['mascota_idx']],
                veterinario=veterinario,
                fecha_hora=timezone.now() + timedelta(days=data['dias']),
                motivo=data['motivo'],
                estado=data['estado'],
                observaciones='Cita creada automáticamente'
            )
            citas.append(cita)
            self.stdout.write(f'  ✓ Cita para {cita.mascota.nombre} - {cita.motivo} ({cita.estado})')

        self.stdout.write(f'\n  Total: {len(citas)} citas creadas\n')
        return citas

    def _crear_historiales(self, mascotas, usuarios):
        self.stdout.write('📝 Creando historiales médicos...')

        veterinario = [u for u in usuarios if u.rol.nombre == 'veterinario'][0]

        historiales_data = [
            {'mascota_idx': 0, 'tipo': 'consulta',
             'diagnostico': 'Mascota en buen estado de salud',
             'tratamiento': 'Mantener dieta balanceada y ejercicio regular',
             'medicamentos': 'Desparasitante interno', 'peso': 27.80, 'temp': 38.5},

            {'mascota_idx': 1, 'tipo': 'vacunacion',
             'diagnostico': 'Vacunación triple felina',
             'tratamiento': 'Observación por 24 horas post-vacuna',
             'medicamentos': 'Vacuna triple felina', 'peso': 4.10, 'temp': 38.2},

            {'mascota_idx': 2, 'tipo': 'consulta',
             'diagnostico': 'Control de rutina exitoso',
             'tratamiento': 'Continuar con alimentación actual',
             'medicamentos': 'Vitaminas', 'peso': 34.50, 'temp': 38.7},
        ]

        historiales = []
        for data in historiales_data:
            historial = HistorialMedico.objects.create(
                mascota=mascotas[data['mascota_idx']],
                veterinario=veterinario,
                fecha=timezone.now().date() - timedelta(days=30),
                tipo=data['tipo'],
                diagnostico=data['diagnostico'],
                tratamiento=data['tratamiento'],
                medicamentos=data['medicamentos'],
                peso_kg=data['peso'],
                temperatura_c=data['temp'],
                observaciones='Historial generado automáticamente',
                proxima_visita=timezone.now().date() + timedelta(days=90)
            )
            historiales.append(historial)
            self.stdout.write(f'  ✓ Historial de {historial.mascota.nombre} - {historial.tipo}')

        self.stdout.write(f'\n  Total: {len(historiales)} historiales creados\n')
        return historiales

    def _mostrar_resumen(self):
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✅ BASE DE DATOS RECONSTRUIDA EXITOSAMENTE'))
        self.stdout.write('='*70 + '\n')

        self.stdout.write(self.style.WARNING('📊 RESUMEN DE DATOS CREADOS:'))
        self.stdout.write(f'  • Usuarios: {Usuario.objects.count()}')
        self.stdout.write(f'  • Tutores: {Tutor.objects.count()}')
        self.stdout.write(f'  • Mascotas: {Mascota.objects.count()}')
        self.stdout.write(f'  • Citas: {Cita.objects.count()}')
        self.stdout.write(f'  • Historiales: {HistorialMedico.objects.count()}')
        self.stdout.write(f'  • Productos: {Inventario.objects.count()}')
        self.stdout.write(f'  • Movimientos: {MovimientoInventario.objects.count()}')

        self.stdout.write('\n' + self.style.WARNING('🔐 CREDENCIALES DE ACCESO:'))
        self.stdout.write('  Admin:       admin@vet.com / admin123')
        self.stdout.write('  Veterinario: vet@vet.com / vet123')
        self.stdout.write('  Tutor:       tutor@vet.com / tutor123')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('🚀 Sistema listo para usar!'))
        self.stdout.write('='*70)
