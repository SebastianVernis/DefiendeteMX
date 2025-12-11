# 📋 Issue Model Documentation - DefiendeteMX

## Overview

The Issue model is a comprehensive data structure designed for tracking domestic violence and abuse cases in the DefiendeteMX platform. It provides detailed tracking of incidents, evidence, safety assessments, legal proceedings, and support services.

---

## 🗂️ Model Structure

### Core Fields

#### Basic Information
- **title** (String, required): Brief title of the issue (max 200 characters)
- **description** (String, required): Detailed description (max 5000 characters)
- **status** (Enum, required): Current status of the issue
  - Values: `NUEVO`, `EN_PROCESO`, `REQUIERE_ATENCION`, `RESUELTO`, `CERRADO`, `ARCHIVADO`
  - Default: `NUEVO`
- **priority** (Enum, required): Priority level
  - Values: `BAJO`, `MEDIO`, `ALTO`, `EMERGENCIA`, `CRITICO`
  - Default: `MEDIO`
- **category** (Enum, required): Type of violence/abuse
  - Values: `VIOLENCIA_DOMESTICA`, `VIOLENCIA_FISICA`, `VIOLENCIA_PSICOLOGICA`, `VIOLENCIA_SEXUAL`, `VIOLENCIA_ECONOMICA`, `ACOSO`, `ACOSO_LABORAL`, `ACOSO_ESCOLAR`, `ABUSO_SEXUAL`, `DISCRIMINACION`, `AMENAZAS`, `OTRO`
- **subcategory** (String): Additional categorization

#### User Reference
- **user** (ObjectId, required): Reference to User model
  - Indexed for performance

---

### Incident Details

Comprehensive information about the incident:

```javascript
incident: {
  date: Date (required),           // When the incident occurred
  time: String,                     // Time in HH:MM format
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number (-90 to 90),
      longitude: Number (-180 to 180)
    },
    description: String             // e.g., "En la cocina"
  },
  witnesses: [{
    name: String,
    contact: String,
    relationship: String,
    statement: String
  }],
  policeReportFiled: Boolean,
  policeReportNumber: String,
  policeStation: String
}
```

---

### Perpetrator Information

Details about the person who committed the violence:

```javascript
perpetrator: {
  name: String,
  age: Number,
  gender: Enum ['MASCULINO', 'FEMENINO', 'NO_BINARIO', 'DESCONOCIDO'],
  relationship: Enum [
    'PAREJA_ACTUAL', 'EX_PAREJA', 'ESPOSO', 'ESPOSA',
    'NOVIO', 'NOVIA', 'FAMILIAR', 'PADRE', 'MADRE',
    'HERMANO', 'HERMANA', 'HIJO', 'HIJA', 'CONOCIDO',
    'DESCONOCIDO', 'JEFE', 'COMPAÑERO_TRABAJO', 'OTRO'
  ],
  description: String,
  hasWeapons: Boolean,
  weaponDescription: String,
  hasViolenceHistory: Boolean,
  hasSubstanceAbuse: Boolean,
  substanceDetails: String,
  hasRestrainingOrder: Boolean,
  restrainingOrderDetails: String
}
```

---

### Victim Information

Information about the victim and their condition:

```javascript
victim: {
  injuries: [{
    type: Enum ['FISICA', 'PSICOLOGICA', 'SEXUAL', 'ECONOMICA'],
    description: String,
    severity: Enum ['LEVE', 'MODERADA', 'GRAVE', 'CRITICA'],
    requiresMedicalAttention: Boolean
  }],
  medicalAttentionReceived: Boolean,
  medicalFacility: String,
  medicalReportNumber: String,
  psychologicalImpact: Enum ['NINGUNO', 'LEVE', 'MODERADO', 'SEVERO', 'CRITICO'],
  needsImmediateShelter: Boolean,
  hasDependents: Boolean,
  dependentsCount: Number,
  dependentsAges: [Number]
}
```

---

### Safety Assessment

Critical safety evaluation:

```javascript
safetyAssessment: {
  riskLevel: Enum ['BAJO', 'MEDIO', 'ALTO', 'EXTREMO'],
  immediateDanger: Boolean,
  threatsMade: Boolean,
  threatDetails: String,
  escalationPattern: Boolean,
  hasAccessToVictim: Boolean,
  victimFearsForLife: Boolean,
  childrenInvolved: Boolean,
  childrenAtRisk: Boolean,
  safetyPlanCreated: Boolean,
  safetyPlanDetails: String
}
```

**Automatic Risk Assessment**: The model includes an `assessRisk()` method that automatically calculates risk level based on multiple factors.

---

### Evidence Files

Array of evidence documents:

