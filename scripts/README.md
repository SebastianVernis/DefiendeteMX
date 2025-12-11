# Scripts de Validación - Defiéndete MX

Este directorio contiene scripts utilitarios para validación y testing del proyecto.

## 📁 Contenido

### 1. `database-validation.mjs`
Script completo de validación de base de datos que verifica:

- ✅ Archivos de modelo Mongoose
- ✅ Migración D1 (Cloudflare)
- ✅ Capa de abstracción de DB
- ✅ Configuración MongoDB
- ✅ Configuración Wrangler
- ✅ Estructura de tests
- ✅ Integridad de esquemas
- ✅ Dependencias del proyecto

**Uso:**

```bash
# Ejecución directa
node scripts/database-validation.mjs

# O usando npm script
npm run validate:db
```

**Salida:**

El script genera un reporte con colores indicando:
- ✅ Verde: Validaciones exitosas
- ⚠️ Amarillo: Advertencias
- ✗ Rojo: Errores

**Exit Codes:**
- `0`: Validación exitosa
- `1`: Errores encontrados

---

## 🚀 Scripts NPM Disponibles

### Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Tests con reporte de cobertura
npm run test:coverage
```

### Validación

```bash
# Validar solo la base de datos
npm run validate:db

# Validación completa (DB + Tests con cobertura)
npm run validate:all
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start
```

---

## 📊 Interpretando los Resultados

### Validación de Base de Datos

**Estructura del Reporte:**

```
======================================================================
1. VALIDACIÓN DE ARCHIVOS DE MODELO
======================================================================
✓ Modelo encontrado: User.js
ℹ   Schema válido y exportado correctamente
...

======================================================================
RESUMEN DE VALIDACIÓN
======================================================================
Total de validaciones: 47
✓ Validaciones exitosas: 47
Tasa de éxito: 100.00%
```

**Métricas Clave:**
- **Total de validaciones**: Número de checks realizados
- **Validaciones exitosas**: Checks que pasaron
- **Advertencias**: Problemas menores no críticos
- **Tasa de éxito**: Porcentaje de validaciones exitosas

### Reporte de Cobertura

```
=============================== Coverage summary ===============================
Statements   : 11.61% ( 608/5236 )
Branches     : 9.64%  ( 231/2394 )
Functions    : 11.51% ( 82/712 )
Lines        : 11.61% ( 578/4977 )
================================================================================
```

**Métricas:**
- **Statements**: Porcentaje de declaraciones ejecutadas
- **Branches**: Porcentaje de ramificaciones (if/else) cubiertas
- **Functions**: Porcentaje de funciones ejecutadas
- **Lines**: Porcentaje de líneas ejecutadas

**Objetivo:** 70% en todas las métricas

---

## 🛠️ Troubleshooting

### Error: "Module not found"

```bash
# Reinstalar dependencias
npm install
```

### Error: "MongoDB connection failed"

Los tests usan mocks de MongoDB. Si ves errores de conexión:

1. Verifica que `jest.setup.js` tenga los mocks correctos
2. MongoDB no es necesario para ejecutar los tests

### Tests Fallando

Si ves tests fallando:

1. Verifica que las dependencias estén instaladas
2. Revisa `jest.config.js` para configuración correcta
3. Consulta el reporte de test para detalles específicos

### Script de Validación Falla

Si `database-validation.mjs` falla:

1. Verifica que Node.js >= 18 esté instalado
2. Verifica que los archivos de modelo existan en `app/models/`
3. Verifica que la migración exista en `migrations/0001_initial_schema.sql`

---

## 📝 Agregar Nuevos Scripts

Para agregar un nuevo script de validación:

1. **Crear el script en `/scripts/`**

```javascript
#!/usr/bin/env node
// nuevo-script.mjs

console.log('Mi nuevo script');
```

2. **Hacerlo ejecutable**

```bash
chmod +x scripts/nuevo-script.mjs
```

3. **Agregar al package.json** (opcional)

```json
{
  "scripts": {
    "mi-script": "node scripts/nuevo-script.mjs"
  }
}
```

4. **Ejecutar**

```bash
npm run mi-script
```

---

## 🎯 Mejores Prácticas

### 1. Ejecutar Validación Antes de Commit

```bash
# Pre-commit hook
npm run validate:all
```

### 2. Monitorear Cobertura

Mantener la cobertura por encima del 70%:

```bash
npm run test:coverage
```

### 3. Tests en Desarrollo

Usar modo watch durante desarrollo:

```bash
npm run test:watch
```

### 4. Validación en CI/CD

Agregar a tu pipeline:

```yaml
# .github/workflows/test.yml
- name: Validate Database
  run: npm run validate:db

- name: Run Tests
  run: npm run test:coverage
```

---

## 📚 Recursos Adicionales

- [Documentación Jest](https://jestjs.io/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

## 🤝 Contribuir

Para agregar nuevas validaciones:

1. Fork el proyecto
2. Crea un nuevo script en `/scripts/`
3. Documenta el script en este README
4. Crea un Pull Request

---

**Última actualización:** 2025-12-11
**Versión:** 2.1.0
