#!/usr/bin/env node

/**
 * Script de Validación Completa de Base de Datos
 * Valida esquemas, migración D1 y estructura de datos
 */

import fs from 'fs';
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
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
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
  log(`\n${'='.repeat(70)}`, colors.blue + colors.bold);
  log(message, colors.blue + colors.bold);
  log('='.repeat(70), colors.blue + colors.bold);
}

// Resultados globales
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

// 1. Validar archivos de modelo
function validateModelFiles() {
  logSection('1. VALIDACIÓN DE ARCHIVOS DE MODELO');

  const modelsDir = path.resolve(__dirname, '../app/models');
  const expectedModels = [
    'User.js',
    'Issue.js',
    'Chat.js',
    'Notification.js',
    'GovernmentReport.js',
    'VoiceRecording.js'
  ];

  expectedModels.forEach(modelFile => {
    results.total++;
    const modelPath = path.join(modelsDir, modelFile);

    if (fs.existsSync(modelPath)) {
      logSuccess(`Modelo encontrado: ${modelFile}`);
      results.passed++;

      // Verificar contenido básico
      const content = fs.readFileSync(modelPath, 'utf-8');
      const hasSchema = content.includes('mongoose.Schema');
      const hasExport = content.includes('export default');

      if (hasSchema && hasExport) {
        logInfo(`  Schema válido y exportado correctamente`);
      } else {
        logWarning(`  Posible problema en la estructura del schema`);
        results.warnings++;
      }
    } else {
      logError(`Modelo no encontrado: ${modelFile}`);
      results.failed++;
    }
  });
}

// 2. Validar migración D1
function validateD1Migration() {
  logSection('2. VALIDACIÓN DE MIGRACIÓN D1 (CLOUDFLARE)');

  const migrationPath = path.resolve(__dirname, '../migrations/0001_initial_schema.sql');

  results.total++;
  if (fs.existsSync(migrationPath)) {
    logSuccess('Archivo de migración encontrado');
    results.passed++;

    const content = fs.readFileSync(migrationPath, 'utf-8');

    // Validar tablas esperadas
    const expectedTables = [
      'users',
      'issues',
      'chats',
      'notifications',
      'government_reports',
      'voice_recordings'
    ];

    expectedTables.forEach(table => {
      results.total++;
      if (content.includes(`CREATE TABLE IF NOT EXISTS ${table}`) || content.includes(`CREATE TABLE ${table}`)) {
        logSuccess(`  Tabla "${table}" definida`);
        results.passed++;
      } else {
        logError(`  Tabla "${table}" no encontrada en migración`);
        results.failed++;
      }
    });

    // Validar índices
    results.total++;
    const hasIndexes = content.includes('CREATE INDEX');
    if (hasIndexes) {
      const indexCount = (content.match(/CREATE INDEX/g) || []).length;
      logSuccess(`  ${indexCount} índices definidos`);
      results.passed++;
    } else {
      logWarning('  No se encontraron índices definidos');
      results.warnings++;
      results.passed++;
    }

  } else {
    logError('Archivo de migración no encontrado');
    results.failed++;
  }
}

// 3. Validar abstracción de base de datos
function validateDatabaseAbstraction() {
  logSection('3. VALIDACIÓN DE CAPA DE ABSTRACCIÓN DE DB');

  const dbPath = path.resolve(__dirname, '../app/lib/db.js');

  results.total++;
  if (fs.existsSync(dbPath)) {
    logSuccess('Archivo de abstracción de DB encontrado');
    results.passed++;

    const content = fs.readFileSync(dbPath, 'utf-8');

    // Validar funciones de acceso a DB
    const expectedFunctions = [
      'UserDB',
      'IssueDB',
      'ChatDB',
      'NotificationDB',
      'GovernmentReportDB',
      'VoiceRecordingDB'
    ];

    expectedFunctions.forEach(func => {
      results.total++;
      if (content.includes(`export const ${func}`)) {
        logSuccess(`  Función "${func}" encontrada`);
        results.passed++;
      } else {
        logError(`  Función "${func}" no encontrada`);
        results.failed++;
      }
    });

  } else {
    logError('Archivo de abstracción no encontrado');
    results.failed++;
  }
}

