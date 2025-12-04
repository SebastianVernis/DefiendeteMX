# 🚀 Instrucciones de Deployment - Defiéndete MX PWA

## 📋 Pre-requisitos

- Node.js 18+ instalado
- npm o yarn
- Cuenta en plataforma de hosting (Vercel, Netlify, Cloudflare Pages)
- Git configurado

## 🔧 Preparación para Deployment

### 1. Verificar Build Local

```bash
# Instalar dependencias
npm install

# Limpiar builds anteriores
rm -rf .next out

# Build de producción
npm run build

# Verificar que no hay errores
# Debe mostrar: ✓ Compiled successfully
```

### 2. Verificar Archivos PWA

Asegúrate de que existen estos archivos:

```bash
# Verificar manifest
cat public/manifest.json

# Verificar iconos
ls -la public/icons/

# Verificar configuración PWA
cat next.config.js | grep -A 5 "withPWA"
```

### 3. Variables de Entorno (Opcional)

Si necesitas variables de entorno, crea `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🌐 Deployment en Vercel (Recomendado)

### Opción 1: Deploy desde GitHub

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: PWA implementation and frontend restructuring"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js

3. **Configuración**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click en "Deploy"
   - Espera a que termine (2-3 minutos)
   - Tu app estará en: `https://tu-proyecto.vercel.app`

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## ☁️ Deployment en Cloudflare Pages

### Desde GitHub

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: PWA implementation"
   git push origin main
   ```

2. **Configurar Cloudflare Pages**
   - Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pages → Create a project
   - Connect to Git → Selecciona tu repo

3. **Build Settings**
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   ```

4. **Variables de Entorno**
   - Agrega las variables necesarias
   - Click en "Save and Deploy"

### Desde CLI

```bash
# Instalar Wrangler
npm i -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish out --project-name=defiendete-mx
```

## 🔷 Deployment en Netlify

### Desde GitHub

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "feat: PWA implementation"
   git push origin main
   ```

2. **Configurar Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - New site from Git
   - Selecciona tu repositorio

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: out
   ```

4. **Configurar Headers (Importante para PWA)**
   
   Crea `netlify.toml`:
   ```toml
   [[headers]]
     for = "/sw.js"
     [headers.values]
       Cache-Control = "public, max-age=0, must-revalidate"
   
   [[headers]]
     for = "/manifest.json"
     [headers.values]
       Content-Type = "application/manifest+json"
   ```

### Desde CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## 🐳 Deployment con Docker

### Dockerfile

Crea `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build y Run

```bash
# Build
docker build -t defiendete-mx .

# Run
docker run -p 3000:3000 defiendete-mx
```

## 🔍 Verificación Post-Deployment

### 1. Verificar PWA

1. **Abrir DevTools** (F12)
2. **Application Tab**
   - Manifest: Verificar que se carga correctamente
   - Service Workers: Debe estar "activated and running"
   - Storage: Verificar caché

3. **Lighthouse Audit**
   - Lighthouse Tab
   - Seleccionar "Progressive Web App"
   - Generate report
   - Score objetivo: > 90

### 2. Probar Instalación

**En Chrome/Edge:**
```
1. Abrir la app
2. Buscar ícono de instalación en la barra de direcciones
3. Click en "Instalar"
4. Verificar que se abre en ventana standalone
```

**En Mobile:**
```
1. Abrir en Chrome/Safari
2. Menú → "Agregar a pantalla de inicio"
3. Verificar icono en home screen
4. Abrir y verificar splash screen
```

### 3. Probar Offline

```
1. Abrir DevTools
2. Network tab → Offline
3. Recargar página
4. Debe mostrar contenido cacheado o página offline
```

### 4. Verificar URLs

```bash
# Manifest
curl https://tu-dominio.com/manifest.json

# Service Worker
curl https://tu-dominio.com/sw.js

# Iconos
curl -I https://tu-dominio.com/icons/icon-192x192.svg
```

## 🔒 Configuración de Seguridad

### Headers de Seguridad

Agrega estos headers en tu plataforma:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), microphone=(), camera=()
```

### Content Security Policy (CSP)

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://api.tudominio.com;
```

## 📊 Monitoreo y Analytics

### Google Analytics

1. **Instalar dependencia**
   ```bash
   npm install @next/third-parties
   ```

2. **Agregar en layout.js**
   ```javascript
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="G-XXXXXXXXXX" />
         </body>
       </html>
     )
   }
   ```

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs

# Configurar
npx @sentry/wizard@latest -i nextjs
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🐛 Troubleshooting

### Service Worker no se registra

```bash
# Verificar que next-pwa está instalado
npm list next-pwa

# Reinstalar si es necesario
npm install next-pwa@latest

# Limpiar caché
rm -rf .next public/sw.js public/workbox-*.js
npm run build
```

### Manifest no se carga

```bash
# Verificar sintaxis JSON
cat public/manifest.json | jq .

# Verificar headers
curl -I https://tu-dominio.com/manifest.json
```

### Build falla

```bash
# Limpiar todo
rm -rf .next node_modules package-lock.json

# Reinstalar
npm install

# Build con logs detallados
npm run build -- --debug
```

## 📱 Testing en Dispositivos

### Android

1. **Chrome DevTools Remote Debugging**
   ```
   chrome://inspect
   ```

2. **Conectar dispositivo por USB**
3. **Habilitar USB debugging**
4. **Inspeccionar página**

### iOS

1. **Safari Developer Tools**
2. **Conectar iPhone/iPad**
3. **Develop → [Dispositivo] → [Página]**

## 🎯 Checklist Final

Antes de considerar el deployment completo:

- [ ] Build exitoso sin errores
- [ ] Service Worker registrado
- [ ] Manifest.json válido
- [ ] Iconos en todos los tamaños
- [ ] Página offline funcional
- [ ] Instalación PWA funciona
- [ ] Modo offline funciona
- [ ] Lighthouse PWA score > 90
- [ ] Responsive en mobile/tablet/desktop
- [ ] Headers de seguridad configurados
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] SSL/HTTPS activo
- [ ] Dominio personalizado (opcional)

## 🎉 Post-Deployment

### Promoción

1. **Compartir en redes sociales**
2. **Agregar a directorios de PWA**
   - [PWA Directory](https://pwa-directory.appspot.com/)
   - [Appscope](https://appsco.pe/)

3. **SEO**
   - Submit sitemap a Google
   - Verificar en Google Search Console
   - Agregar structured data

### Mantenimiento

```bash
# Actualizar dependencias mensualmente
npm update

# Auditar seguridad
npm audit

# Verificar Lighthouse score
# Objetivo: mantener > 90 en todas las categorías
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de build
2. Verifica la consola del navegador
3. Consulta la documentación de la plataforma
4. Revisa PWA_GUIDE.md para troubleshooting específico

---

**¡Deployment Exitoso! 🎉**

Tu PWA está lista para proteger los derechos de los ciudadanos mexicanos.
