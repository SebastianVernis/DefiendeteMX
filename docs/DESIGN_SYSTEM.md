# 🎨 Sistema de Diseño - Defiéndete MX

## 📚 Guía de Uso de Componentes

### 🔘 Button Component

```jsx
import Button from './components/ui/Button';

// Variantes disponibles
<Button variant="primary">Botón Principal</Button>
<Button variant="secondary">Botón Secundario</Button>
<Button variant="success">Botón Éxito</Button>
<Button variant="danger">Botón Peligro</Button>
<Button variant="ghost">Botón Fantasma</Button>
<Button variant="sos">Botón SOS</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>
<Button size="xl">Extra Grande</Button>

// Con icono
<Button icon="🚨" variant="sos">Emergencia</Button>

// Full width
<Button fullWidth>Ancho Completo</Button>
```

### 🎴 Card Component

```jsx
import Card from './components/ui/Card';

// Variantes
<Card variant="default">Card por defecto</Card>
<Card variant="glass">Card con glassmorphism</Card>
<Card variant="gradient">Card con gradiente</Card>
<Card variant="dark">Card oscuro</Card>

// Con hover effect
<Card hover={true}>Card con efecto hover</Card>

// Clickable
<Card onClick={() => console.log('clicked')}>Card clickeable</Card>
```

### 🏷️ Badge Component

```jsx
import Badge from './components/ui/Badge';

// Variantes
<Badge variant="default">Por defecto</Badge>
<Badge variant="primary">Primario</Badge>
<Badge variant="success">Éxito</Badge>
<Badge variant="warning">Advertencia</Badge>
<Badge variant="danger">Peligro</Badge>
<Badge variant="info">Información</Badge>

// Con icono
<Badge icon="⚖️" variant="primary">Legal</Badge>

// Tamaños
<Badge size="sm">Pequeño</Badge>
<Badge size="md">Mediano</Badge>
<Badge size="lg">Grande</Badge>
```

---

## 🎨 Paleta de Colores

### Gradientes Principales

```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Secondary Gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Success Gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Hero Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
```

### Colores Sólidos

```css
--accent: #667eea;         /* Púrpura principal */
--accent-light: #764ba2;   /* Púrpura oscuro */
--accent-hover: #5568d3;   /* Púrpura hover */
--success: #10b981;        /* Verde éxito */
--warning: #ef4444;        /* Rojo advertencia */
```

---

## ✨ Animaciones

### Clases de Animación Disponibles

```jsx
// Fade in
<div className="animate-fadeIn">Aparece con fade</div>

// Slide in desde la izquierda
<div className="animate-slideInLeft">Desliza desde izquierda</div>

// Slide in desde la derecha
<div className="animate-slideInRight">Desliza desde derecha</div>

// Scale in
<div className="animate-scaleIn">Escala hacia adentro</div>

// Float (infinito)
<div className="animate-float">Flota continuamente</div>

// Pulse glow (infinito)
<div className="animate-pulse-glow">Pulsa con brillo</div>

// Gradient shift (infinito)
<div className="animate-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-200">
  Gradiente animado
</div>
```

### Delays para Animaciones Escalonadas

```jsx
<div className="animate-fadeIn delay-100">Aparece primero</div>
<div className="animate-fadeIn delay-200">Aparece segundo</div>
<div className="animate-fadeIn delay-300">Aparece tercero</div>
<div className="animate-fadeIn delay-400">Aparece cuarto</div>
<div className="animate-fadeIn delay-500">Aparece quinto</div>
```

---

## 🎭 Efectos Especiales

### Glassmorphism

```jsx
<div className="glass p-6 rounded-2xl">
  Contenido con efecto glass
</div>

<div className="glass-dark p-6 rounded-2xl">
  Contenido con efecto glass oscuro
</div>
```

### Texto con Gradiente

```jsx
<h1 className="gradient-text text-4xl font-bold">
  Texto con gradiente
</h1>
```

### Card con Hover Effect

```jsx
<div className="card-hover bg-white p-6 rounded-2xl shadow-lg">
  Card que se eleva al hacer hover
</div>
```

### Botón con Gradiente

```jsx
<button className="btn-gradient px-6 py-3 rounded-xl text-white">
  Botón con gradiente animado
</button>
```

---

## 📐 Espaciado y Layout

### Container Responsive

```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  Contenido centrado con padding responsive
</div>
```

### Grid Responsive

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flex Responsive

```jsx
<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
  <div>Izquierda</div>
  <div>Derecha</div>
</div>
```

---

## 🔤 Tipografía

### Fuentes

```css
/* Cuerpo de texto */
font-family: 'Inter', sans-serif;

/* Títulos y display */
font-family: 'Poppins', sans-serif;
```

### Clases de Tipografía

