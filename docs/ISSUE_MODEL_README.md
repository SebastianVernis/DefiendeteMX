# 🛡️ Issue Model Implementation - GitHub Issue #6

## ✅ Implementation Complete

This document summarizes the implementation of the comprehensive Issue model for tracking domestic violence cases in the DefiendeteMX platform.

---

## 📦 What Was Implemented

### 1. Database Configuration (`app/config/database.js`)
- MongoDB connection utility with connection pooling
- Error handling and reconnection logic
- Connection status tracking
- Middleware for Next.js API routes

### 2. User Model (`app/models/User.js`)
- Complete user authentication model
- Password hashing with bcrypt
- Emergency contacts support
- Premium status tracking
- Account security (login attempts, account locking)
- Soft delete functionality
- Virtual properties and instance methods

### 3. Enhanced Issue Model (`app/models/Issue.js`)
Comprehensive violence tracking with:
- **Basic Information**: Title, description, status, priority, category
- **Incident Details**: Date, time, location, witnesses, police reports
- **Perpetrator Information**: Demographics, relationship, weapons, history
- **Victim Information**: Injuries, medical attention, psychological impact
- **Safety Assessment**: Risk level, immediate danger, threats, safety plan
- **Evidence Management**: Multiple file types with metadata
- **Emergency Contacts**: Contact information and notification tracking
- **Legal Case Tracking**: Case numbers, lawyers, court dates, orders
- **Support Services**: Shelter, counseling, legal aid, medical support
- **Audit Trail**: Complete status history with timestamps
- **Notes System**: Internal notes with privacy controls
- **Follow-up Actions**: Task management with assignments

### 4. Validation System (`app/issues/validators/issueValidator.js`)
- Input validation for create and update operations
- Status transition validation
- Safety assessment validation
- Data sanitization (XSS prevention)
- Phone number and coordinate validation
- Comprehensive error messages

### 5. Enhanced Service Layer (`app/issues/services/issueService.js`)
- `createIssue()` - Create with validation and risk assessment
- `getIssueById()` - Retrieve with authorization check
- `updateIssue()` - Update with validation
- `updateIssueStatus()` - Status transitions with history
- `getUserIssues()` - Query with filters
- `getHighPriorityIssues()` - Admin/moderator view
- `addNoteToIssue()` - Add notes
- `addEvidenceToIssue()` - Add evidence files
- `searchIssues()` - Full-text search
- `getIssuesByCategory()` - Category filtering
- `deleteIssue()` - Soft delete
- `getUserIssueStats()` - Statistics aggregation

### 6. Unit Tests
- **Model Tests** (`app/issues/__tests__/issue.model.test.js`)
  - Schema validation tests
  - Virtual properties tests
  - Instance methods tests
  - Static methods tests
  - Pre-save hooks tests
  
- **Validator Tests** (`app/issues/__tests__/issueValidator.test.js`)
  - Create validation tests
  - Update validation tests
  - Status transition tests
  - Safety assessment tests
  - Data sanitization tests

### 7. Documentation
- **ISSUE_MODEL_DOCUMENTATION.md** - Complete API reference
- **ISSUE_MODEL_README.md** - Implementation summary (this file)
- Inline code comments throughout

---

## 🗂️ File Structure

```
/vercel/sandbox/
├── app/
│   ├── config/
│   │   └── database.js                    ✅ NEW - MongoDB connection
│   ├── models/
│   │   ├── User.js                        ✅ NEW - User model
│   │   └── Issue.js                       ✅ NEW - Enhanced Issue model
│   └── issues/
│       ├── models/
│       │   └── Issue.js                   ⚠️  DEPRECATED - Use app/models/Issue.js
│       ├── services/
│       │   └── issueService.js            ✅ ENHANCED - Full CRUD operations
│       ├── validators/
│       │   └── issueValidator.js          ✅ NEW - Input validation
│       └── __tests__/
│           ├── issue.model.test.js        ✅ NEW - Model tests
│           └── issueValidator.test.js     ✅ NEW - Validator tests
├── .env.example                           ✅ NEW - Environment template
├── package.json                           ✅ UPDATED - Added dependencies
├── ISSUE_MODEL_DOCUMENTATION.md           ✅ NEW - Complete documentation
└── ISSUE_MODEL_README.md                  ✅ NEW - This file
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jest` - Testing framework
- `@testing-library/react` - React testing utilities

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/defiendete-mx
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Test the Implementation

