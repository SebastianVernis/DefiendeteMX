#!/usr/bin/env node

/**
 * Script de Validación de Esquemas de Base de Datos
 * Valida la integridad y consistencia de los modelos Mongoose
 */

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, colors.blue);
  log(message, colors.blue);
  log('='.repeat(60), colors.blue);
}

// Función para validar un modelo
function validateModel(modelName, ModelClass) {
  const errors = [];
  const warnings = [];
  const info = [];

  try {
    // Verificar que el modelo sea válido
    if (!ModelClass || !ModelClass.schema) {
      errors.push(`Modelo ${modelName} no tiene un schema válido`);
      return { errors, warnings, info };
    }

    const schema = ModelClass.schema;

    // 1. Validar paths del schema
    const paths = Object.keys(schema.paths);
    info.push(`Total de campos: ${paths.length}`);

    // 2. Validar índices
    const indexes = schema.indexes();
    info.push(`Total de índices: ${indexes.length}`);

    if (indexes.length === 0) {
      warnings.push('No hay índices definidos (puede afectar el rendimiento)');
    }

    // 3. Validar campos requeridos
    const requiredFields = paths.filter(path => {
      const schemaType = schema.paths[path];
      return schemaType.isRequired;
    });
    info.push(`Campos requeridos: ${requiredFields.length}`);

    // 4. Validar timestamps
    if (schema.options.timestamps) {
      info.push('Timestamps habilitados (createdAt, updatedAt)');
    } else {
      warnings.push('Timestamps no están habilitados');
    }

    // 5. Validar métodos del modelo
    const methods = Object.keys(schema.methods || {});
    if (methods.length > 0) {
      info.push(`Métodos personalizados: ${methods.join(', ')}`);
    }

    // 6. Validar statics
    const statics = Object.keys(schema.statics || {});
    if (statics.length > 0) {
      info.push(`Métodos estáticos: ${statics.join(', ')}`);
    }

    // 7. Validar virtuals
    const virtuals = Object.keys(schema.virtuals).filter(v => v !== 'id');
    if (virtuals.length > 0) {
      info.push(`Campos virtuales: ${virtuals.join(', ')}`);
    }

    // 8. Validar pre/post hooks
    const preHooks = schema.s.hooks._pres || new Map();
    const postHooks = schema.s.hooks._posts || new Map();
    const totalHooks = preHooks.size + postHooks.size;
    if (totalHooks > 0) {
      info.push(`Hooks (pre/post): ${totalHooks}`);
    }

    // 9. Validar validaciones personalizadas
    paths.forEach(path => {
      const schemaType = schema.paths[path];
      if (schemaType.validators && schemaType.validators.length > 0) {
        const customValidators = schemaType.validators.filter(v => v.validator);
        if (customValidators.length > 0) {
          info.push(`Campo "${path}" tiene ${customValidators.length} validador(es) personalizado(s)`);
        }
      }
    });

  } catch (error) {
    errors.push(`Error al validar modelo: ${error.message}`);
  }

  return { errors, warnings, info };
}

// Función principal
async function main() {
  logSection('VALIDACIÓN DE ESQUEMAS DE BASE DE DATOS');
  log('Defiéndete MX - Sistema de Gestión de Casos\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Lista de modelos a validar
  const models = [
    { name: 'User', path: '../app/models/User.js' },
    { name: 'Issue', path: '../app/models/Issue.js' },
    { name: 'Chat', path: '../app/models/Chat.js' },
    { name: 'Notification', path: '../app/models/Notification.js' },
    { name: 'GovernmentReport', path: '../app/models/GovernmentReport.js' },
    { name: 'VoiceRecording', path: '../app/models/VoiceRecording.js' }
  ];

  for (const model of models) {
    results.total++;
    logSection(`Validando Modelo: ${model.name}`);

    try {
      // Importar el modelo
      const modelPath = path.resolve(__dirname, model.path);
      let ModelClass;

      try {
        const module = await import(modelPath);
        ModelClass = module.default;
      } catch (error) {
        logError(`Error al importar el modelo: ${error.message}`);
        results.failed++;
        continue;
      }

      // Validar el modelo
      const validation = validateModel(model.name, ModelClass);

      // Mostrar resultados
      if (validation.errors.length > 0) {
        validation.errors.forEach(err => logError(err));
        results.failed++;
      } else {
        logSuccess(`Modelo ${model.name} validado correctamente`);
        results.passed++;
      }

      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warn => logWarning(warn));
        results.warnings += validation.warnings.length;
      }

      if (validation.info.length > 0) {
        log('\nInformación del modelo:');
        validation.info.forEach(i => logInfo(i));
      }

    } catch (error) {
      logError(`Error inesperado: ${error.message}`);
      results.failed++;
    }
  }

  // Resumen final
  logSection('RESUMEN DE VALIDACIÓN');
  log(`Total de modelos: ${results.total}`);
  logSuccess(`Modelos válidos: ${results.passed}`);
  if (results.failed > 0) {
    logError(`Modelos con errores: ${results.failed}`);
  }
  if (results.warnings > 0) {
    logWarning(`Advertencias totales: ${results.warnings}`);
  }

  const successRate = ((results.passed / results.total) * 100).toFixed(2);
  log(`\nTasa de éxito: ${successRate}%`);

  if (results.failed === 0) {
    logSuccess('\n✓ Todos los esquemas son válidos!');
    process.exit(0);
  } else {
    logError('\n✗ Se encontraron errores en los esquemas');
    process.exit(1);
  }
}

// Ejecutar
main().catch(error => {
  logError(`Error fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});
