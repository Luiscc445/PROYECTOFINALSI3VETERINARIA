# Arquitectura MVC - Sistema Veterinaria Comunitario

Este documento describe la arquitectura Model-View-Controller (MVC) implementada en el sistema de gestión veterinaria.

## 📁 Estructura del Proyecto

### Backend (Django REST Framework)

```
backend/api/
├── models/                  # MODELS - Modelos de datos
│   ├── __init__.py         # Exporta todos los modelos
│   ├── rol.py              # Modelo de roles
│   ├── usuario.py          # Modelo de usuarios
│   ├── tutor.py            # Modelo de tutores
│   ├── mascota.py          # Modelo de mascotas
│   ├── cita.py             # Modelo de citas
│   ├── historial_medico.py # Modelo de historiales médicos
│   ├── inventario.py       # Modelo de inventario
│   ├── movimiento_inventario.py  # Modelo de movimientos
│   └── receta_medicamento.py     # Modelo de recetas
│
├── serializers/            # VIEW LAYER - Serializadores (presentación de datos)
│   ├── __init__.py
│   ├── rol_serializer.py
│   ├── usuario_serializer.py
│   ├── tutor_serializer.py
│   ├── mascota_serializer.py
│   ├── cita_serializer.py
│   ├── historial_medico_serializer.py
│   ├── inventario_serializer.py
│   ├── movimiento_inventario_serializer.py
│   └── receta_medicamento_serializer.py
│
├── controllers/            # CONTROLLERS - Lógica de negocio
│   ├── __init__.py
│   ├── rol_controller.py
│   ├── usuario_controller.py
│   ├── tutor_controller.py
│   ├── mascota_controller.py
│   ├── cita_controller.py
│   ├── historial_medico_controller.py
│   ├── inventario_controller.py
│   ├── movimiento_inventario_controller.py
│   ├── receta_medicamento_controller.py
│   ├── dashboard_controller.py
│   └── auth_controller.py
│
├── views.py                # Importa y expone todos los controllers
├── urls.py                 # Configuración de rutas
├── admin.py                # Configuración del panel de administración
└── authentication.py       # Autenticación personalizada con sesiones

```

### Frontend (React)

```
frontend/src/
├── models/                 # MODELS - Servicios de API y lógica de datos
│   ├── index.js           # Exporta todos los modelos
│   └── api.js             # Servicios API (axios)
│
├── views/                  # VIEWS - Componentes de presentación
│   ├── index.js
│   ├── common/            # Componentes comunes
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   └── ProtectedRoute.js
│   ├── pages/             # Páginas principales
│   │   ├── Login.js
│   │   ├── AdminDashboard.js
│   │   ├── TutorDashboard.js
│   │   └── VeterinarioDashboard.js
│   ├── admin/             # Vistas del administrador
│   │   ├── GestionUsuarios.js
│   │   ├── GestionMascotas.js
│   │   ├── GestionCitas.js
│   │   └── GestionInventario.js
│   ├── tutor/             # Vistas del tutor
│   │   ├── MisMascotas.js
│   │   ├── MisCitas.js
│   │   ├── HistorialMedico.js
│   │   └── SolicitarCita.js
│   └── veterinario/       # Vistas del veterinario
│       ├── VetHome.js
│       ├── GestionCitas.js
│       └── CrearHistorial.js
│
├── controllers/            # CONTROLLERS - Lógica de negocio y estado
│   ├── index.js
│   ├── AuthContext.js     # Gestión de autenticación
│   └── ToastContext.js    # Gestión de notificaciones
│
├── utils/                  # Utilidades comunes
├── styles/                 # Estilos CSS
├── App.js                  # Componente principal
└── index.js               # Punto de entrada

```

## 🏗️ Principios de la Arquitectura MVC

### Backend

#### **Models** (Modelos)
- **Responsabilidad**: Definir la estructura de datos y lógica de negocio relacionada con los datos
- **Ubicación**: `backend/api/models/`
- **Características**:
  - Cada modelo en su propio archivo
  - Validaciones a nivel de modelo
  - Propiedades computadas (@property)
  - Métodos auxiliares

#### **Views** (Serializadores)
- **Responsabilidad**: Transformar datos entre formatos (JSON ↔ Python objects)
- **Ubicación**: `backend/api/serializers/`
- **Características**:
  - Serialización y deserialización
  - Validaciones de datos de entrada
  - Presentación de datos al cliente
  - Manejo de relaciones entre modelos

#### **Controllers** (ViewSets)
- **Responsabilidad**: Lógica de negocio, orquestación y endpoints personalizados
- **Ubicación**: `backend/api/controllers/`
- **Características**:
  - CRUD operations (Create, Read, Update, Delete)
  - Endpoints personalizados (@action)
  - Filtrado y búsqueda
  - Lógica de negocio compleja (ej: generar PDFs, registrar movimientos)

### Frontend

#### **Models** (Modelos de Datos)
- **Responsabilidad**: Comunicación con el backend (API calls)
- **Ubicación**: `frontend/src/models/`
- **Características**:
  - Servicios de API con axios
  - Gestión de requests HTTP
  - Manejo de errores de red
  - Transformación de datos si es necesario

