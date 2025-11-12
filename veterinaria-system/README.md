# 🐾 Sistema de Gestión Veterinaria

Sistema completo de gestión para clínicas veterinarias desarrollado con Django REST Framework y React.

## 📋 Descripción

Sistema integral para la gestión de clínicas veterinarias que permite administrar:
- Usuarios (Administradores, Veterinarios, Tutores)
- Mascotas y sus historiales médicos
- Citas veterinarias
- Inventario de productos
- Tutores (dueños de mascotas)

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Django 5.0
- **API**: Django REST Framework 3.14
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Session Authentication
- **Otros**: django-cors-headers, Pillow, django-filter

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Estilos**: CSS3 moderno (sin frameworks)
- **Visualización**: Recharts, date-fns

## 📁 Estructura del Proyecto

```
veterinaria-system/
├── backend/              # Django REST API
│   ├── veterinaria_project/
│   ├── api/              # 8 modelos, serializers, views
│   ├── media/
│   └── requirements.txt
├── frontend/             # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/   # Admin, Veterinario, Tutor
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── styles/
│   └── package.json
└── database/
    └── schema.sql        # Script SQL completo
```

## 🚀 Instalación y Configuración

### Prerequisitos
- Python 3.10+
- Node.js 16+
- PostgreSQL 14+
- Git

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd veterinaria-system
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

#### Configurar Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ir a Settings > Database
3. Copiar la CONNECTION STRING (modo "URI")
4. Pegar en `.env`:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```
5. Ejecutar el script SQL en SQL Editor de Supabase:
```bash
# Copiar contenido de database/schema.sql y ejecutar en Supabase
```

#### Ejecutar migraciones y servidor

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

Backend corriendo en: `http://localhost:8000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

Frontend corriendo en: `http://localhost:3000`

## 👥 Usuarios de Prueba

El sistema incluye usuarios de prueba precargados:

| Rol | Email | Password | Descripción |
|-----|-------|----------|-------------|
| **Administrador** | admin@veterinaria.com | admin123 | Acceso completo al sistema |
| **Veterinario** | vet1@veterinaria.com | vet123 | Dr. Carlos Méndez |
| **Tutor** | tutor1@gmail.com | tutor123 | Juan Pérez (2 mascotas) |

## 📡 Endpoints API

### Base URL: `http://localhost:8000/api`

#### Roles
- `GET /roles/` - Listar roles
- `GET /roles/{id}/` - Obtener rol

#### Usuarios
- `GET /usuarios/` - Listar usuarios
- `POST /usuarios/` - Crear usuario
- `GET /usuarios/{id}/` - Obtener usuario
- `PUT /usuarios/{id}/` - Actualizar usuario
- `DELETE /usuarios/{id}/` - Eliminar usuario
- `GET /usuarios/veterinarios/` - Listar veterinarios

#### Tutores
- `GET /tutores/` - Listar tutores
- `POST /tutores/` - Crear tutor
- `GET /tutores/{id}/` - Obtener tutor
- `PUT /tutores/{id}/` - Actualizar tutor
- `DELETE /tutores/{id}/` - Eliminar tutor
- `GET /tutores/{id}/mascotas/` - Mascotas del tutor

#### Mascotas
- `GET /mascotas/` - Listar mascotas
- `POST /mascotas/` - Crear mascota
- `GET /mascotas/{id}/` - Obtener mascota
- `PUT /mascotas/{id}/` - Actualizar mascota
- `DELETE /mascotas/{id}/` - Eliminar mascota
- `GET /mascotas/{id}/historial_completo/` - Historial completo

#### Citas
- `GET /citas/` - Listar citas
- `POST /citas/` - Crear cita
- `GET /citas/{id}/` - Obtener cita
- `PUT /citas/{id}/` - Actualizar cita
- `DELETE /citas/{id}/` - Eliminar cita
- `GET /citas/proximas/` - Citas próximos 7 días
- `POST /citas/{id}/cambiar_estado/` - Cambiar estado

#### Historiales Médicos
- `GET /historiales/` - Listar historiales
- `POST /historiales/` - Crear historial
- `GET /historiales/{id}/` - Obtener historial
- `PUT /historiales/{id}/` - Actualizar historial
- `DELETE /historiales/{id}/` - Eliminar historial

#### Inventario
- `GET /inventario/` - Listar productos
- `POST /inventario/` - Crear producto
- `GET /inventario/{id}/` - Obtener producto
- `PUT /inventario/{id}/` - Actualizar producto
- `DELETE /inventario/{id}/` - Eliminar producto
- `GET /inventario/bajo_stock/` - Productos bajo stock
- `POST /inventario/{id}/registrar_movimiento/` - Registrar movimiento

#### Dashboard
- `GET /dashboard/estadisticas/` - Estadísticas generales

## 🎨 Características

### Para Administradores
- Panel de control con estadísticas
- Gestión completa de usuarios
- Gestión de tutores
- Control de inventario
- Registro de movimientos

### Para Veterinarios
- Vista de citas próximas
- Gestión de citas (confirmar, completar, cancelar)
- Consulta de historiales médicos
- Detalles completos de pacientes

### Para Tutores
- Vista de sus mascotas
- Historial médico de cada mascota
- Consulta de citas programadas
- Información de tratamientos

## 🗃️ Base de Datos

El sistema utiliza 8 tablas principales:

1. **api_rol** - Roles del sistema
2. **api_usuario** - Usuarios
3. **api_tutor** - Tutores (dueños)
4. **api_mascota** - Mascotas registradas
5. **api_cita** - Citas veterinarias
6. **api_historialmedico** - Historiales médicos
7. **api_inventario** - Productos
8. **api_movimientoinventario** - Movimientos de stock

## 🔧 Comandos Útiles

### Backend
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test

# Ejecutar servidor
python manage.py runserver
```

### Frontend
```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test
```

## 📝 Notas Importantes

- Este es un proyecto educativo/demo
- Las contraseñas en el schema SQL son placeholders
- En producción, implementar autenticación JWT o OAuth
- Configurar CORS apropiadamente para producción
- Usar HTTPS en producción
- Implementar rate limiting en la API

## 🤝 Contribuciones

Este es un proyecto educacional. Para mejoras o sugerencias, crear un issue.

## 📄 Licencia

MIT License

## 👨‍💻 Autor

Sistema desarrollado como proyecto educativo de gestión veterinaria.

---

**¡Sistema listo para usar!** 🎉
