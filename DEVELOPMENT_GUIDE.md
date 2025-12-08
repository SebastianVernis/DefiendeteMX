# 🚀 Guía de Desarrollo - Defiéndete MX

## 📋 Inicio Rápido

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd DefiendeteMX

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en puerto 3000

# Build
npm run build        # Crea build de producción optimizado
npm run start        # Inicia servidor de producción

# Deployment
npm run deploy       # Despliega a Cloudflare Pages
```

---

## 📁 Estructura del Proyecto

```
DefiendeteMX/
├── app/
│   ├── components/
│   │   ├── ui/              # Componentes base reutilizables
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   └── Badge.js
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── Header.js
│   │   │   └── Footer.js
│   │   └── features/        # Componentes de características
│   │       ├── Hero.js
│   │       ├── FeaturesSection.js
│   │       ├── ScenarioCard.js
│   │       └── ScenariosSection.js
│   ├── data/
│   │   └── scenarios.js     # Datos de escenarios legales
│   ├── recursos/
│   │   └── page.js          # Página de recursos
│   ├── offline/
│   │   └── page.js          # Página offline
│   ├── layout.js            # Layout raíz
│   ├── page.js              # Página principal
│   ├── error.js             # Página de error
│   ├── not-found.js         # Página 404
│   ├── loading.js           # Estado de carga
│   └── globals.css          # Estilos globales
├── public/
│   ├── icons/               # Iconos PWA
│   ├── manifest.json        # Manifest PWA
│   └── sw.js               # Service Worker
├── tailwind.config.js       # Configuración Tailwind
├── next.config.js           # Configuración Next.js
└── package.json
```

---

## 🎨 Agregar Nuevos Componentes

### 1. Componente UI Base

```bash
# Crear nuevo componente en /app/components/ui/
touch app/components/ui/NewComponent.js
```

```jsx
'use client';

/**
 * NewComponent
 * Description of what this component does
 */
export default function NewComponent({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) {
  const baseStyles = 'base-classes';
  const variants = {
    default: 'default-classes',
    primary: 'primary-classes',
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

### 2. Componente de Feature

```bash
# Crear nuevo feature en /app/components/features/
touch app/components/features/NewFeature.js
```

```jsx
'use client';

import Button from '../ui/Button';
import Card from '../ui/Card';

export default function NewFeature() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Feature content */}
      </div>
    </section>
  );
}
```

### 3. Nueva Página

```bash
# Crear nueva página
mkdir app/nueva-pagina
touch app/nueva-pagina/page.js
```

```jsx
'use client'; // Si usa interactividad

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function NuevaPagina() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Page content */}
      </main>
      <Footer />
    </>
  );
}
```

---

## 📊 Agregar Nuevos Escenarios

Edita `/app/data/scenarios.js`:

```javascript
export const scenarios = [
  // ... escenarios existentes
  {
    id: "nuevo-escenario",
    title: "Título del Escenario",
    icon: "🔍",
    category: "defensa", // emergencia, abuso, o defensa
    steps: [
      "Paso 1",
      "Paso 2",
      "Paso 3",
    ],
    legal: [
      "Información legal 1",
      "Información legal 2",
    ]
  }
];
```

---

## 🎨 Personalizar Estilos

### Colores en Tailwind Config

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      accent: '#667eea',      // Cambiar color principal
      accentLight: '#764ba2', // Cambiar color secundario
      // ... más colores
    }
  }
}
```

### Animaciones Personalizadas

Agrega en `globals.css`:

```css
@keyframes customAnimation {
  from {
    /* estado inicial */
  }
  to {
    /* estado final */
  }
}

.animate-custom {
  animation: customAnimation 1s ease-out;
}
```

---

## 🔧 Configuración PWA

### Actualizar Manifest

Edita `public/manifest.json`:

```json
{
  "name": "Defiéndete MX",
  "short_name": "Defiéndete",
  "description": "Tu descripción",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

### Service Worker

El service worker se genera automáticamente con `next-pwa`.

---

## 🚀 Deployment

### Cloudflare Pages

```bash
# Build para producción
npm run build

# Deploy
npm run deploy
```

### Variables de Entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## 🧪 Testing

### Verificar Build

```bash
npm run build
```

Debe completarse sin errores.

### Verificar en Diferentes Dispositivos

1. **Desktop**: `http://localhost:3000`
2. **Mobile**: Usa Chrome DevTools (F12) → Toggle device toolbar
3. **Tablet**: Prueba en breakpoint md (768px)

### Lighthouse Audit

1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Ejecuta audit para:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
   - PWA

**Meta**: Todos los scores >90

---

## 📝 Mejores Prácticas

### 1. Componentes

- ✅ Usa `'use client'` solo cuando sea necesario
- ✅ Mantén componentes pequeños y enfocados
- ✅ Usa props con valores por defecto
- ✅ Documenta con comentarios JSDoc

### 2. Estilos

- ✅ Usa solo clases de Tailwind
- ✅ No uses inline styles
- ✅ Mantén consistencia en spacing
- ✅ Usa responsive prefixes (sm:, md:, lg:)

### 3. Accesibilidad

- ✅ Agrega ARIA labels
- ✅ Usa HTML semántico
- ✅ Asegura contraste de color
- ✅ Prueba navegación por teclado

### 4. Performance

- ✅ Optimiza imágenes
- ✅ Lazy load cuando sea apropiado
- ✅ Minimiza re-renders
- ✅ Usa React.memo para componentes pesados

---

## 🐛 Debugging

### Errores Comunes

**Error: "Event handlers cannot be passed to Client Component props"**
- Solución: Agrega `'use client'` al inicio del archivo

**Error: Build falla**
- Verifica que no haya imports faltantes
- Revisa la sintaxis JSX
- Ejecuta `npm run build` para ver errores específicos

**Estilos no se aplican**
- Verifica que las clases de Tailwind estén en el content config
- Reinicia el servidor de desarrollo
- Limpia caché: `rm -rf .next`

### Logs

```bash
# Ver logs del servidor
tail -f .blackbox/tmp/shell_tool_*.log

# Ver logs de build
npm run build 2>&1 | tee build.log
```

---

## 📚 Recursos Adicionales

### Documentación

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

### Herramientas Útiles

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VSCode extension
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools) - Chrome extension
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit

---

## 🤝 Contribuir

### Workflow

1. Crea una rama para tu feature
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Haz tus cambios y commits
```bash
git add .
git commit -m "feat: descripción del cambio"
```

3. Push y crea Pull Request
```bash
git push origin feature/nueva-funcionalidad
```

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de estilo (no afectan lógica)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa la documentación en `/REDESIGN_SUMMARY.md`
2. Consulta el sistema de diseño en `/DESIGN_SYSTEM.md`
3. Revisa los componentes existentes como referencia
4. Abre un issue en el repositorio

---

## 🎉 ¡Listo para Desarrollar!

Ahora tienes todo lo necesario para:
- ✅ Agregar nuevos componentes
- ✅ Crear nuevas páginas
- ✅ Personalizar estilos
- ✅ Desplegar a producción
- ✅ Mantener el código limpio y consistente

**Happy coding! 🚀**