#### **Views** (Vistas)
- **Responsabilidad**: Presentación visual y UI
- **Ubicación**: `frontend/src/views/`
- **Características**:
  - Componentes React puros
  - Renderizado de datos
  - Manejo de eventos de usuario
  - Navegación entre páginas

#### **Controllers** (Controladores)
- **Responsabilidad**: Lógica de negocio del frontend y gestión de estado
- **Ubicación**: `frontend/src/controllers/`
- **Características**:
  - Contexts de React (AuthContext, ToastContext)
  - Hooks personalizados
  - Lógica de estado global
  - Validaciones del lado del cliente

## 🔄 Flujo de Datos

### Flujo de Lectura (GET)
```
User → View (Component) → Controller (Context/Hook) → Model (API Service) → Backend API
                                                                                  ↓
User ← View (Component) ← Controller (Context/Hook) ← Model (API Service) ← Response
```

### Flujo de Escritura (POST/PUT)
```
User → View (Form) → Controller (Validation) → Model (API Call) → Backend Controller
                                                                         ↓
Backend Controller → Backend Serializer (Validation) → Backend Model (Database)
                                                                         ↓
Success ← View ← Controller ← Model ← Backend Serializer ← Backend Controller
```

## 🎯 Beneficios de esta Arquitectura

### Separación de Responsabilidades
- Cada capa tiene una responsabilidad única y bien definida
- Fácil de entender y mantener
- Código más limpio y organizado

### Escalabilidad
- Fácil agregar nuevos modelos, vistas o controladores
- Cambios en una capa no afectan las otras
- Múltiples desarrolladores pueden trabajar simultáneamente

### Mantenibilidad
- Código modular y reutilizable
- Fácil localización de bugs
- Testing más sencillo (cada capa se puede testear independientemente)

### Reutilización
- Serializers pueden ser reutilizados en diferentes endpoints
- Componentes de UI pueden ser reutilizados en diferentes páginas
- Servicios de API centralizados

## 📝 Convenciones de Código

### Backend

1. **Nombres de Archivos**: snake_case
   - `usuario_controller.py`, `mascota_serializer.py`

2. **Nombres de Clases**: PascalCase
   - `UsuarioViewSet`, `MascotaSerializer`

3. **Imports**: Organizados y explícitos
   ```python
   from ..models import Usuario
   from ..serializers import UsuarioSerializer
   ```

### Frontend

1. **Nombres de Archivos**: PascalCase para componentes
   - `MisMascotas.js`, `GestionCitas.js`

2. **Nombres de Carpetas**: camelCase
   - `models/`, `views/`, `controllers/`

3. **Imports**: Agrupados por tipo
   ```javascript
   // Controllers (lógica)
   import { AuthProvider } from './controllers';
   // Views (presentación)
   import { Login } from './views';
   // Models (datos)
   import { usuariosAPI } from './models';
   ```

## 🚀 Funcionalidades Implementadas

### Sistema Completo
- ✅ Autenticación con sesiones (bcrypt)
- ✅ Gestión de usuarios (3 roles: admin, veterinario, tutor)
- ✅ Gestión de mascotas
- ✅ Sistema de citas médicas
  - Tutores solicitan citas directamente
  - Veterinarios ven solicitudes automáticamente
  - Observaciones visibles entre tutor y veterinario
- ✅ Historial médico completo
- ✅ Generación de PDFs profesionales
- ✅ Gestión de inventario
- ✅ Sistema de recetas médicas
- ✅ Dashboard con estadísticas
- ✅ Notificaciones toast
- ✅ Rutas protegidas por rol

## 🔧 Tecnologías Utilizadas

### Backend
- Django REST Framework
- PostgreSQL (Supabase)
- bcrypt (hash de contraseñas)
- ReportLab (generación de PDFs)
- Session Authentication

### Frontend
- React 18
- React Router v6
- Axios
- date-fns
- Context API

## 📖 Documentación de Endpoints

Todos los endpoints están documentados en cada controller. Ver archivos en `backend/api/controllers/` para más detalles.

## 🎓 Para Desarrolladores

### Agregar un Nuevo Modelo

1. Crear modelo en `backend/api/models/nuevo_modelo.py`
2. Exportarlo en `backend/api/models/__init__.py`
3. Crear serializer en `backend/api/serializers/nuevo_modelo_serializer.py`
4. Exportarlo en `backend/api/serializers/__init__.py`
5. Crear controller en `backend/api/controllers/nuevo_modelo_controller.py`
6. Exportarlo en `backend/api/controllers/__init__.py`
7. Importarlo en `backend/api/views.py`
8. Registrar en `backend/api/urls.py`
9. Hacer migraciones: `python manage.py makemigrations && python manage.py migrate`

### Agregar un Nuevo Componente Frontend

1. Crear componente en `frontend/src/views/[categoria]/NuevoComponente.js`
2. Exportarlo en `frontend/src/views/index.js`
3. Importarlo donde sea necesario desde `./views`

---

**Desarrollado con ❤️ siguiendo las mejores prácticas de arquitectura MVC**