// 4. Validar configuración de MongoDB
function validateMongoDBConfig() {
  logSection('4. VALIDACIÓN DE CONFIGURACIÓN MONGODB');

  const mongoPath = path.resolve(__dirname, '../app/lib/mongodb.js');

  results.total++;
  if (fs.existsSync(mongoPath)) {
    logSuccess('Archivo de conexión MongoDB encontrado');
    results.passed++;

    const content = fs.readFileSync(mongoPath, 'utf-8');

    // Validar funcionalidades clave
    results.total += 3;

    if (content.includes('mongoose.connect')) {
      logSuccess('  Función de conexión implementada');
      results.passed++;
    } else {
      logError('  Función de conexión no encontrada');
      results.failed++;
    }

    if (content.includes('cached')) {
      logSuccess('  Sistema de caché implementado');
      results.passed++;
    } else {
      logWarning('  Sistema de caché no detectado');
      results.warnings++;
      results.passed++;
    }

    if (content.includes('export default')) {
      logSuccess('  Exportación correcta');
      results.passed++;
    } else {
      logError('  Exportación no encontrada');
      results.failed++;
    }

  } else {
    logError('Archivo de conexión no encontrado');
    results.failed++;
  }
}

// 5. Validar configuración de Wrangler (Cloudflare)
function validateWranglerConfig() {
  logSection('5. VALIDACIÓN DE CONFIGURACIÓN WRANGLER');

  const wranglerPath = path.resolve(__dirname, '../wrangler.toml');

  results.total++;
  if (fs.existsSync(wranglerPath)) {
    logSuccess('Archivo wrangler.toml encontrado');
    results.passed++;

    const content = fs.readFileSync(wranglerPath, 'utf-8');

    // Validar configuraciones clave
    results.total += 3;

    if (content.includes('[[d1_databases]]')) {
      logSuccess('  Configuración de D1 encontrada');
      results.passed++;
    } else {
      logError('  Configuración de D1 no encontrada');
      results.failed++;
    }

    if (content.includes('database_name')) {
      logSuccess('  Nombre de base de datos configurado');
      results.passed++;
    } else {
      logError('  Nombre de base de datos no configurado');
      results.failed++;
    }

    if (content.includes('binding')) {
      logSuccess('  Binding de base de datos configurado');
      results.passed++;
    } else {
      logWarning('  Binding no encontrado');
      results.warnings++;
      results.passed++;
    }

  } else {
    logWarning('Archivo wrangler.toml no encontrado (opcional)');
    results.warnings++;
    results.passed++;
  }
}

// 6. Validar estructura de tests
function validateTestStructure() {
  logSection('6. VALIDACIÓN DE ESTRUCTURA DE TESTS');

  // Validar archivos de configuración de tests
  const jestConfig = path.resolve(__dirname, '../jest.config.js');
  const jestSetup = path.resolve(__dirname, '../jest.setup.js');

  results.total += 2;

  if (fs.existsSync(jestConfig)) {
    logSuccess('jest.config.js encontrado');
    results.passed++;
  } else {
    logError('jest.config.js no encontrado');
    results.failed++;
  }

  if (fs.existsSync(jestSetup)) {
    logSuccess('jest.setup.js encontrado');
    results.passed++;
  } else {
    logError('jest.setup.js no encontrado');
    results.failed++;
  }

  // Buscar archivos de test
  const testDirs = [
    '../__tests__',
    '../app/models/__tests__',
    '../app/services/__tests__',
    '../app/api/__tests__',
    '../app/issues/__tests__'
  ];

  let totalTests = 0;
  testDirs.forEach(dir => {
    const fullPath = path.resolve(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath, { recursive: true })
        .filter(f => f.endsWith('.test.js') || f.endsWith('.spec.js'));
      totalTests += files.length;
      if (files.length > 0) {
        logInfo(`  ${files.length} archivo(s) de test en ${dir}`);
      }
    }
  });

  if (totalTests > 0) {
    logSuccess(`Total de archivos de test: ${totalTests}`);
  } else {
    logWarning('No se encontraron archivos de test');
    results.warnings++;
  }
}