```jsx
// Títulos
<h1 className="text-5xl font-black font-display">Título Principal</h1>
<h2 className="text-4xl font-bold font-display">Título Secundario</h2>
<h3 className="text-3xl font-semibold">Título Terciario</h3>

// Cuerpo
<p className="text-base font-normal">Texto normal</p>
<p className="text-lg font-medium">Texto mediano</p>
<p className="text-sm text-gray-600">Texto pequeño</p>

// Texto con gradiente
<h1 className="gradient-text text-5xl font-black">
  Título con gradiente
</h1>
```

---

## 🎯 Breakpoints

```css
/* Mobile first */
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

### Uso de Breakpoints

```jsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Texto responsive
</div>

<div className="p-4 sm:p-6 md:p-8 lg:p-10">
  Padding responsive
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  Grid responsive
</div>
```

---

## 🎨 Sombras

```jsx
// Sombras elegantes
<div className="shadow-elegant">Sombra sutil</div>
<div className="shadow-elegant-lg">Sombra mediana</div>
<div className="shadow-elegant-xl">Sombra grande</div>

// Sombras estándar
<div className="shadow-lg">Sombra grande</div>
<div className="shadow-xl">Sombra extra grande</div>
<div className="shadow-2xl">Sombra 2XL</div>
<div className="shadow-3xl">Sombra 3XL</div>

// Sombras con brillo
<div className="shadow-glow">Brillo sutil</div>
<div className="shadow-glow-lg">Brillo intenso</div>
```

---

## ♿ Accesibilidad

### Focus States

Todos los elementos interactivos tienen focus states automáticos:

```css
*:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### ARIA Labels

```jsx
// Botones
<button aria-label="Llamar al 911 en caso de emergencia">
  🚨 SOS
</button>

// Links
<a href="/" aria-label="Defiéndete MX - Inicio">
  Logo
</a>

// Navegación
<nav aria-label="Navegación principal">
  {/* contenido */}
</nav>
```

### Skip to Content

```jsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Saltar al contenido principal
</a>
```

---

## 📱 Mobile Optimizations

### Touch Targets

```jsx
// Mínimo 44x44px para elementos táctiles
<button className="min-h-[44px] min-w-[44px]">
  Botón táctil
</button>
```

### Prevenir Zoom en Inputs (iOS)

```jsx
// Font size mínimo de 16px
<input className="text-base" />
```

### Full Width en Mobile

```jsx
<div className="w-full sm:w-auto">
  Full width en mobile, auto en desktop
</div>
```

---

## 🎬 Ejemplos de Uso Completos

### Hero Section

```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 animate-gradient">
    <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
  </div>
  
  <div className="relative z-10 container mx-auto px-4 text-center">
    <h1 className="text-6xl font-black text-white mb-6 animate-fadeIn">
      Título Impactante
    </h1>
    <p className="text-xl text-white/90 mb-8 animate-fadeIn delay-100">
      Descripción atractiva
    </p>
    <Button variant="primary" size="lg" className="animate-fadeIn delay-200">
      Call to Action
    </Button>
  </div>
</section>
```

### Card Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map((item, index) => (
    <Card 
      key={item.id}
      variant="gradient"
      hover={true}
      className={`p-6 animate-fadeIn delay-${index * 100}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl mb-4">
        {item.icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
      <p className="text-gray-600">{item.description}</p>
    </Card>
  ))}
</div>
```

---

## 🚀 Performance Tips

1. **Usa animaciones con GPU**: `transform` y `opacity`
2. **Evita animaciones en `width` y `height`**
3. **Usa `will-change` con moderación**
4. **Lazy load imágenes**: `loading="lazy"`
5. **Optimiza gradientes**: Usa CSS en lugar de imágenes

---

## 📝 Convenciones de Código

### Nombres de Componentes
- PascalCase para componentes: `Button.js`, `ScenarioCard.js`
- camelCase para funciones: `handleClick`, `scrollToTop`

### Estructura de Componentes

```jsx
'use client'; // Si usa hooks o event handlers

import { useState } from 'react';

/**
 * Component Description
 * Brief explanation of what the component does
 */
export default function ComponentName({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(null);
  
  // Event handlers
  const handleAction = () => {
    // Implementation
  };
  
  // Render
  return (
    <div className="responsive classes">
      {/* Content */}
    </div>
  );
}
```

---

## 🎉 Conclusión

Este sistema de diseño proporciona todos los componentes y utilidades necesarios para crear interfaces modernas, accesibles y performantes. Todos los componentes son reutilizables, personalizables y siguen las mejores prácticas de React y Tailwind CSS.

Para más información, consulta:
- `REDESIGN_SUMMARY.md` - Resumen completo del rediseño
- `COMPONENT_STRUCTURE.txt` - Estructura de archivos
- Componentes individuales en `/app/components/`
