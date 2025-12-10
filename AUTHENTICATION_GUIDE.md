# 🔐 Guía de Autenticación - Defiéndete MX

## 📋 Descripción General

Sistema de autenticación seguro implementado con JWT (JSON Web Tokens), validación de contraseñas, manejo de sesiones y protección de rutas.

---

## 🏗️ Arquitectura

### Componentes Principales

1. **Backend (API Routes)**
   - `/api/auth/register` - Registro de usuarios
   - `/api/auth/login` - Inicio de sesión
   - `/api/auth/logout` - Cierre de sesión
   - `/api/auth/refresh` - Renovación de tokens
   - `/api/auth/me` - Obtener/actualizar perfil
   - `/api/auth/change-password` - Cambio de contraseña

2. **Frontend (React Components)**
   - `AuthContext` - Contexto de autenticación
   - `useAuth` - Hook personalizado
   - `LoginForm` - Formulario de inicio de sesión
   - `RegisterForm` - Formulario de registro
   - `ProtectedRoute` - Componente de protección de rutas

3. **Utilidades**
   - `jwt.js` - Generación y verificación de tokens
   - `passwordValidator.js` - Validación de contraseñas
   - `sessionManager.js` - Manejo de cookies y sesiones
   - `authMiddleware.js` - Middleware de autenticación

---

## 🔒 Características de Seguridad

### 1. Tokens JWT

**Access Token:**
- Duración: 15 minutos
- Almacenado en: Cookie HTTP-only
- Uso: Autenticación de solicitudes API

**Refresh Token:**
- Duración: 7 días
- Almacenado en: Cookie HTTP-only
- Uso: Renovación de access tokens
- Límite: 5 tokens activos por usuario

### 2. Validación de Contraseñas

**Requisitos:**
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial
- No puede ser una contraseña común
- No puede contener secuencias obvias

**Indicador de Fortaleza:**
- Muy Débil (0-3 puntos)
- Débil (4-5 puntos)
- Media (6-7 puntos)
- Fuerte (8-9 puntos)
- Muy Fuerte (10+ puntos)

### 3. Protección de Cuenta

**Bloqueo por Intentos Fallidos:**
- Máximo: 5 intentos fallidos
- Duración del bloqueo: 2 horas
- Reinicio automático tras login exitoso

**Cookies Seguras:**
- `httpOnly: true` - No accesible desde JavaScript
- `secure: true` - Solo HTTPS en producción
- `sameSite: 'lax'` - Protección CSRF

---

## 📝 Uso de la API

### Registro de Usuario

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "MiContraseña123!",
  "fullName": "Juan Pérez",
  "phone": "5512345678" // opcional
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "role": "USER",
    "isVerified": false,
    "isPremium": false
  }
}
```

### Inicio de Sesión

```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "MiContraseña123!"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "role": "USER",
    "isVerified": false,
    "isPremium": false,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Obtener Usuario Actual

```javascript
GET /api/auth/me
Cookie: access_token=...
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "phone": "5512345678",
    "role": "USER",
    "isVerified": false,
    "isPremium": false,
    "privacySettings": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Renovar Token

```javascript
POST /api/auth/refresh
Cookie: refresh_token=...
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Token renovado exitosamente"
}
```

### Cerrar Sesión

```javascript
POST /api/auth/logout
Cookie: access_token=...; refresh_token=...
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### Cambiar Contraseña

```javascript
PUT /api/auth/change-password
Content-Type: application/json
Cookie: access_token=...

{
  "currentPassword": "MiContraseña123!",
  "newPassword": "NuevaContraseña456!"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

---

## 🎨 Uso en Frontend

### 1. Usar el Hook de Autenticación

```javascript
'use client';

