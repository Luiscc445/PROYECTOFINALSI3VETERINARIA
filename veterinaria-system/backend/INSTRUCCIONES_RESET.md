# 🔐 Instrucciones para Resetear Usuarios

Este sistema ahora usa **contraseñas hasheadas con Django** para mayor seguridad.

## 📋 Cómo resetear los usuarios

### Paso 1: Activar el entorno virtual (si lo tienes)

```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### Paso 2: Ejecutar el comando de reset

```bash
python manage.py reset_users
```

Este comando hará lo siguiente:

1. ✅ Eliminará todos los tutores existentes
2. ✅ Eliminará todos los usuarios existentes
3. ✅ Creará 3 usuarios nuevos con contraseñas hasheadas:
   - **Administrador**: `admin@vet.com` / `admin123`
   - **Veterinario**: `vet@vet.com` / `vet123`
   - **Tutor**: `tutor@vet.com` / `tutor123`
4. ✅ Creará el registro de tutor para el usuario tutor

## ✨ Resultado esperado

```
=== Reseteando usuarios ===

✓ Eliminados 1 tutores
✓ Eliminados 3 usuarios
✓ Creado usuario: admin@vet.com (administrador)
✓ Creado usuario: vet@vet.com (veterinario)
✓ Creado usuario: tutor@vet.com (tutor)
✓ Creado tutor para: tutor@vet.com

==================================================
✓ RESET COMPLETADO

Usuarios creados:
1. Administrador: admin@vet.com / admin123
2. Veterinario:   vet@vet.com / vet123
3. Tutor:         tutor@vet.com / tutor123
==================================================
```

## 🔒 Seguridad

Las contraseñas ahora están hasheadas usando `make_password()` de Django, que utiliza el algoritmo PBKDF2 con SHA256.

El LoginView usa `check_password()` para validar las contraseñas correctamente.

## ⚠️ Nota Importante

Este comando eliminará TODOS los usuarios y tutores existentes. Úsalo solo en desarrollo.
