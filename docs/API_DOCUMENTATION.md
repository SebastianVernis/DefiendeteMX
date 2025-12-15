# 🔌 API Documentation - DefiendeteMX Issues CRUD Service

## Overview

This document provides complete API reference for the Issues CRUD service. All endpoints follow RESTful conventions and return JSON responses.

**Base URL**: `http://localhost:3000/api` (development)  
**Production URL**: `https://your-domain.com/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Handling](#error-handling)
4. [Endpoints](#endpoints)
   - [Create Issue](#create-issue)
   - [Get Issues List](#get-issues-list)
   - [Get Single Issue](#get-single-issue)
   - [Update Issue](#update-issue)
   - [Update Issue Status](#update-issue-status)
   - [Delete Issue](#delete-issue)
   - [Add Note](#add-note)
   - [Add Evidence](#add-evidence)
   - [Search Issues](#search-issues)
   - [Get Statistics](#get-statistics)

---

## 🔐 Authentication

Currently, the API uses `userId` parameter for authorization. In production, implement proper authentication using:
- JWT tokens
- Session-based authentication
- OAuth 2.0

**Example with JWT** (future implementation):
```http
Authorization: Bearer <your-jwt-token>
```

---

## 📦 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Common Error Messages

- `userId is required` - Missing user ID for authorization
- `Validation failed` - Input validation error
- `Issue not found` - Requested issue doesn't exist
- `Unauthorized access` - User doesn't have permission
- `Invalid status transition` - Status change not allowed

---

## 🛠️ Endpoints

### Create Issue

Create a new issue with comprehensive tracking information.

**Endpoint**: `POST /api/issues`

**Request Body**:
```json
{
  "title": "Violencia doméstica - Caso urgente",
  "description": "Descripción detallada del incidente...",
  "category": "VIOLENCIA_DOMESTICA",
  "user": "user_id_here",
  "incident": {
    "date": "2024-12-01T00:00:00.000Z",
    "time": "20:30",
    "location": {
      "city": "Ciudad de México",
      "state": "CDMX",
      "address": "Calle Principal 123",
      "coordinates": {
        "latitude": 19.4326,
        "longitude": -99.1332
      }
    }
  },
  "safetyAssessment": {
    "immediateDanger": true,
    "threatsMade": true,
    "victimFearsForLife": true
  },
  "emergencyContacts": [
    {
      "name": "María García",
      "relationship": "Hermana",
      "phone": "5551234567",
      "isPrimary": true
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "_id": "issue_id",
    "title": "Violencia doméstica - Caso urgente",
    "status": "NUEVO",
    "priority": "MEDIO",
    "category": "VIOLENCIA_DOMESTICA",
    "safetyAssessment": {
      "riskLevel": "ALTO"
    },
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T10:00:00.000Z"
  }
}
```

**Categories**:
- `VIOLENCIA_DOMESTICA`
- `VIOLENCIA_FISICA`
- `VIOLENCIA_PSICOLOGICA`
- `VIOLENCIA_SEXUAL`
- `VIOLENCIA_ECONOMICA`
- `ACOSO`
- `ACOSO_LABORAL`
- `ACOSO_ESCOLAR`
- `ABUSO_SEXUAL`
- `DISCRIMINACION`
- `AMENAZAS`
- `OTRO`

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "description": "Test description",
    "category": "VIOLENCIA_DOMESTICA",
    "user": "user_id_here",
    "incident": {
      "date": "2024-12-01"
    }
  }'
```

---

### Get Issues List

Retrieve all issues for a user with optional filters.

**Endpoint**: `GET /api/issues`

**Query Parameters**:
- `userId` (required) - User ID
- `status` (optional) - Filter by status
- `category` (optional) - Filter by category
- `priority` (optional) - Filter by priority
- `riskLevel` (optional) - Filter by risk level

**Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "issue_id",
      "title": "Issue Title",
      "status": "NUEVO",
      "priority": "ALTO",
      "category": "VIOLENCIA_DOMESTICA",
      "createdAt": "2024-12-08T10:00:00.000Z",
      "user": {
        "_id": "user_id",
        "fullName": "User Name",
        "email": "user@example.com"
      }
    }
  ]
}
```

**Status Values**:
- `NUEVO` - New issue
- `EN_PROCESO` - In progress
- `REQUIERE_ATENCION` - Requires attention
- `RESUELTO` - Resolved
- `CERRADO` - Closed
- `ARCHIVADO` - Archived

**Priority Values**:
- `BAJO` - Low
- `MEDIO` - Medium
- `ALTO` - High
- `EMERGENCIA` - Emergency
- `CRITICO` - Critical

**cURL Example**:
```bash
# Get all issues for user
curl "http://localhost:3000/api/issues?userId=user_id_here"