import { useAuth } from '../hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>No autenticado</p>;
  }

  return (
    <div>
      <p>Bienvenido, {user.fullName}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### 2. Proteger Rutas

```javascript
'use client';

import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Contenido Protegido</h1>
        <p>Solo usuarios autenticados pueden ver esto</p>
      </div>
    </ProtectedRoute>
  );
}
```

### 3. Proteger por Rol

```javascript
<ProtectedRoute requireRole="ADMIN">
  <AdminPanel />
</ProtectedRoute>

// O múltiples roles
<ProtectedRoute requireRole={['ADMIN', 'MODERATOR']}>
  <ModeratorPanel />
</ProtectedRoute>
```

### 4. Requerir Email Verificado

```javascript
<ProtectedRoute requireVerified={true}>
  <PremiumContent />
</ProtectedRoute>
```

---

## 🛡️ Middleware de Autenticación

### Proteger API Routes

```javascript
import { requireAuth } from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  // req.user está disponible aquí
  const userId = req.userId;
  
  return res.json({
    success: true,
    user: req.user
  });
}

export default requireAuth(handler);
```

### Requerir Rol Específico

```javascript
import { requireRole } from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  // Solo usuarios ADMIN pueden acceder
  return res.json({
    success: true,
    message: 'Admin access granted'
  });
}

export default requireRole('ADMIN')(handler);
```

### Autenticación Opcional

```javascript
import { optionalAuth } from '../../../lib/middleware/authMiddleware';

async function handler(req, res) {
  // req.user puede ser null si no está autenticado
  const isAuth = !!req.user;
  
  return res.json({
    success: true,
    isAuthenticated: isAuth
  });
}

export default optionalAuth(handler);
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm test -- --coverage
```

### Tests Incluidos

1. **JWT Utilities**
   - Generación de tokens
   - Verificación de tokens
   - Expiración de tokens

2. **Password Validator**
   - Validación de contraseñas
   - Cálculo de fortaleza
   - Validación de email
   - Validación de nombre
   - Validación de teléfono

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/defiendete-mx

# JWT Secrets (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# JWT Expiration
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### Generar Secretos Seguros

```bash
# Generar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

- `200` - Éxito
- `201` - Creado (registro exitoso)
- `400` - Solicitud inválida (validación fallida)
- `401` - No autenticado (token inválido/expirado)
- `403` - Prohibido (sin permisos, cuenta bloqueada)
- `404` - No encontrado
- `409` - Conflicto (email ya registrado)
- `500` - Error del servidor

### Mensajes de Error Comunes

```javascript
// Token expirado
{
  "success": false,
  "error": "Access token expired"
}

// Credenciales inválidas
{
  "success": false,
  "error": "Credenciales inválidas",
  "attemptsLeft": 3
}

// Cuenta bloqueada
{
  "success": false,
  "error": "Cuenta bloqueada temporalmente. Intenta de nuevo en 120 minutos"
}

// Contraseña débil
{
  "success": false,
  "error": "Contraseña no cumple con los requisitos de seguridad",
  "errors": [
    "La contraseña debe tener al menos 8 caracteres",
    "La contraseña debe contener al menos una letra mayúscula"
  ]
}
```

---

## 📊 Flujo de Autenticación

```
1. Usuario se registra/inicia sesión
   ↓
2. Backend valida credenciales
   ↓
3. Backend genera access token (15min) y refresh token (7 días)
   ↓
4. Tokens se almacenan en cookies HTTP-only
   ↓
5. Frontend hace solicitudes con cookies automáticamente
   ↓
6. Cuando access token expira:
   - Frontend detecta error 401
   - Llama a /api/auth/refresh
   - Backend verifica refresh token
   - Genera nuevo access token
   - Reintenta solicitud original
   ↓
7. Cuando refresh token expira:
   - Usuario debe iniciar sesión nuevamente
```

---

## 🔐 Mejores Prácticas

### Seguridad

1. **Nunca** almacenar tokens en localStorage
2. **Siempre** usar HTTPS en producción
3. **Cambiar** los secretos JWT en producción
4. **Rotar** refresh tokens periódicamente
5. **Implementar** rate limiting en endpoints de auth
6. **Validar** todos los inputs del usuario
7. **Sanitizar** datos antes de guardar en DB

### Performance

1. **Cachear** datos del usuario en frontend
2. **Minimizar** llamadas a `/api/auth/me`
3. **Usar** refresh tokens para renovación automática
4. **Implementar** lazy loading para rutas protegidas

### UX

1. **Mostrar** indicador de fortaleza de contraseña
2. **Informar** intentos restantes antes de bloqueo
3. **Redirigir** automáticamente tras login exitoso
4. **Mantener** sesión activa con refresh tokens
5. **Mostrar** mensajes de error claros

---

## 🐛 Troubleshooting

### Token no se envía en solicitudes

**Problema:** Las cookies no se envían automáticamente.

**Solución:** Asegúrate de usar `credentials: 'include'` en fetch:

```javascript
fetch('/api/auth/me', {
  credentials: 'include'
})
```

### Error "Invalid token type"

**Problema:** Se está usando el token incorrecto.

**Solución:** Verifica que estés usando access token para solicitudes API y refresh token solo para renovación.

### Cuenta bloqueada permanentemente

**Problema:** El usuario excedió intentos fallidos.

**Solución:** Espera 2 horas o resetea manualmente en la base de datos:

```javascript
db.users.updateOne(
  { email: "usuario@example.com" },
  { $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } }
)
```

---

## 📚 Recursos Adicionales

- [JWT.io](https://jwt.io/) - Debugger de JWT
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 🤝 Contribuir

Si encuentras un problema de seguridad, por favor repórtalo de manera responsable a través de un issue privado.

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0