Run unit tests:

```bash
npm test
```

### 5. Use in Your Application

```javascript
// In your API route or server component
import { connectDB } from '@/app/config/database';
import { createIssue, getUserIssues } from '@/app/issues/services/issueService';

// Connect to database
await connectDB();

// Create an issue
const newIssue = await createIssue({
  title: 'Violencia doméstica',
  description: 'Descripción detallada...',
  category: 'VIOLENCIA_DOMESTICA',
  user: userId,
  incident: {
    date: new Date(),
    location: {
      city: 'Ciudad de México'
    }
  }
});

// Get user's issues
const issues = await getUserIssues(userId);
```

---

## 🎯 Key Features

### 1. Comprehensive Data Model
- 50+ fields covering all aspects of violence tracking
- Nested objects for complex data structures
- Array fields for multiple items (evidence, contacts, notes)

### 2. Automatic Risk Assessment
The model includes intelligent risk assessment:

```javascript
await issue.assessRisk();
// Automatically calculates risk level based on:
// - Immediate danger
// - Threats made
// - Escalation pattern
// - Victim fears for life
// - Children at risk
// - Perpetrator has weapons
// - Violence history
// - Need for immediate shelter
```

### 3. Status Workflow
Enforced status transitions prevent invalid state changes:

```
NUEVO → EN_PROCESO → RESUELTO → CERRADO → ARCHIVADO
         ↓              ↑
    REQUIERE_ATENCION ──┘
```

### 4. Audit Trail
Every status change is recorded with:
- Who made the change
- When it was made
- Optional notes

### 5. Privacy & Security
- Confidential flag for sensitive cases
- Soft delete (never permanently remove data)
- Shared access with granular permissions
- Input sanitization to prevent XSS

### 6. Search & Filtering
- Full-text search across title, description, and notes
- Filter by status, category, priority, risk level
- Sort by date, priority, or relevance

---

## 📊 Database Indexes

Optimized for common queries:

```javascript
// Single field indexes
{ user: 1, createdAt: -1 }
{ status: 1, priority: -1 }
{ category: 1 }
{ 'incident.date': -1 }
{ 'safetyAssessment.riskLevel': 1 }
{ isDeleted: 1, status: 1 }

// Compound indexes
{ user: 1, status: 1, isDeleted: 1 }
{ category: 1, priority: -1, createdAt: -1 }

// Text index for search
{ title: 'text', description: 'text', 'notes.content': 'text' }
```

---

## ✅ Validation Rules

### Required Fields
- ✅ title (max 200 chars)
- ✅ description (max 5000 chars)
- ✅ category (from enum)
- ✅ user (ObjectId reference)
- ✅ incident.date (not in future)

### Optional but Validated
- Phone numbers: exactly 10 digits
- Coordinates: latitude (-90 to 90), longitude (-180 to 180)
- Time: HH:MM format
- Email: valid email format

