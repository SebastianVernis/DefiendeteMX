#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'app/api/government/reports/[id]/route.js',
    from: "import governmentApiService from '@/app/services/governmentApiService.d1';",
    to: "import governmentApiService from '@/app/services/governmentApiService';"
  },
  {
    file: 'app/api/government/reports/route.js',
    from: "import governmentApiService from '@/app/services/governmentApiService.d1';",
    to: "import governmentApiService from '@/app/services/governmentApiService';"
  },
  {
    file: 'app/api/notifications/emergency/route.js',
    from: "import notificationService from '../../../services/notificationService.d1';",
    to: "import notificationService from '../../../services/notificationService';"
  },
  {
    file: 'app/api/notifications/history/route.js',
    from: "import notificationService from '../../../services/notificationService.d1';",
    to: "import notificationService from '../../../services/notificationService';"
  },
  {
    file: 'app/api/notifications/status/[id]/route.js',
    from: "import notificationService from '../../../../services/notificationService.d1';",
    to: "import notificationService from '../../../../services/notificationService';"
  }
];

replacements.forEach(({ file, from, to }) => {
  const fullPath = path.join(__dirname, file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${file} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(from, to);
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
});

console.log('\n✨ Service imports fixed!');
