# 🚀 Quick Start - Testing y Validación

Guía rápida para ejecutar validaciones y tests en el proyecto Defiéndete MX.

## Validación Rápida (1 comando)

```bash
# Validación completa de base de datos
npm run validate:db
```

**Tiempo estimado:** 1-2 segundos
**Qué valida:**
- ✅ 6 modelos Mongoose
- ✅ 6 tablas D1 (Cloudflare)
- ✅ 32 índices
- ✅ Configuraciones de DB
- ✅ Estructura de tests

---

## Tests Rápidos

```bash
# Solo tests (sin cobertura)
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch (desarrollo)
npm run test:watch
```

---

## Validación Completa

```bash
# Validación de DB + Tests con cobertura
npm run validate:all
```

**Tiempo estimado:** 10-15 segundos

---

## Revisar Reportes

```bash
# Ver reporte completo
cat TEST_VALIDATION_REPORT.md

# O abrir en tu editor
code TEST_VALIDATION_REPORT.md
```

---

## Troubleshooting Rápido

### Error: "Command not found"
```bash
npm install
```

### Tests fallando
```bash
# Limpiar cache de Jest
npx jest --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Revisar vulnerabilidades
```bash
npm audit
npm audit fix
```

---

## Estados de Validación

| Símbolo | Significado |
|---------|-------------|
| ✅ | Todo correcto |
| ⚠️ | Advertencia (no crítico) |
| ✗ | Error que requiere atención |
| ℹ | Información adicional |

---

## Next Steps

1. **Resolver vulnerabilidades:** `npm audit fix`
2. **Mejorar cobertura:** Agregar más tests
3. **Revisar tests fallidos:** Ver logs detallados

---

**Última actualización:** 2025-12-11
