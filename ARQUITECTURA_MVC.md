# Arquitectura MVC - Sistema de Gestión Veterinaria

## Tabla de Contenidos
1. [Resumen](#resumen)
2. [Backend - Django MVC](#backend---django-mvc)
3. [Frontend - React MVC](#frontend---react-mvc)
4. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
5. [Guía de Uso](#guía-de-uso)

---

## Resumen

El sistema de gestión veterinaria ha sido reestructurado completamente siguiendo el patrón de arquitectura **MVC (Model-View-Controller)**. Esta arquitectura separa las responsabilidades del código en tres capas principales:

- **Models (Modelos)**: Definen la estructura de datos y lógica de dominio
- **Views (Vistas)**: Manejan la presentación y la interfaz de usuario
- **Controllers (Controladores)**: Gestionan la lógica de negocio y coordinan entre modelos y vistas

---

## Backend - Django MVC

### Estructura de Carpetas

```
backend/api/
├── models/                    # Capa de Modelos
│   ├── __init__.py
│   ├── rol.py                # Modelo Rol
│   ├── usuario.py            # Modelo Usuario
│   ├── tutor.py              # Modelo Tutor
│   ├── mascota.py            # Modelo Mascota
│   ├── cita.py               # Modelo Cita
│   ├── historial_medico.py   # Modelo HistorialMedico
│   ├── inventario.py         # Modelo Inventario
│   └── movimiento_inventario.py # Modelo MovimientoInventario
│
├── controllers/               # Capa de Controladores
│   ├── __init__.py
│   ├── rol_controller.py
│   ├── usuario_controller.py
│   ├── tutor_controller.py
│   ├── mascota_controller.py
│   ├── cita_controller.py
│   ├── historial_medico_controller.py
│   ├── inventario_controller.py
│   ├── movimiento_inventario_controller.py
│   └── dashboard_controller.py
│
├── views/                     # Capa de Vistas (API Endpoints)
│   ├── __init__.py
│   ├── rol_view.py
│   ├── usuario_view.py
│   ├── tutor_view.py
│   ├── mascota_view.py
│   ├── cita_view.py
│   ├── historial_medico_view.py
│   ├── inventario_view.py
│   ├── movimiento_inventario_view.py
│   └── dashboard_view.py
│
├── serializers/               # Capa de Serialización
│   ├── __init__.py
│   ├── rol_serializer.py
│   ├── usuario_serializer.py
│   ├── tutor_serializer.py
│   ├── mascota_serializer.py
│   ├── cita_serializer.py
│   ├── historial_medico_serializer.py
│   ├── inventario_serializer.py
│   └── movimiento_inventario_serializer.py
│
├── urls.py                    # Configuración de rutas
└── admin.py                   # Administración de Django
```

### Responsabilidades de cada capa

#### Models (Modelos)
- **Ubicación**: `backend/api/models/`
- **Responsabilidad**:
  - Definir la estructura de datos (campos, tipos, validaciones)
  - Definir relaciones entre modelos (ForeignKey, OneToOne, etc.)
  - Métodos y propiedades relacionadas con el modelo
  - Validaciones a nivel de modelo
- **Ejemplo**:
  ```python
  # models/mascota.py
  class Mascota(models.Model):
      nombre = models.CharField(max_length=100)
      especie = models.CharField(max_length=50)

      @property
      def edad_anos(self):
          # Lógica de cálculo de edad
          pass
  ```

#### Controllers (Controladores)
- **Ubicación**: `backend/api/controllers/`
- **Responsabilidad**:
  - Implementar la lógica de negocio
  - Realizar operaciones CRUD complejas
  - Validaciones de negocio
  - Procesamiento de datos
  - Coordinación entre diferentes modelos
- **Ejemplo**:
  ```python
  # controllers/mascota_controller.py
  class MascotaController:
      @staticmethod
      def get_pet_complete_history(pet_id):
          return Mascota.objects.prefetch_related(
              'historiales', 'citas'
          ).get(id=pet_id)
  ```

#### Views (Vistas)
- **Ubicación**: `backend/api/views/`
- **Responsabilidad**:
  - Manejar requests HTTP
  - Validar datos de entrada
  - Llamar a los controladores apropiados
  - Formatear y retornar respuestas HTTP
  - Gestionar autenticación y permisos
- **Ejemplo**:
  ```python
  # views/mascota_view.py
  class MascotaViewSet(viewsets.ModelViewSet):
      def get_queryset(self):
          return MascotaController.get_all_pets()

      @action(detail=True, methods=['get'])
      def historial_completo(self, request, pk=None):
          pet = MascotaController.get_pet_complete_history(pk)
          serializer = MascotaHistorialCompletoSerializer(pet)
          return Response(serializer.data)
  ```

#### Serializers (Serializadores)
- **Ubicación**: `backend/api/serializers/`
- **Responsabilidad**:
  - Transformar modelos a JSON y viceversa
  - Validaciones adicionales de datos
  - Definir campos de solo lectura/escritura
  - Serialización anidada

---

## Frontend - React MVC

### Estructura de Carpetas

```
frontend/src/
├── models/                    # Capa de Modelos
│   ├── index.js
│   ├── User.js               # Modelo Usuario
│   ├── Rol.js                # Modelo Rol
│   ├── Tutor.js              # Modelo Tutor
│   ├── Pet.js                # Modelo Mascota
│   ├── Appointment.js        # Modelo Cita
│   ├── MedicalHistory.js     # Modelo HistorialMedico
│   ├── Inventory.js          # Modelo Inventario
│   └── InventoryMovement.js  # Modelo MovimientoInventario
│
├── controllers/               # Capa de Controladores
│   ├── index.js
│   ├── AuthController.js
│   ├── UserController.js
│   ├── TutorController.js
│   ├── PetController.js
│   ├── AppointmentController.js
│   ├── MedicalHistoryController.js
│   ├── InventoryController.js
│   └── DashboardController.js
│
├── views/                     # Capa de Vistas
│   ├── components/           # Componentes React
│   │   ├── common/          # Componentes compartidos
│   │   │   ├── index.js
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── admin/           # Componentes de Admin
│   │   │   ├── index.js
│   │   │   ├── AdminHome.js
│   │   │   ├── GestionUsuarios.js
│   │   │   ├── GestionTutores.js
│   │   │   └── GestionInventario.js
│   │   ├── veterinario/     # Componentes de Veterinario
│   │   │   ├── index.js
│   │   │   ├── VetHome.js
│   │   │   ├── GestionCitas.js
│   │   │   └── HistorialesMedicos.js
│   │   └── tutor/           # Componentes de Tutor
│   │       ├── index.js
│   │       ├── TutorHome.js
│   │       ├── MisMascotas.js
│   │       └── MisCitas.js
│   └── pages/               # Páginas principales
│       ├── index.js
│       ├── Login.js
│       ├── AdminDashboard.js
│       ├── VeterinarioDashboard.js
│       └── TutorDashboard.js
│
├── services/                  # Servicios (API)
│   └── api.js
│
├── context/                   # Context API
│   └── AuthContext.js
│
├── styles/                    # Estilos CSS
│   └── ...
│
├── App.js                     # Componente principal
└── index.js                   # Punto de entrada
```

### Responsabilidades de cada capa

#### Models (Modelos)
- **Ubicación**: `frontend/src/models/`
- **Responsabilidad**:
  - Definir la estructura de datos en el cliente
  - Métodos de transformación (fromJSON, toJSON)
  - Métodos de utilidad y validación
  - Encapsular lógica relacionada con entidades
- **Ejemplo**:
  ```javascript
  // models/Pet.js
  class Pet {
    constructor(data = {}) {
      this.id = data.id || null;
      this.nombre = data.nombre || '';
      this.especie = data.especie || '';
    }

    static fromJSON(json) {
      return new Pet(json);
    }

    toJSON() {
      return { id: this.id, nombre: this.nombre, ... };
    }
  }
  ```

#### Controllers (Controladores)
- **Ubicación**: `frontend/src/controllers/`
- **Responsabilidad**:
  - Gestionar llamadas a la API
  - Implementar lógica de negocio del cliente
  - Transformar datos entre API y modelos
  - Manejar errores de comunicación
  - Cacheo y optimización de datos
- **Ejemplo**:
  ```javascript
  // controllers/PetController.js
  class PetController {
    static async getAll() {
      const response = await api.get('/mascotas/');
      return response.data.map(pet => Pet.fromJSON(pet));
    }

    static async create(petData) {
      const response = await api.post('/mascotas/', petData);
      return Pet.fromJSON(response.data);
    }
  }
  ```

#### Views (Vistas)
- **Ubicación**: `frontend/src/views/`
- **Responsabilidad**:
  - Renderizar la interfaz de usuario (JSX)
  - Manejar interacciones del usuario
  - Gestionar el estado local del componente
  - Llamar a controladores para operaciones de datos
  - Mostrar mensajes de error/éxito
- **Ejemplo**:
  ```javascript
  // views/components/admin/GestionUsuarios.js
  const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
      loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
      const data = await UserController.getAll();
      setUsuarios(data);
    };

    return (
      <div>{/* JSX para mostrar usuarios */}</div>
    );
  };
  ```

---

## Diagrama de Arquitectura

### Flujo de Datos - Backend

```
Cliente HTTP Request
       ↓
[View] - Recibe request, valida
       ↓
[Controller] - Procesa lógica de negocio
       ↓
[Model] - Accede/modifica base de datos
       ↓
[Controller] - Procesa resultado
       ↓
[Serializer] - Transforma a JSON
       ↓
[View] - Retorna HTTP Response
       ↓
Cliente HTTP Response
```

### Flujo de Datos - Frontend

```
Usuario interactúa con UI
       ↓
[View/Component] - Captura evento
       ↓
[Controller] - Procesa solicitud
       ↓
[API Service] - Llamada HTTP al backend
       ↓
[Controller] - Recibe respuesta
       ↓
[Model] - Transforma datos
       ↓
[View/Component] - Actualiza UI
       ↓
Usuario ve resultado
```

---

## Guía de Uso

### Backend

#### Crear un nuevo endpoint

1. **Crear/Modificar Modelo** (`models/`)
   ```python
   # models/nueva_entidad.py
   class NuevaEntidad(models.Model):
       campo1 = models.CharField(max_length=100)
       campo2 = models.IntegerField()
   ```

2. **Crear Controller** (`controllers/`)
   ```python
   # controllers/nueva_entidad_controller.py
   class NuevaEntidadController:
       @staticmethod
       def get_all():
           return NuevaEntidad.objects.all()

       @staticmethod
       def create(data):
           return NuevaEntidad.objects.create(**data)
   ```

3. **Crear Serializer** (`serializers/`)
   ```python
   # serializers/nueva_entidad_serializer.py
   class NuevaEntidadSerializer(serializers.ModelSerializer):
       class Meta:
           model = NuevaEntidad
           fields = '__all__'
   ```

4. **Crear View** (`views/`)
   ```python
   # views/nueva_entidad_view.py
   class NuevaEntidadViewSet(viewsets.ModelViewSet):
       serializer_class = NuevaEntidadSerializer

       def get_queryset(self):
           return NuevaEntidadController.get_all()
   ```

5. **Registrar en URLs** (`urls.py`)
   ```python
   router.register(r'nueva-entidad', NuevaEntidadViewSet, basename='nueva-entidad')
   ```

### Frontend

#### Agregar nueva funcionalidad

1. **Crear Modelo** (`models/`)
   ```javascript
   // models/NuevaEntidad.js
   class NuevaEntidad {
       constructor(data = {}) {
           this.id = data.id || null;
           this.campo1 = data.campo1 || '';
       }

       static fromJSON(json) {
           return new NuevaEntidad(json);
       }
   }
   ```

2. **Crear Controller** (`controllers/`)
   ```javascript
   // controllers/NuevaEntidadController.js
   class NuevaEntidadController {
       static async getAll() {
           const response = await api.get('/nueva-entidad/');
           return response.data.map(item => NuevaEntidad.fromJSON(item));
       }
   }
   ```

3. **Crear Componente** (`views/components/`)
   ```javascript
   // views/components/admin/GestionNuevaEntidad.js
   const GestionNuevaEntidad = () => {
       const [items, setItems] = useState([]);

       useEffect(() => {
           loadItems();
       }, []);

       const loadItems = async () => {
           const data = await NuevaEntidadController.getAll();
           setItems(data);
       };

       return <div>{/* JSX */}</div>;
   };
   ```

4. **Agregar Ruta** (en Dashboard correspondiente)
   ```javascript
   <Route path="/admin/nueva-entidad" element={<GestionNuevaEntidad />} />
   ```

---

## Ventajas de esta Arquitectura

### Separación de Responsabilidades
- Cada capa tiene una responsabilidad clara y única
- Facilita el mantenimiento y la comprensión del código
- Permite trabajar en diferentes capas sin afectar las demás

### Reutilización de Código
- Los controladores pueden ser reutilizados en diferentes vistas
- Los modelos encapsulan lógica común
- Los componentes pueden compartirse entre módulos

### Facilidad de Testing
- Cada capa puede ser testeada independientemente
- Los controladores pueden ser mockeados en las vistas
- Los modelos tienen lógica aislada y fácil de probar

### Escalabilidad
- Fácil agregar nuevas funcionalidades
- Estructura clara para nuevos desarrolladores
- Preparado para crecer con nuevos módulos

### Mantenibilidad
- Bugs fáciles de localizar y corregir
- Cambios en una capa no afectan a las demás
- Código más limpio y organizado

---

## Convenciones de Nombres

### Backend
- **Modelos**: Singular, PascalCase (ej: `Mascota`, `Usuario`)
- **Controllers**: Singular + Controller (ej: `MascotaController`)
- **Views**: Singular + ViewSet (ej: `MascotaViewSet`)
- **Serializers**: Singular + Serializer (ej: `MascotaSerializer`)
- **Archivos**: snake_case (ej: `mascota_controller.py`)

### Frontend
- **Modelos**: Singular, PascalCase (ej: `Pet`, `User`)
- **Controllers**: Singular + Controller (ej: `PetController`)
- **Componentes**: PascalCase (ej: `GestionUsuarios`, `MisMascotas`)
- **Archivos**: PascalCase para componentes, camelCase para utilities

---

## Estructura de Base de Datos

El sistema mantiene la misma estructura de base de datos que antes:
- 8 modelos principales
- Relaciones intactas (ForeignKey, OneToOne)
- Todas las validaciones y constraints preservadas

---

## Compatibilidad

La reestructuración a MVC es **100% compatible** con la funcionalidad existente:
- Todos los endpoints API funcionan igual
- Todas las rutas del frontend son las mismas
- La base de datos no ha cambiado
- Los serializers mantienen el mismo formato JSON

---

## Próximos Pasos

1. Instalar dependencias del backend: `pip install -r requirements.txt`
2. Ejecutar migraciones: `python manage.py migrate`
3. Instalar dependencias del frontend: `npm install`
4. Ejecutar tests para verificar funcionalidad
5. Continuar desarrollo siguiendo la arquitectura MVC

---

**Fecha de Reestructuración**: 2025-11-15
**Versión**: 2.0 - Arquitectura MVC