```javascript
evidenceFiles: [{
  url: String (required),
  filename: String,
  fileType: Enum ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER'],
  description: String,
  uploadedAt: Date,
  size: Number,                    // in bytes
  isVerified: Boolean
}]
```

---

### Emergency Contacts

People to contact in case of emergency:

```javascript
emergencyContacts: [{
  name: String (required),
  relationship: String,
  phone: String (required, 10 digits),
  email: String,
  hasBeenNotified: Boolean,
  notifiedAt: Date,
  isPrimary: Boolean
}]
```

---

### Legal Case Information

Tracking legal proceedings:

```javascript
legalCase: {
  caseNumber: String,
  courtName: String,
  lawyerName: String,
  lawyerContact: String,
  lawyerEmail: String,
  prosecutorName: String,
  prosecutorContact: String,
  nextCourtDate: Date,
  restrainingOrderIssued: Boolean,
  restrainingOrderExpires: Date,
  criminalChargesFiled: Boolean,
  chargesDescription: String,
  civilCaseFiled: Boolean,
  civilCaseDetails: String
}
```

---

### Support Services

Services provided to the victim:

```javascript
supportServices: {
  shelterProvided: Boolean,
  shelterName: String,
  counselingProvided: Boolean,
  counselorName: String,
  counselorContact: String,
  legalAidProvided: Boolean,
  legalAidOrganization: String,
  medicalSupportProvided: Boolean,
  financialAssistanceProvided: Boolean,
  otherServices: [String]
}
```

---

### Audit Trail

Complete history of status changes:

```javascript
statusHistory: [{
  status: String,
  changedBy: ObjectId (ref: 'User'),
  changedAt: Date,
  notes: String
}]
```

---

### Notes and Updates

Internal notes and updates:

```javascript
notes: [{
  content: String (required),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  isPrivate: Boolean,
  type: Enum ['GENERAL', 'LEGAL', 'MEDICAL', 'SAFETY', 'FOLLOW_UP']
}]
```

---

### Follow-up Actions

Tasks and actions to be completed:

```javascript
followUpActions: [{
  action: String (required),
  dueDate: Date,
  assignedTo: ObjectId (ref: 'User'),
  completed: Boolean,
  completedAt: Date,
  priority: Enum ['BAJO', 'MEDIO', 'ALTO', 'URGENTE']
}]
```

---

## 🔧 Instance Methods

### addNote(content, userId, type, isPrivate)
Adds a note to the issue.

```javascript
await issue.addNote('Follow-up completed', userId, 'FOLLOW_UP', false);
```

### addEvidence(evidenceData)
Adds evidence file to the issue.

```javascript
await issue.addEvidence({
  url: 'https://storage.example.com/evidence.jpg',
  fileType: 'IMAGE',
  description: 'Photo of injuries'
});
```

### updateStatus(newStatus, userId, notes)
Updates issue status and adds to history.

```javascript
await issue.updateStatus('EN_PROCESO', userId, 'Investigation started');
```

### assessRisk()
Automatically calculates and updates risk level based on various factors.

```javascript
await issue.assessRisk();
// Sets riskLevel and priority based on safety factors
```

### softDelete(userId)
Marks issue as deleted without removing from database.

```javascript
await issue.softDelete(userId);
```

---

## 📊 Static Methods

### findActive()
Returns all non-deleted issues.

```javascript
const activeIssues = await Issue.findActive();
```

### findByUser(userId)
Returns all issues for a specific user.

```javascript
const userIssues = await Issue.findByUser(userId);
```

### findHighPriority()
Returns high priority issues that need attention.

```javascript
const urgentIssues = await Issue.findHighPriority();
```

### findByCategory(category)
Returns issues of a specific category.

```javascript
const domesticViolenceIssues = await Issue.findByCategory('VIOLENCIA_DOMESTICA');
```

### search(query)
Full-text search across issues.

```javascript
const results = await Issue.search('violencia física');
```

---

## 🎯 Virtual Properties

### daysSinceCreation
Calculates days since issue was created.

```javascript
console.log(issue.daysSinceCreation); // e.g., 15
```

### isOverdue
Returns true if issue is not resolved after 30 days.

```javascript
if (issue.isOverdue) {
  // Send reminder
}
```

### evidenceCount
Returns number of evidence files.

```javascript
console.log(issue.evidenceCount); // e.g., 3
```

---

## 🔍 Indexes

The model includes several indexes for optimal query performance:

- `{ user: 1, createdAt: -1 }` - User's issues sorted by date
- `{ status: 1, priority: -1 }` - Status and priority queries
- `{ category: 1 }` - Category filtering
- `{ 'incident.date': -1 }` - Incident date sorting
- `{ 'safetyAssessment.riskLevel': 1 }` - Risk level filtering
- `{ isDeleted: 1, status: 1 }` - Active issues
- Text index on title, description, and notes for search

