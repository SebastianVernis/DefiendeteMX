# 🚀 Guía de Deployment - Defiéndete MX 2025

## 📋 Tabla de Contenidos
1. [Preparación del Entorno](#preparación-del-entorno)
2. [Configuración de Base de Datos](#configuración-de-base-de-datos)
3. [Deployment en Vercel](#deployment-en-vercel)
4. [Deployment en Cloudflare Pages](#deployment-en-cloudflare-pages)
5. [Deployment en AWS/Azure](#deployment-en-awsazure)
6. [Configuración de Servicios Externos](#configuración-de-servicios-externos)
7. [Verificación Post-Deployment](#verificación-post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🛠️ Preparación del Entorno

### 1. Fix de Runtime Issues

Antes de hacer deployment, necesitas resolver el conflicto de runtime. Elige una opción:

#### Opción A: Node.js Runtime (Recomendado para inicio)

**Paso 1:** Agregar runtime config a todas las rutas API

Crea el archivo `app/api/runtime.config.js`:
```javascript
// Force Node.js runtime for all API routes
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

**Paso 2:** Importar en cada ruta API

Agrega al inicio de cada archivo en `app/api/*/route.js`:
```javascript
export const runtime = 'nodejs';
```

**Paso 3:** Instalar dependencia faltante
```bash
npm install bcrypt --save
# O si prefieres la versión pura JS:
# npm install bcryptjs --save
```

#### Opción B: Edge Runtime (Cloudflare)

**Paso 1:** Instalar dependencias de Cloudflare
```bash
npm install @cloudflare/next-on-pages --save-dev
npm install bcryptjs --save  # Reemplazar bcrypt
```

**Paso 2:** Cambiar imports de bcrypt a bcryptjs
```bash
# En todos los archivos:
# Cambiar: import bcrypt from 'bcrypt';
# Por:     import bcrypt from 'bcryptjs';
```

**Paso 3:** Actualizar crypto imports
```javascript
// En lugar de: import crypto from 'crypto';
// Usar: const crypto = globalThis.crypto;
```

---

## 🗄️ Configuración de Base de Datos

### MongoDB Atlas (Recomendado)

**Paso 1:** Crear cluster gratuito en MongoDB Atlas
```
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Create New Cluster (M0 Free Tier)
4. Selecciona región más cercana
5. Espera 3-5 minutos
```

**Paso 2:** Configurar acceso
```
1. Database Access → Add New Database User
   - Username: defiendete_admin
   - Password: [genera una segura]
   - Role: Atlas Admin

2. Network Access → Add IP Address
   - Para desarrollo: 0.0.0.0/0 (cualquier IP)
   - Para producción: IP específica de tu servidor
```

**Paso 3:** Obtener connection string
```
1. Clusters → Connect → Connect your application
2. Driver: Node.js, Version: 4.1 or later
3. Copia la connection string:

mongodb+srv://defiendete_admin:<password>@cluster0.xxxxx.mongodb.net/defiendete-mx?retryWrites=true&w=majority
```

**Paso 4:** Crear base de datos y colecciones
```javascript
// Conecta con MongoDB Compass o Mongosh
use defiendete-mx

// Crear colecciones (se crean automáticamente al insertar)
db.createCollection('users')
db.createCollection('issues')
db.createCollection('chats')
db.createCollection('notifications')
db.createCollection('voicerecordings')
db.createCollection('governmentreports')

// Crear índices
db.users.createIndex({ email: 1 }, { unique: true })
db.issues.createIndex({ user: 1, createdAt: -1 })
db.issues.createIndex({ status: 1, priority: -1 })
```

### Cloudflare D1 (Alternativa)

**Paso 1:** Crear database D1
```bash
npx wrangler login
npx wrangler d1 create defiendete-mx-prod
```

**Paso 2:** Ejecutar migraciones
```bash
# Crea el schema SQL desde migrations/
npx wrangler d1 execute defiendete-mx-prod --file=./migrations/schema.sql
```

**Paso 3:** Actualizar wrangler.toml
```toml
[[d1_databases]]
binding = "DB"
database_name = "defiendete-mx-prod"
database_id = "xxxxx-xxxxx-xxxxx"
```

---

## ☁️ Deployment en Vercel

### Configuración

**Paso 1:** Instalar Vercel CLI
```bash
npm install -g vercel
```

**Paso 2:** Login
```bash
vercel login
```

**Paso 3:** Configurar proyecto
```bash
# En el directorio del proyecto
vercel

# Responde las preguntas:
# Set up and deploy? Y
# Which scope? [tu cuenta]
# Link to existing project? N
# Project name? defiendete-mx
# Directory? ./
# Override settings? N
```

**Paso 4:** Configurar variables de entorno
```bash
# Via CLI
vercel env add MONGODB_URI production
# Pega tu connection string de MongoDB Atlas

vercel env add JWT_SECRET production
# Genera un secreto fuerte: openssl rand -base64 32

vercel env add JWT_REFRESH_SECRET production
# Genera otro secreto diferente

vercel env add TWILIO_ACCOUNT_SID production
vercel env add TWILIO_AUTH_TOKEN production
vercel env add TWILIO_PHONE_NUMBER production
```

O via Dashboard de Vercel:
```
1. Settings → Environment Variables
2. Agregar todas las variables necesarias
3. Seleccionar: Production, Preview, Development
```

**Paso 5:** Deploy a producción
```bash
vercel --prod
```

**Paso 6:** Verificar deployment
```
✅ Project deployed to: https://defiendete-mx.vercel.app
```

### Variables de Entorno Requeridas

```bash
# Base de datos
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/defiendete-mx

# JWT
JWT_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres
JWT_REFRESH_SECRET=otro-secreto-diferente-tambien-largo
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API
NEXT_PUBLIC_API_URL=https://defiendete-mx.vercel.app/api

# Twilio (para SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_PHONE_NUMBER=+1234567890

# Entorno
NODE_ENV=production
```

---

## 🌐 Deployment en Cloudflare Pages

### Configuración

**Paso 1:** Instalar dependencias
```bash
npm install @cloudflare/next-on-pages --save-dev
npm install wrangler --save-dev
```

**Paso 2:** Build para Cloudflare
```bash
npx @cloudflare/next-on-pages@1
```

**Paso 3:** Configurar wrangler.toml
```toml
name = "defiendete-mx"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "defiendete-mx-prod"
database_id = "xxxxx"

[vars]
JWT_EXPIRES_IN = "15m"
JWT_REFRESH_EXPIRES_IN = "7d"
NEXT_PUBLIC_API_URL = "https://defiendete-mx.pages.dev/api"
NODE_ENV = "production"
```

**Paso 4:** Configurar secrets
```bash
echo "tu-secreto-jwt" | wrangler secret put JWT_SECRET
echo "tu-secreto-refresh" | wrangler secret put JWT_REFRESH_SECRET
echo "tu-twilio-sid" | wrangler secret put TWILIO_ACCOUNT_SID
echo "tu-twilio-token" | wrangler secret put TWILIO_AUTH_TOKEN
echo "+1234567890" | wrangler secret put TWILIO_PHONE_NUMBER
```

**Paso 5:** Deploy
```bash
wrangler pages publish .vercel/output/static
```

O via Git:
```bash
# Conecta tu repo a Cloudflare Pages Dashboard
# Build command: npx @cloudflare/next-on-pages@1
# Build output directory: .vercel/output/static
```

---

## 🐳 Deployment en AWS/Azure

### Docker Deployment

**Paso 1:** Crear Dockerfile
```dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Paso 2:** Crear docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
    env_file:
      - .env.production
    restart: unless-stopped

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=defiendete-mx
    restart: unless-stopped

volumes:
  mongodb_data:
```

**Paso 3:** Build y deploy
```bash
docker-compose up -d --build
```

---

## 🔌 Configuración de Servicios Externos

### Twilio (SMS)

**Paso 1:** Crear cuenta Twilio
```
1. Ve a https://www.twilio.com/try-twilio
2. Sign up (incluye $15 gratis)
3. Verifica tu número de teléfono
```

**Paso 2:** Obtener credenciales
```
1. Dashboard → Account Info
   - Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - Auth Token: [tu token]

2. Get a Twilio number
   - Phone Numbers → Buy a Number
   - Busca número con SMS capability
   - Comprar (o usar trial)
```

**Paso 3:** Configurar webhook (opcional)
```
Phone Numbers → Active Numbers → [tu número]
→ Messaging → Configure with: Webhooks/TwiML
→ A Message Comes In: https://tu-dominio.com/api/webhooks/twilio-status
→ HTTP POST
→ Save
```

### Cloudinary (Almacenamiento de archivos - opcional)

```
1. Crear cuenta en https://cloudinary.com
2. Dashboard → Settings
3. Obtener:
   - Cloud Name
   - API Key
   - API Secret

4. Agregar a variables de entorno:
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

---

## ✅ Verificación Post-Deployment

### Health Check

**1. Verificar que el sitio carga**
```bash
curl https://tu-dominio.com
# Debe retornar HTML
```

**2. Verificar API**
```bash
# Health check
curl https://tu-dominio.com/api/health

# Register (crear usuario de prueba)
curl -X POST https://tu-dominio.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "fullName": "Usuario Test"
  }'

# Login
curl -X POST https://tu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**3. Verificar MongoDB**
```javascript
// En MongoDB Compass o Mongosh
use defiendete-mx
db.users.find().limit(5)
// Debe mostrar usuarios creados
```

**4. Verificar PWA**
```
1. Abre Chrome DevTools
2. Application → Service Workers
3. Verifica que sw.js está registrado
4. Application → Manifest
5. Verifica que manifest.json carga
```

**5. Verificar SMS**
```bash
curl -X POST https://tu-dominio.com/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "phoneNumber": "+52XXXXXXXXXX",
    "message": "Test desde Defiéndete MX"
  }'
```

### Monitoring

**Configurar Sentry (Errores)**
```bash
npm install @sentry/nextjs

# Ejecutar wizard
npx @sentry/wizard@latest -i nextjs

# Configura en sentry.client.config.js y sentry.server.config.js
```

**Configurar Vercel Analytics**
```bash
npm install @vercel/analytics

# En app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🐛 Troubleshooting

### Error: "Module not found: Can't resolve '@cloudflare/next-on-pages'"

**Solución:**
```bash
npm install @cloudflare/next-on-pages --save-dev
# O usa Node.js runtime en lugar de Edge
```

### Error: "Module not found: Can't resolve 'bcrypt'"

**Solución:**
```bash
# Opción 1: Instalar bcrypt
npm install bcrypt

# Opción 2: Cambiar a bcryptjs (Edge compatible)
npm install bcryptjs
# Cambiar todos los imports: import bcrypt from 'bcryptjs';
```

### Error: "MongoServerError: Authentication failed"

**Solución:**
```bash
# 1. Verifica connection string
# 2. Verifica usuario y contraseña
# 3. Verifica IP whitelist en MongoDB Atlas
# 4. Reemplaza <password> con tu contraseña real
```

### Error: "JWT must be provided"

**Solución:**
```bash
# Verifica que JWT_SECRET está configurado
echo $JWT_SECRET

# Regenera token:
curl -X POST /api/auth/login -d '{"email": "...", "password": "..."}'
```

### Error: Build timeout en Vercel

**Solución:**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

### Error: Twilio authentication failed

**Solución:**
```bash
# 1. Verifica credenciales en Twilio Dashboard
# 2. Verifica que están en variables de entorno
# 3. No confundas Account SID con Auth Token
# 4. Verifica formato de número: +1234567890
```

---

## 📊 Performance Optimization

### Next.js Config
```javascript
// next.config.js
module.exports = {
  // Enable SWC minification
  swcMinify: true,

  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Disable X-Powered-By header
  poweredByHeader: false,
};
```

### CDN Configuration

**Cloudflare:**
```
1. Add site to Cloudflare
2. Enable Auto Minify (CSS, JS, HTML)
3. Enable Brotli compression
4. Set caching rules for static assets
5. Enable HTTP/3
```

---

## 🔒 Security Checklist

- [ ] HTTPS habilitado
- [ ] Secrets no commiteados a Git
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] CSP headers habilitados
- [ ] Database con autenticación
- [ ] Backups automáticos configurados
- [ ] Logs de seguridad habilitados
- [ ] IP whitelist configurada (MongoDB)
- [ ] 2FA habilitado en servicios críticos

---

## 📝 Conclusión

Siguiendo esta guía, deberías tener Defiéndete MX corriendo en producción con todas las funcionalidades operativas.

### Próximos pasos:
1. Configurar dominio personalizado
2. Configurar SSL/HTTPS
3. Setup monitoring y alertas
4. Configurar backups automáticos
5. Implementar CI/CD
6. Agregar tests de integración
7. Documentar API con Swagger

### Soporte:
- Documentación completa: Ver `TESTING_REPORT.md`
- Issues: GitHub Issues
- Contacto: Sebastian Vernis

---

**Última actualización:** 2025-12-11
