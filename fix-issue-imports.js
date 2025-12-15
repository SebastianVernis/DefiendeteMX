#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  'app/api/issues/[id]/evidence/route.js',
  'app/api/issues/[id]/notes/route.js',
  'app/api/issues/[id]/route.js',
  'app/api/issues/[id]/status/route.js',
  'app/api/issues/route.js',
  'app/api/issues/search/route.js',
  'app/api/issues/stats/route.js'
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace issueService.d1 with issueService
  content = content.replace(
    /from ['"]@\/app\/issues\/services\/issueService\.d1['"]/g,
    "from '@/app/issues/services/issueService'"
  );
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Fixed ${filePath}`);
});

console.log('\n✨ Issue service imports fixed!');
