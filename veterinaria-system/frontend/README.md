# Frontend - Sistema Veterinaria

Aplicación web desarrollada con React para el sistema de gestión veterinaria.

## 🛠️ Tecnologías

- React 18.2.0
- React Router DOM 6.21.0
- Axios 1.6.2
- CSS3 moderno
- date-fns 3.0.6
- recharts 2.10.3

## 📦 Instalación

```bash
# Instalar dependencias
npm install
```

## 🚀 Ejecución

```bash
# Modo desarrollo
npm start

# Build para producción
npm run build

# Tests
npm test
```

Aplicación disponible en: `http://localhost:3000`

## 📁 Estructura

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── admin/           # Componentes de administrador
│   │   │   ├── AdminHome.js
│   │   │   ├── GestionUsuarios.js
│   │   │   ├── GestionTutores.js
│   │   │   └── GestionInventario.js
│   │   ├── veterinario/     # Componentes de veterinario
│   │   │   ├── VetHome.js
│   │   │   ├── GestionCitas.js
│   │   │   └── HistorialesMedicos.js
│   │   ├── tutor/           # Componentes de tutor
│   │   │   ├── TutorHome.js
│   │   │   ├── MisMascotas.js
│   │   │   └── MisCitas.js
│   │   ├── Navbar.js        # Barra superior
│   │   ├── Sidebar.js       # Menu lateral
│   │   └── ProtectedRoute.js # Protección de rutas
│   ├── pages/
│   │   ├── Login.js
│   │   ├── AdminDashboard.js
│   │   ├── VeterinarioDashboard.js
│   │   └── TutorDashboard.js
│   ├── services/
│   │   └── api.js           # Servicio API
│   ├── context/
│   │   └── AuthContext.js   # Contexto de auth
│   ├── styles/              # CSS moderno
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── Navbar.css
│   │   ├── Sidebar.css
│   │   ├── Tables.css
│   │   └── AdminHome.css
│   ├── App.js
│   └── index.js
└── package.json
```

## 🎨 Diseño

### Paleta de Colores

```css
--primary-color: #2196F3;    /* Azul */
--secondary-color: #4CAF50;   /* Verde */
--danger-color: #f44336;      /* Rojo */
--warning-color: #ff9800;     /* Naranja */
--info-color: #00bcd4;        /* Cian */
```

### Características

- Diseño responsive
- Gradientes modernos
- Animaciones suaves
- Box-shadows para profundidad
- Variables CSS
- Flexbox y Grid

## 🔐 Autenticación

El sistema usa AuthContext para manejar la autenticación:

```javascript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

## 🛣️ Rutas

### Públicas
- `/login` - Página de inicio de sesión

### Protegidas por Rol

**Administrador** (`/admin/*`)
- `/admin` - Home con estadísticas
- `/admin/usuarios` - Gestión de usuarios
- `/admin/tutores` - Gestión de tutores
- `/admin/inventario` - Gestión de inventario

**Veterinario** (`/veterinario/*`)
- `/veterinario` - Home con próximas citas
- `/veterinario/citas` - Gestión de citas
- `/veterinario/historiales` - Historiales médicos

**Tutor** (`/tutor/*`)
- `/tutor` - Home con resumen
- `/tutor/mascotas` - Mis mascotas
- `/tutor/citas` - Mis citas

## 📡 Servicios API

El archivo `services/api.js` exporta:

```javascript
import {
  usuariosAPI,
  tutoresAPI,
  mascotasAPI,
  citasAPI,
  historialesAPI,
  inventarioAPI,
  dashboardAPI
} from './services/api';
```

Cada servicio incluye métodos CRUD completos.

## 👥 Usuarios de Prueba

En la página de login se muestran los usuarios de prueba:

- **Admin**: admin@veterinaria.com / admin123
- **Veterinario**: vet1@veterinaria.com / vet123
- **Tutor**: tutor1@gmail.com / tutor123

## 🎯 Componentes Principales

### AdminHome
Dashboard con 5 tarjetas estadísticas y acciones rápidas.

### GestionUsuarios
CRUD completo de usuarios con modal para crear/editar.

### GestionCitas
Lista de citas con opciones para cambiar estado.

### MisMascotas
Vista de mascotas del tutor con historial médico completo.

## 📱 Responsive

La aplicación es completamente responsive:
- Desktop: Layout con sidebar
- Tablet/Mobile: Layout adaptativo

## 🔧 Configuración

Para cambiar la URL del backend, editar en `services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  // ...
});
```

## 🚀 Build de Producción

```bash
npm run build
```

Genera la carpeta `build/` lista para deployment.