# Get issues with filters
curl "http://localhost:3000/api/issues?userId=user_id_here&status=EN_PROCESO&priority=ALTO"
```

---

### Get Single Issue

Retrieve detailed information about a specific issue.

**Endpoint**: `GET /api/issues/:id`

**Query Parameters**:
- `userId` (required) - User ID for authorization

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "issue_id",
    "title": "Issue Title",
    "description": "Detailed description",
    "status": "EN_PROCESO",
    "priority": "ALTO",
    "category": "VIOLENCIA_DOMESTICA",
    "incident": {
      "date": "2024-12-01T00:00:00.000Z",
      "location": {
        "city": "Ciudad de México"
      }
    },
    "safetyAssessment": {
      "riskLevel": "ALTO",
      "immediateDanger": true
    },
    "evidenceFiles": [],
    "notes": [],
    "statusHistory": [
      {
        "status": "NUEVO",
        "changedAt": "2024-12-08T10:00:00.000Z"
      }
    ],
    "user": {
      "_id": "user_id",
      "fullName": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T10:30:00.000Z"
  }
}
```

**cURL Example**:
```bash
curl "http://localhost:3000/api/issues/issue_id_here?userId=user_id_here"
```

---

### Update Issue

Update issue fields (partial update supported).

**Endpoint**: `PUT /api/issues/:id`

**Request Body**:
```json
{
  "userId": "user_id_here",
  "title": "Updated Title",
  "priority": "EMERGENCIA",
  "description": "Updated description",
  "safetyAssessment": {
    "riskLevel": "EXTREMO",
    "immediateDanger": true
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "_id": "issue_id",
    "title": "Updated Title",
    "priority": "EMERGENCIA",
    "updatedAt": "2024-12-08T11:00:00.000Z"
  }
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:3000/api/issues/issue_id_here \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "title": "Updated Title",
    "priority": "ALTO"
  }'
```

---

### Update Issue Status

Update issue status with workflow validation.

**Endpoint**: `PATCH /api/issues/:id/status`

**Request Body**:
```json
{
  "status": "EN_PROCESO",
  "userId": "user_id_here",
  "notes": "Investigation started"
}
```

**Valid Status Transitions**:
- `NUEVO` → `EN_PROCESO`, `REQUIERE_ATENCION`, `ARCHIVADO`
- `EN_PROCESO` → `REQUIERE_ATENCION`, `RESUELTO`, `ARCHIVADO`
- `REQUIERE_ATENCION` → `EN_PROCESO`, `RESUELTO`, `ARCHIVADO`
- `RESUELTO` → `CERRADO`, `EN_PROCESO` (reopen)
- `CERRADO` → `ARCHIVADO`
- `ARCHIVADO` → (no transitions allowed)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Issue status updated successfully",
  "data": {
    "_id": "issue_id",
    "status": "EN_PROCESO",
    "statusHistory": [
      {
        "status": "EN_PROCESO",
        "changedBy": "user_id",
        "changedAt": "2024-12-08T11:00:00.000Z",
        "notes": "Investigation started"
      }
    ]
  }
}
```

**cURL Example**:
```bash
curl -X PATCH http://localhost:3000/api/issues/issue_id_here/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "EN_PROCESO",
    "userId": "user_id_here",
    "notes": "Starting investigation"
  }'
```

---

### Delete Issue

Soft delete an issue (marks as deleted, doesn't remove from database).

**Endpoint**: `DELETE /api/issues/:id`

**Query Parameters**:
- `userId` (required) - User ID for authorization

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Issue deleted successfully",
  "data": {
    "_id": "issue_id",
    "isDeleted": true,
    "deletedAt": "2024-12-08T12:00:00.000Z",
    "deletedBy": "user_id"
  }
}
```

**cURL Example**:
```bash
curl -X DELETE "http://localhost:3000/api/issues/issue_id_here?userId=user_id_here"
```

---

### Add Note

Add a note to an issue.

**Endpoint**: `POST /api/issues/:id/notes`

**Request Body**:
```json
{
  "content": "Follow-up completed with victim",
  "userId": "user_id_here",
  "type": "FOLLOW_UP",
  "isPrivate": false
}
```

**Note Types**:
- `GENERAL` - General note
- `LEGAL` - Legal information
- `MEDICAL` - Medical information
- `SAFETY` - Safety-related
- `FOLLOW_UP` - Follow-up action

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    "_id": "issue_id",
    "notes": [
      {
        "content": "Follow-up completed with victim",
        "createdBy": "user_id",
        "createdAt": "2024-12-08T12:00:00.000Z",
        "type": "FOLLOW_UP",
        "isPrivate": false
      }
    ]
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/issues/issue_id_here/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test note",
    "userId": "user_id_here",
    "type": "GENERAL"
  }'
