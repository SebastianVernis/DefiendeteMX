# 🚀 Quick Start Guide - Issue Model

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jest` - Testing framework

### Step 2: Configure Database
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/defiendete-mx
```

### Step 3: Test the Implementation
```bash
npm test
```

---

## 📝 Basic Usage

### Connect to Database
```javascript
import { connectDB } from '@/app/config/database';

await connectDB();
```

### Create an Issue
```javascript
import { createIssue } from '@/app/issues/services/issueService';

const issue = await createIssue({
  title: 'Violencia doméstica',
  description: 'Descripción detallada del incidente...',
  category: 'VIOLENCIA_DOMESTICA',
  user: userId,
  incident: {
    date: new Date(),
    location: {
      city: 'Ciudad de México'
    }
  }
});
```

### Get User's Issues
```javascript
import { getUserIssues } from '@/app/issues/services/issueService';

const issues = await getUserIssues(userId, {
  status: 'EN_PROCESO',
  category: 'VIOLENCIA_DOMESTICA'
});
```

### Update Issue Status
```javascript
import { updateIssueStatus } from '@/app/issues/services/issueService';

await updateIssueStatus(
  issueId,
  'EN_PROCESO',
  userId,
  'Investigation started'
);
```

---

## 🔧 Next.js API Route Example

```javascript
// app/api/issues/route.js
import { connectDB } from '@/app/config/database';
import { createIssue, getUserIssues } from '@/app/issues/services/issueService';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const issue = await createIssue(data);
    return Response.json(issue, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const issues = await getUserIssues(userId);
    return Response.json(issues);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 📚 Available Documentation

1. **ISSUE_MODEL_DOCUMENTATION.md** - Complete API reference
2. **ISSUE_MODEL_README.md** - Detailed implementation guide
3. **IMPLEMENTATION_SUMMARY_ISSUE_6.md** - Project summary

---

## ✅ What You Get

- ✅ Comprehensive Issue model with 50+ fields
- ✅ User authentication model
- ✅ Input validation and sanitization
- ✅ 12 service methods for CRUD operations
- ✅ Automatic risk assessment
- ✅ Status workflow enforcement
- ✅ 50+ unit tests
- ✅ Complete documentation

---

## 🎯 Key Features

### Automatic Risk Assessment
```javascript
await issue.assessRisk();
// Automatically calculates risk level based on multiple factors
```

### Status Workflow
```
NUEVO → EN_PROCESO → RESUELTO → CERRADO → ARCHIVADO
```

### Evidence Management
```javascript
await addEvidenceToIssue(issueId, {
  url: 'https://storage.example.com/evidence.jpg',
  fileType: 'IMAGE',
  description: 'Photo evidence'
}, userId);
```

### Full-Text Search
```javascript
const results = await searchIssues('violencia', userId);
```

---

## 🔒 Security Features

- ✅ Input validation
- ✅ XSS prevention
- ✅ Authorization checks
- ✅ Soft delete
- ✅ Password hashing
- ✅ Audit trail

---

## 📞 Need Help?

1. Check **ISSUE_MODEL_DOCUMENTATION.md** for API details
2. Review test files for usage examples
3. Read inline code comments

---

**Ready to use!** 🎉