---

## ✅ Validation Rules

### Required Fields
- title
- description
- category
- user
- incident.date

### Field Constraints
- title: max 200 characters
- description: max 5000 characters
- coordinates: latitude (-90 to 90), longitude (-180 to 180)
- phone numbers: exactly 10 digits
- time: HH:MM format

### Status Transitions
Valid transitions are enforced:
- NUEVO → EN_PROCESO, REQUIERE_ATENCION, ARCHIVADO
- EN_PROCESO → REQUIERE_ATENCION, RESUELTO, ARCHIVADO
- REQUIERE_ATENCION → EN_PROCESO, RESUELTO, ARCHIVADO
- RESUELTO → CERRADO, EN_PROCESO (reopen)
- CERRADO → ARCHIVADO
- ARCHIVADO → (no transitions allowed)

---

## 🔒 Privacy and Security

### Confidentiality
- **confidential** (Boolean, default: true): Marks issue as confidential
- **sharedWith**: Array of users with access permissions

### Soft Delete
Issues are never permanently deleted, only marked as deleted:
- **isDeleted** (Boolean)
- **deletedAt** (Date)
- **deletedBy** (ObjectId)

---

## 📝 Usage Examples

### Creating an Issue

```javascript
import Issue from './models/Issue';
import { createIssue } from './services/issueService';

const issueData = {
  title: 'Violencia doméstica - Caso urgente',
  description: 'Descripción detallada del incidente...',
  category: 'VIOLENCIA_DOMESTICA',
  user: userId,
  incident: {
    date: new Date('2024-12-01'),
    time: '20:30',
    location: {
      city: 'Ciudad de México',
      state: 'CDMX',
      coordinates: {
        latitude: 19.4326,
        longitude: -99.1332
      }
    }
  },
  safetyAssessment: {
    immediateDanger: true,
    threatsMade: true,
    victimFearsForLife: true
  },
  emergencyContacts: [{
    name: 'María García',
    relationship: 'Hermana',
    phone: '5551234567',
    isPrimary: true
  }]
};

const newIssue = await createIssue(issueData);
```

### Updating an Issue

```javascript
import { updateIssue } from './services/issueService';

await updateIssue(issueId, {
  status: 'EN_PROCESO',
  priority: 'ALTO'
}, userId);
```

### Adding Evidence

```javascript
import { addEvidenceToIssue } from './services/issueService';

await addEvidenceToIssue(issueId, {
  url: 'https://storage.example.com/evidence.jpg',
  fileType: 'IMAGE',
  description: 'Fotografía de lesiones',
  size: 1024000
}, userId);
```

### Querying Issues

```javascript
import { getUserIssues, getHighPriorityIssues } from './services/issueService';

// Get user's issues with filters
const issues = await getUserIssues(userId, {
  status: 'EN_PROCESO',
  category: 'VIOLENCIA_DOMESTICA'
});

// Get high priority issues
const urgentIssues = await getHighPriorityIssues({
  category: 'VIOLENCIA_DOMESTICA',
  limit: 10
});
```

---

## 🧪 Testing

Comprehensive unit tests are provided in:
- `/app/issues/__tests__/issue.model.test.js`
- `/app/issues/__tests__/issueValidator.test.js`

Run tests with:
```bash
npm test
```

---

## 🔗 Related Files

- **Model**: `/app/models/Issue.js`
- **Service**: `/app/issues/services/issueService.js`
- **Validator**: `/app/issues/validators/issueValidator.js`
- **Database Config**: `/app/config/database.js`
- **User Model**: `/app/models/User.js`

---

## 📚 Integration Guide

### 1. Database Connection

```javascript
import { connectDB } from './config/database';

// Connect to MongoDB
await connectDB();
```

### 2. Environment Variables

Add to `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/defiendete-mx
```

### 3. API Routes (Next.js)

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

---

## 🚀 Best Practices

1. **Always validate input** using the validator before creating/updating issues
2. **Use soft delete** instead of permanent deletion
3. **Assess risk automatically** after creating or updating safety assessment
4. **Maintain audit trail** by using the updateStatus method
5. **Protect sensitive data** by respecting the confidential flag
6. **Index queries properly** for performance
7. **Populate references** when needed for complete data

---

## 📞 Support

For questions or issues with the Issue model:
1. Review this documentation
2. Check the test files for usage examples
3. Consult the inline code comments
4. Review the validation rules in issueValidator.js

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0  
**Author**: DefiendeteMX Development Team