### Business Rules
- Status transitions must follow workflow
- Immediate danger requires HIGH or EXTREMO risk level
- Evidence files must have valid URLs
- Emergency contacts must have name and phone

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test issue.model.test.js
```

### Watch Mode
```bash
npm run test:watch
```

### Test Coverage
- ✅ Schema validation (10+ tests)
- ✅ Virtual properties (4 tests)
- ✅ Instance methods (6 tests)
- ✅ Static methods (4 tests)
- ✅ Pre-save hooks (2 tests)
- ✅ Input validation (15+ tests)
- ✅ Status transitions (6 tests)
- ✅ Data sanitization (4 tests)

---

## 📚 API Examples

### Create Issue
```javascript
const issue = await createIssue({
  title: 'Violencia física',
  description: 'Descripción del incidente...',
  category: 'VIOLENCIA_FISICA',
  user: userId,
  incident: {
    date: new Date('2024-12-01'),
    time: '20:30',
    location: {
      city: 'Ciudad de México',
      coordinates: {
        latitude: 19.4326,
        longitude: -99.1332
      }
    }
  },
  safetyAssessment: {
    immediateDanger: true,
    riskLevel: 'ALTO'
  }
});
```

### Update Status
```javascript
await updateIssueStatus(
  issueId,
  'EN_PROCESO',
  userId,
  'Investigation started'
);
```

### Add Evidence
```javascript
await addEvidenceToIssue(issueId, {
  url: 'https://storage.example.com/evidence.jpg',
  fileType: 'IMAGE',
  description: 'Photo of injuries',
  size: 1024000
}, userId);
```

### Search Issues
```javascript
const results = await searchIssues('violencia', userId);
```

### Get Statistics
```javascript
const stats = await getUserIssueStats(userId);
// Returns: { total, nuevo, enProceso, resuelto, highPriority }
```

---

## 🔒 Security Considerations

1. **Input Validation**: All inputs are validated before database operations
2. **XSS Prevention**: HTML/script tags are stripped from user input
3. **Authorization**: Users can only access their own issues (unless shared)
4. **Soft Delete**: Data is never permanently deleted
5. **Password Hashing**: User passwords are hashed with bcrypt
6. **Confidentiality**: Sensitive cases are marked as confidential

---

## 🚧 Future Enhancements

Potential improvements for future versions:

- [ ] Real-time notifications for status changes
- [ ] File upload integration with cloud storage (Cloudinary, S3)
- [ ] Email notifications for emergency contacts
- [ ] PDF report generation
- [ ] Integration with legal case management systems
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration
- [ ] Geofencing for safety zones
- [ ] Integration with emergency services (911)

---

## 📞 Integration Points

### Next.js API Routes

Create API routes to expose the service methods:

```javascript
// app/api/issues/route.js
import { connectDB } from '@/app/config/database';
import { createIssue, getUserIssues } from '@/app/issues/services/issueService';

export async function POST(request) {
  await connectDB();
  const data = await request.json();
  const issue = await createIssue(data);
  return Response.json(issue);
}

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const issues = await getUserIssues(userId);
  return Response.json(issues);
}
```

### Frontend Components

Use the API in your React components:

```javascript
// app/components/IssueForm.jsx
'use client';

import { useState } from 'react';

export default function IssueForm({ userId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'VIOLENCIA_DOMESTICA'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        user: userId,
        incident: { date: new Date() }
      })
    });
    
    const issue = await response.json();
    console.log('Created issue:', issue);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 📖 Documentation

Complete documentation is available in:

- **ISSUE_MODEL_DOCUMENTATION.md** - Full API reference with examples
- **Inline comments** - Detailed JSDoc comments in all files
- **Test files** - Usage examples in test cases

---

## ✅ Acceptance Criteria Met

- ✅ **Implementación completa**: All models, services, and validators implemented
- ✅ **Código funcional**: Fully functional with comprehensive error handling
- ✅ **Documentación actualizada**: Complete documentation provided
- ✅ **Pruebas unitarias**: Comprehensive test suite included
- ✅ **Integración con arquitectura existente**: Follows Next.js 14 patterns

---

## 🎉 Summary

The Issue model implementation provides a production-ready, comprehensive solution for tracking domestic violence cases. It includes:

- ✅ 50+ fields covering all aspects of violence tracking
- ✅ Automatic risk assessment
- ✅ Complete audit trail
- ✅ Evidence management
- ✅ Legal case tracking
- ✅ Support services tracking
- ✅ Input validation and sanitization
- ✅ Comprehensive test coverage
- ✅ Full documentation
- ✅ Security best practices

The implementation is ready for integration into the DefiendeteMX platform and can be extended as needed for future requirements.

---

**Status**: ✅ Complete  
**Priority**: Alta  
**Date**: December 8, 2025  
**Issue**: #6 - Diseñar modelo de datos para Issues
