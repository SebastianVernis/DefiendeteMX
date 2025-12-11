#!/usr/bin/env node

/**
 * Script to fix auth routes - remove edge runtime and use MongoDB instead of D1
 */

const fs = require('fs');
const path = require('path');

const authRoutes = [
  'app/api/auth/register/route.js',
  'app/api/auth/logout/route.js',
  'app/api/auth/refresh/route.js',
  'app/api/auth/me/route.js',
  'app/api/auth/change-password/route.js',
  'app/api/auth/forgot-password/route.js',
  'app/api/auth/reset-password/route.js'
];

authRoutes.forEach(routePath => {
  const fullPath = path.join(__dirname, routePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${routePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Remove edge runtime export
  if (content.includes("export const runtime = 'edge';")) {
    content = content.replace(/export const runtime = 'edge';\s*/g, '');
    modified = true;
  }

  // Replace bcrypt with bcryptjs (already in package.json)
  if (content.includes("import bcrypt from 'bcrypt';")) {
    content = content.replace(/import bcrypt from 'bcrypt';/g, "import bcrypt from 'bcryptjs';");
    modified = true;
  }

  // Replace UserDB imports with MongoDB
  if (content.includes("import { UserDB } from '../../../lib/db';")) {
    content = content.replace(
      /import { UserDB } from '\.\.\/\.\.\/\.\.\/lib\/db';/g,
      "import dbConnect from '../../../lib/mongodb';\nimport User from '../../../models/User';"
    );
    modified = true;
  }

  // Replace crypto import (not available in edge)
  if (content.includes("import crypto from 'crypto';")) {
    content = content.replace(/import crypto from 'crypto';/g, "import { randomBytes } from 'crypto';");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed ${routePath}`);
  } else {
    console.log(`ℹ️  No changes needed for ${routePath}`);
  }
});

console.log('\n✨ Auth routes fix complete!');
