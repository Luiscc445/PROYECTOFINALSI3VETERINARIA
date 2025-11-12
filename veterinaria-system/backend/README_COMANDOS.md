# 📚 Comandos de Gestión de Base de Datos

Este proyecto incluye comandos personalizados de Django para gestionar la base de datos.

## 🔧 Comandos Disponibles

### 1. `reset_users` - Resetear Usuarios

Elimina TODOS los datos del sistema y crea solo 3 usuarios básicos (admin, veterinario, tutor).

**Uso:**
```bash
python manage.py reset_users
```

**¿Qué hace?**
- ✅ Elimina: Movimientos, Inventario, Historiales, Citas, Mascotas, Tutores, Usuarios
- ✅ Crea: 3 usuarios con contraseñas hasheadas
  - `admin@vet.com / admin123`
  - `vet@vet.com / vet123`
  - `tutor@vet.com / tutor123`

**⚠️ Advertencia:** Este comando elimina TODOS los datos. Úsalo solo en desarrollo.

---

### 2. `rebuild_database` - Reconstruir Base de Datos Completa

Reconstruye toda la base de datos con datos de prueba completos y realistas.

**Uso:**
```bash
python manage.py rebuild_database
```

**¿Qué hace?**
- ✅ Elimina todos los datos antiguos
- ✅ Crea 6 usuarios (1 admin, 2 vets, 3 tutores)
- ✅ Crea 3 tutores con datos completos
- ✅ Crea 5 mascotas de diferentes especies
- ✅ Crea 4 productos en inventario
- ✅ Registra movimientos de inventario
- ✅ Crea 4 citas próximas
- ✅ Genera 3 historiales médicos

**Datos creados:**
```
📊 RESUMEN:
  • 6 Usuarios (admin + 2 veterinarios + 3 tutores)
  • 3 Tutores
  • 5 Mascotas (perros y gatos)
  • 4 Citas
  • 3 Historiales médicos
  • 4 Productos de inventario
  • 4 Movimientos de inventario
```

**Credenciales:**
- **Admin**: `admin@vet.com / admin123`
- **Veterinario**: `vet@vet.com / vet123`
- **Tutor**: `tutor@vet.com / tutor123`

---

## 🚀 Flujo de Trabajo Recomendado

### Para desarrollo limpio (solo usuarios):
```bash
python manage.py reset_users
```

### Para pruebas con datos completos:
```bash
python manage.py rebuild_database
```

---

## 💡 Ejemplos de Uso

### Iniciar desde cero:
```bash
# 1. Activar entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 2. Reconstruir BD con datos
python manage.py rebuild_database

# 3. Iniciar servidor
python manage.py runserver
```

### Resetear solo usuarios:
```bash
python manage.py reset_users
```

---

## 🔒 Seguridad

- ✅ Todas las contraseñas están hasheadas con **PBKDF2-SHA256**
- ✅ El login valida con `check_password()` de Django
- ✅ Los 3 roles funcionan correctamente con autenticación real

---

## ⚠️ Notas Importantes

1. **Estos comandos son solo para desarrollo**
2. **Eliminan TODOS los datos existentes**
3. **No usar en producción**
4. **Asegúrate de tener un backup si tienes datos importantes**

---

## 📞 Soporte

Si tienes problemas con los comandos:
1. Verifica que el entorno virtual esté activado
2. Verifica que las migraciones estén aplicadas: `python manage.py migrate`
3. Verifica que la BD esté corriendo (PostgreSQL)
