# Backend - Sistema Veterinaria

API REST desarrollada con Django REST Framework para el sistema de gestión veterinaria.

## 🛠️ Tecnologías

- Django 5.0.1
- Django REST Framework 3.14.0
- PostgreSQL (via Supabase)
- Python 3.10+

## 📦 Instalación

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## ⚙️ Configuración

### Archivo .env

```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@host:5432/database
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 🗄️ Base de Datos

### Configurar Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a Settings > Database
4. Copiar la CONNECTION STRING
5. Ejecutar el script `../database/schema.sql` en SQL Editor

### Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

## 🚀 Ejecución

```bash
python manage.py runserver
```

API disponible en: `http://localhost:8000`

## 📡 Endpoints

Ver documentación completa en el README principal.

Base URL: `/api/`

- `/roles/` - Gestión de roles
- `/usuarios/` - Gestión de usuarios
- `/tutores/` - Gestión de tutores
- `/mascotas/` - Gestión de mascotas
- `/citas/` - Gestión de citas
- `/historiales/` - Historiales médicos
- `/inventario/` - Gestión de inventario
- `/movimientos/` - Movimientos de inventario
- `/dashboard/` - Estadísticas

## 🧪 Testing

```bash
python manage.py test
```

## 📝 Modelos

8 modelos principales:
1. Rol
2. Usuario
3. Tutor
4. Mascota
5. Cita
6. HistorialMedico
7. Inventario
8. MovimientoInventario

## 🔐 Admin

Acceder al panel admin en: `http://localhost:8000/admin/`

```bash
# Crear superusuario
python manage.py createsuperuser
```

## 📄 Estructura

```
backend/
├── veterinaria_project/
│   ├── settings.py       # Configuración
│   ├── urls.py          # URLs principales
│   ├── wsgi.py
│   └── asgi.py
├── api/
│   ├── models.py        # 8 modelos
│   ├── serializers.py   # Serializers
│   ├── views.py         # ViewSets
│   ├── urls.py          # URLs de API
│   └── admin.py         # Configuración admin
├── media/               # Archivos subidos
├── manage.py
└── requirements.txt
```
