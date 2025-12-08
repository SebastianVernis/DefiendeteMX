# 🚀 Quick Start Guide - Issues CRUD API

## GitHub Issue #7 - COMPLETED ✅

This guide helps you quickly get started with the Issues CRUD API.

---

## 📦 What Was Built

A complete RESTful CRUD API for managing domestic violence issues with:
- ✅ 9 API endpoints
- ✅ Full CRUD operations
- ✅ Status workflow management
- ✅ Notes and evidence management
- ✅ Search and statistics
- ✅ Comprehensive tests
- ✅ Complete documentation

---

## 🏃 Quick Start (3 Steps)

### 1. Start MongoDB

```bash
# Option A: Local MongoDB
mongod

# Option B: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Configure Environment

Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/defiendete-mx
```

### 3. Start Development Server

```bash
npm install  # If not already installed
npm run dev
```

Server runs at: `http://localhost:3000`

---

## 🧪 Test the API

### Option 1: Use the Test Script

```bash
./test-api.sh
```

This interactive script tests all endpoints step-by-step.

### Option 2: Manual Testing

#### Create an Issue
```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "description": "Test description",
    "category": "VIOLENCIA_DOMESTICA",
    "user": "USER_ID_HERE",
    "incident": {"date": "2024-12-01"}
  }'
```

#### Get Issues
```bash
curl "http://localhost:3000/api/issues?userId=USER_ID_HERE"
```

#### Update Issue
```bash
curl -X PUT http://localhost:3000/api/issues/ISSUE_ID \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_HERE", "priority": "ALTO"}'
```

---

## 📚 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/issues` | Create issue |
| GET | `/api/issues` | List issues |
| GET | `/api/issues/[id]` | Get single issue |
| PUT | `/api/issues/[id]` | Update issue |
| DELETE | `/api/issues/[id]` | Delete issue |
| PATCH | `/api/issues/[id]/status` | Update status |
| POST | `/api/issues/[id]/notes` | Add note |
| POST | `/api/issues/[id]/evidence` | Add evidence |
| GET | `/api/issues/search` | Search issues |
| GET | `/api/issues/stats` | Get statistics |

---

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

---

## 📖 Documentation

- **API_DOCUMENTATION.md** - Complete API reference
- **IMPLEMENTATION_SUMMARY_ISSUE_7.md** - Implementation details
- **ISSUE_MODEL_DOCUMENTATION.md** - Data model reference
- **test-api.sh** - Interactive testing script

---

## 🎯 Key Features

### CRUD Operations
- ✅ Create issues with comprehensive data
- ✅ Read single or multiple issues
- ✅ Update any issue field
- ✅ Soft delete (preserves data)

### Advanced Features
- ✅ Status workflow validation
- ✅ Notes with types and privacy
- ✅ Evidence file management
- ✅ Full-text search
- ✅ User statistics
- ✅ Filtering by status, category, priority

### Security
- ✅ User authorization
- ✅ Input validation
- ✅ XSS prevention
- ✅ Proper error handling

---

## 🔧 Build & Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## 💡 Usage Example (JavaScript)

```javascript
// Create an issue
const response = await fetch('http://localhost:3000/api/issues', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Violencia doméstica',
    description: 'Descripción detallada',
    category: 'VIOLENCIA_DOMESTICA',
    user: userId,
    incident: { date: new Date() }
  })
});

const { data } = await response.json();
console.log('Created issue:', data);

// Get issues
const issues = await fetch(`http://localhost:3000/api/issues?userId=${userId}`)
  .then(res => res.json());

// Update issue
await fetch(`http://localhost:3000/api/issues/${issueId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId,
    priority: 'ALTO'
  })
});
```

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod` or Docker

### Module Not Found Error
```
Error: Cannot find module '@/app/...'
```
**Solution**: Run `npm install` to install dependencies

### Build Errors
**Solution**: Check that `jsconfig.json` exists and `next.config.js` has API routes enabled

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env.local`)
- [ ] Dev server running (`npm run dev`)
- [ ] API responds to requests
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)

---

## 🎉 Success!

If you can:
1. ✅ Create an issue via API
2. ✅ Retrieve the issue
3. ✅ Update the issue
4. ✅ Delete the issue

Then the CRUD service is working correctly!

---

## 📞 Need Help?

1. Check **API_DOCUMENTATION.md** for detailed API reference
2. Review **IMPLEMENTATION_SUMMARY_ISSUE_7.md** for implementation details
3. Run `./test-api.sh` to see working examples
4. Check test files for usage patterns

---

**Status**: ✅ Complete  
**Date**: December 8, 2025  
**Issue**: #7 - Implementar servicio CRUD para Issues
