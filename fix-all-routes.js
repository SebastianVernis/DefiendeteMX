#!/usr/bin/env node

/**
 * Script to fix all API routes - remove edge runtime and use MongoDB instead of D1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all route.js files in app/api
const findRouteFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (item.name === 'route.js') {
      files.push(fullPath);
    }
  }
  
  return files;
};

const apiDir = path.join(__dirname, 'app/api');
const routeFiles = findRouteFiles(apiDir);

console.log(`Found ${routeFiles.length} route files\n`);

let fixedCount = 0;

routeFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relativePath = path.relative(__dirname, filePath);

  // Remove edge runtime export
  if (content.includes("export const runtime = 'edge';")) {
    content = content.replace(/export const runtime = 'edge';\s*/g, '');
    modified = true;
  }

  // Replace bcrypt with bcryptjs
  if (content.includes("import bcrypt from 'bcrypt';")) {
    content = content.replace(/import bcrypt from 'bcrypt';/g, "import bcrypt from 'bcryptjs';");
    modified = true;
  }

  // Replace DB imports
  if (content.includes("from '../../../lib/db'") || content.includes("from '../../lib/db'")) {
    // Count how many ../ to determine the correct path
    const depth = (filePath.match(/\//g) || []).length - (apiDir.match(/\//g) || []).length;
    const backPath = '../'.repeat(depth);
    
    // Replace various DB imports
    content = content.replace(
      /import { (UserDB|IssueDB|ChatDB|NotificationDB|GovernmentReportDB|VoiceRecordingDB|.*DB) } from ['"]\.\.\/.*\/lib\/db['"];?/g,
      (match, dbName) => {
        const modelName = dbName.replace('DB', '');
        return `import dbConnect from '${backPath}lib/mongodb';\nimport ${modelName} from '${backPath}models/${modelName}';`;
      }
    );
    
    // Also handle multiple imports
    content = content.replace(
      /import { ([^}]+) } from ['"]\.\.\/.*\/lib\/db['"];?/g,
      (match, imports) => {
        const dbNames = imports.split(',').map(s => s.trim());
        const modelImports = dbNames
          .filter(name => name.endsWith('DB'))
          .map(name => {
            const modelName = name.replace('DB', '');
            return `import ${modelName} from '${backPath}models/${modelName}';`;
          })
          .join('\n');
        return `import dbConnect from '${backPath}lib/mongodb';\n${modelImports}`;
      }
    );
    
    modified = true;
  }

  // Replace crypto import
  if (content.includes("import crypto from 'crypto';")) {
    content = content.replace(/import crypto from 'crypto';/g, "import { randomBytes, createHash } from 'crypto';");
    modified = true;
  }

  // Add dbConnect() call at the start of async functions if not present
  if (modified && !content.includes('await dbConnect()')) {
    // Add dbConnect to POST, GET, PUT, DELETE, PATCH functions
    content = content.replace(
      /(export async function (POST|GET|PUT|DELETE|PATCH)\([^)]+\) {\s*try {\s*)/g,
      '$1\n    await dbConnect();\n    '
    );
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${relativePath}`);
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} route files!`);