```

---

### Add Evidence

Add evidence file to an issue.

**Endpoint**: `POST /api/issues/:id/evidence`

**Request Body**:
```json
{
  "url": "https://storage.example.com/evidence.jpg",
  "filename": "evidence.jpg",
  "fileType": "IMAGE",
  "description": "Photo of injuries",
  "size": 1024000,
  "userId": "user_id_here"
}
```

**File Types**:
- `IMAGE` - Image file
- `VIDEO` - Video file
- `AUDIO` - Audio file
- `DOCUMENT` - Document file
- `OTHER` - Other file type

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Evidence added successfully",
  "data": {
    "_id": "issue_id",
    "evidenceFiles": [
      {
        "url": "https://storage.example.com/evidence.jpg",
        "filename": "evidence.jpg",
        "fileType": "IMAGE",
        "description": "Photo of injuries",
        "size": 1024000,
        "uploadedAt": "2024-12-08T12:00:00.000Z",
        "isVerified": false
      }
    ]
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/issues/issue_id_here/evidence \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/evidence.jpg",
    "fileType": "IMAGE",
    "description": "Evidence photo",
    "userId": "user_id_here"
  }'
```

---

### Search Issues

Search issues using full-text search.

**Endpoint**: `GET /api/issues/search`

**Query Parameters**:
- `q` (required) - Search query
- `userId` (optional) - Filter by user

**Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "query": "violencia",
  "data": [
    {
      "_id": "issue_id",
      "title": "Violencia doméstica",
      "description": "...",
      "category": "VIOLENCIA_DOMESTICA",
      "user": {
        "_id": "user_id",
        "fullName": "User Name"
      }
    }
  ]
}
```

**cURL Example**:
```bash
# Search all issues
curl "http://localhost:3000/api/issues/search?q=violencia"

# Search user's issues
curl "http://localhost:3000/api/issues/search?q=violencia&userId=user_id_here"
```

---

### Get Statistics

Get issue statistics for a user.

**Endpoint**: `GET /api/issues/stats`

**Query Parameters**:
- `userId` (required) - User ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "total": 15,
    "nuevo": 3,
    "enProceso": 5,
    "resuelto": 7,
    "highPriority": 2
  }
}
```

**cURL Example**:
```bash
curl "http://localhost:3000/api/issues/stats?userId=user_id_here"
```

---

## 📊 Complete CRUD Workflow Example

### 1. Create an Issue

```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Violencia física",
    "description": "Incidente de violencia física",
    "category": "VIOLENCIA_FISICA",
    "user": "675569a1234567890abcdef0",
    "incident": {
      "date": "2024-12-01"
    }
  }'
```

Response: `{ "success": true, "data": { "_id": "issue_123", ... } }`

### 2. Get the Issue

```bash
curl "http://localhost:3000/api/issues/issue_123?userId=675569a1234567890abcdef0"
```

### 3. Update the Issue

```bash
curl -X PUT http://localhost:3000/api/issues/issue_123 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "675569a1234567890abcdef0",
    "priority": "ALTO"
  }'
```

### 4. Update Status

```bash
curl -X PATCH http://localhost:3000/api/issues/issue_123/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "EN_PROCESO",
    "userId": "675569a1234567890abcdef0",
    "notes": "Investigation started"
  }'
```

### 5. Add a Note

```bash
curl -X POST http://localhost:3000/api/issues/issue_123/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Contacted victim",
    "userId": "675569a1234567890abcdef0",
    "type": "FOLLOW_UP"
  }'
```

### 6. Add Evidence

```bash
curl -X POST http://localhost:3000/api/issues/issue_123/evidence \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/evidence.jpg",
    "fileType": "IMAGE",
    "userId": "675569a1234567890abcdef0"
  }'
```

### 7. Search Issues

```bash
curl "http://localhost:3000/api/issues/search?q=violencia&userId=675569a1234567890abcdef0"
```

### 8. Get Statistics

```bash
curl "http://localhost:3000/api/issues/stats?userId=675569a1234567890abcdef0"
```

### 9. Delete the Issue

```bash
curl -X DELETE "http://localhost:3000/api/issues/issue_123?userId=675569a1234567890abcdef0"
```

---

## 🔒 Security Best Practices

1. **Authentication**: Implement JWT or session-based authentication
2. **Authorization**: Verify user permissions before operations
3. **Input Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure CORS properly for your domain
7. **Logging**: Log all API requests for audit trail
8. **Error Messages**: Don't expose sensitive information in errors

---

## 📝 Integration Examples

### JavaScript/Fetch

```javascript
// Create issue
const createIssue = async (issueData) => {
  const response = await fetch('http://localhost:3000/api/issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(issueData)
  });
  
  const data = await response.json();
  return data;
};

// Get issues
const getIssues = async (userId) => {
  const response = await fetch(`http://localhost:3000/api/issues?userId=${userId}`);
  const data = await response.json();
  return data;
};
```

### React Hook

```javascript
import { useState, useEffect } from 'react';

function useIssues(userId) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`/api/issues?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setIssues(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userId]);

  return { issues, loading, error };
}
```

---

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run specific test file
npm test issueService.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

---

## 📚 Additional Resources

- [Issue Model Documentation](./ISSUE_MODEL_DOCUMENTATION.md)
- [Issue Model README](./ISSUE_MODEL_README.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

---

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review test files for examples
3. Check the service layer implementation
4. Consult the Issue model documentation

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0  
**API Version**: v1