// 7. Validar integridad de esquemas (análisis de contenido)
function validateSchemaIntegrity() {
  logSection('7. VALIDACIÓN DE INTEGRIDAD DE ESQUEMAS');

  const modelsDir = path.resolve(__dirname, '../app/models');
  const models = [
    { file: 'User.js', expectedFields: ['email', 'password', 'fullName'] },
    { file: 'Issue.js', expectedFields: ['title', 'category', 'status', 'userId'] },
    { file: 'Chat.js', expectedFields: ['userId', 'messages', 'status'] },
    { file: 'Notification.js', expectedFields: ['type', 'category', 'recipient'] },
    { file: 'GovernmentReport.js', expectedFields: ['type', 'issueId', 'status'] },
    { file: 'VoiceRecording.js', expectedFields: ['userId', 'fileName', 'duration'] }
  ];

  models.forEach(model => {
    const modelPath = path.join(modelsDir, model.file);
    if (fs.existsSync(modelPath)) {
      results.total++;
      const content = fs.readFileSync(modelPath, 'utf-8');

      const missingFields = model.expectedFields.filter(field =>
        !content.includes(`${field}:`)
      );

      if (missingFields.length === 0) {
        logSuccess(`${model.file}: Todos los campos esperados presentes`);
        results.passed++;
      } else {
        logWarning(`${model.file}: Campos posiblemente faltantes: ${missingFields.join(', ')}`);
        results.warnings++;
        results.passed++;
      }
    }
  });
}

// 8. Verificar package.json
function validatePackageJson() {
  logSection('8. VALIDACIÓN DE DEPENDENCIAS (package.json)');

  const packagePath = path.resolve(__dirname, '../package.json');

  results.total++;
  if (fs.existsSync(packagePath)) {
    logSuccess('package.json encontrado');
    results.passed++;

    const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    // Validar dependencias críticas
    const criticalDeps = {
      dependencies: ['mongoose', 'next', 'react', 'bcryptjs', 'jsonwebtoken'],
      devDependencies: ['jest', '@testing-library/react', '@testing-library/jest-dom']
    };

    Object.entries(criticalDeps).forEach(([type, deps]) => {
      deps.forEach(dep => {
        results.total++;
        if (content[type] && content[type][dep]) {
          logSuccess(`  ${dep} v${content[type][dep]} (${type})`);
          results.passed++;
        } else {
          logWarning(`  ${dep} no encontrado en ${type}`);
          results.warnings++;
          results.passed++;
        }
      });
    });

    // Validar scripts
    results.total++;
    if (content.scripts && content.scripts.test) {
      logSuccess(`  Script de test configurado: "${content.scripts.test}"`);
      results.passed++;
    } else {
      logError('  Script de test no configurado');
      results.failed++;
    }

  } else {
    logError('package.json no encontrado');
    results.failed++;
  }
}

// Función principal
async function main() {
  console.clear();
  logSection('VALIDACIÓN COMPLETA DE BASE DE DATOS');
  log('Defiéndete MX - Sistema de Gestión de Casos de Violencia\n', colors.cyan);

  try {
    validateModelFiles();
    validateD1Migration();
    validateDatabaseAbstraction();
    validateMongoDBConfig();
    validateWranglerConfig();
    validateTestStructure();
    validateSchemaIntegrity();
    validatePackageJson();

    // Resumen final
    logSection('RESUMEN DE VALIDACIÓN');
    log(`\nTotal de validaciones: ${results.total}`, colors.bold);
    logSuccess(`Validaciones exitosas: ${results.passed}`);

    if (results.failed > 0) {
      logError(`Validaciones fallidas: ${results.failed}`);
    }

    if (results.warnings > 0) {
      logWarning(`Advertencias: ${results.warnings}`);
    }

    const successRate = ((results.passed / results.total) * 100).toFixed(2);
    log(`\nTasa de éxito: ${successRate}%`, colors.bold);

    // Recomendaciones
    if (results.failed > 0 || results.warnings > 5) {
      logSection('RECOMENDACIONES');
      if (results.failed > 0) {
        logError('Se encontraron errores críticos que deben ser corregidos');
      }
      if (results.warnings > 5) {
        logWarning('Múltiples advertencias detectadas, revisar configuración');
      }
    }

    if (results.failed === 0) {
      log('\n' + '🎉 '.repeat(10), colors.green);
      logSuccess('¡VALIDACIÓN COMPLETA EXITOSA!');
      log('🎉 '.repeat(10) + '\n', colors.green);
      process.exit(0);
    } else {
      log('');
      logError('Se encontraron errores en la validación');
      process.exit(1);
    }

  } catch (error) {
    logError(`Error fatal durante la validación: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
main();
