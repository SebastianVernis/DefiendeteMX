# 🏛️ Government API Integration Documentation - DefiendeteMX

## Overview

This document provides comprehensive documentation for the Government API Integration feature in DefiendeteMX. This system enables users to create, manage, and submit reports to Mexican government authorities including FGR (Fiscalía General de la República), Policía, and emergency services.

**Base URL**: `http://localhost:3000/api/government` (development)  
**Production URL**: `https://your-domain.com/api/government`

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Important Notice](#important-notice)
3. [Architecture](#architecture)
4. [Models](#models)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)
7. [Report Types and Entities](#report-types-and-entities)
8. [Export Formats](#export-formats)
9. [Manual Submission Instructions](#manual-submission-instructions)
10. [Security and Privacy](#security-and-privacy)
11. [Testing](#testing)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 Introduction

The Government API Integration feature allows DefiendeteMX users to:

- Create standardized reports from existing issues
- Format reports according to government requirements
- Track submission status and government responses
- Export reports in multiple formats (JSON, PDF, XML)
- Maintain audit trails for all report activities
- Prepare reports for manual or automated submission

---

## ⚠️ Important Notice

**As of December 2025**, no public APIs exist for direct submission to Mexican government authorities (FGR, Policía, etc.). This implementation provides:

1. **Standardized Report Formatting**: Reports are formatted according to expected government standards
2. **Export Functionality**: Reports can be exported for manual submission via official channels
3. **Future-Ready Architecture**: The system is designed to integrate with official APIs when they become available
4. **Manual Submission Support**: Clear instructions for submitting reports through official channels

### Official Submission Channels

- **FGR**: https://www.fgr.org.mx/denuncia or call 800-00-85-400
- **Emergency Services**: Call 911
- **Anonymous Reports**: Call 089
- **Federal Police**: Call 088

---

## 🏗️ Architecture

### Components

1. **GovernmentReport Model** (`app/models/GovernmentReport.js`)
   - Mongoose schema for government reports
   - Tracks report lifecycle and status
   - Links to original Issues

2. **Government API Service** (`app/services/governmentApiService.js`)
   - Business logic for report management
   - Report generation and formatting
   - Export functionality
   - Submission handling

3. **API Endpoints** (`app/api/government/reports/`)
   - RESTful endpoints for CRUD operations
   - Submit and export endpoints
   - Statistics endpoint

### Data Flow

```
Issue → Create Report → Format Data → Submit/Export → Track Status → Government Response
```

---

## 📊 Models

### GovernmentReport Schema

```javascript
{
  reportNumber: String,           // Auto-generated unique identifier
  reportType: String,             // Type of report (FGR_DENUNCIA, etc.)
  targetEntity: String,           // Government entity (FGR, POLICIA_FEDERAL, etc.)
  issue: ObjectId,                // Reference to original Issue
  user: ObjectId,                 // User who created the report
  status: String,                 // Report status (BORRADOR, ENVIADO, etc.)
  
  reportData: {
    victim: { ... },              // Victim information
    incident: { ... },            // Incident details
    perpetrator: { ... },         // Perpetrator information
    witnesses: [ ... ],           // Witness information
    evidenceFiles: [ ... ]        // Evidence references
  },
  
  submission: {
    submittedAt: Date,
    confirmationNumber: String,
    submissionMethod: String
  },
  
  governmentResponse: {
    caseNumber: String,           // Official case number
    assignedOfficer: String,
    statusUpdates: [ ... ]
  },
  
  auditLog: [ ... ],              // Complete audit trail
  exports: [ ... ]                // Export history
}
```

### Report Status Values

- `BORRADOR` - Draft (editable)
- `PENDIENTE` - Pending submission
- `ENVIADO` - Submitted to authority
- `RECIBIDO` - Acknowledged by authority
- `EN_PROCESO` - In progress
- `REQUIERE_INFO` - Requires additional information
- `RESUELTO` - Resolved
- `CERRADO` - Closed
- `RECHAZADO` - Rejected

---

## 🔌 API Endpoints

### 1. Create Government Report

**Endpoint**: `POST /api/government/reports`

Create a new government report from an existing issue.

**Request Body**:
```json
{
  "issueId": "675569a1234567890abcdef0",
  "userId": "675569a1234567890abcdef1",
  "reportType": "FGR_DENUNCIA",
  "targetEntity": "FGR",
  "additionalData": {
    "victimAge": 30,
    "victimGender": "FEMENINO",
    "additionalInfo": "Additional context..."
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Government report created successfully",
  "data": {
    "_id": "report_id",
    "reportNumber": "RPT-FGR-1733702400000-123",
    "reportType": "FGR_DENUNCIA",
    "targetEntity": "FGR",
    "status": "BORRADOR",
    "priority": "ALTO",
    "createdAt": "2024-12-08T10:00:00.000Z"
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/government/reports \
  -H "Content-Type: application/json" \
  -d '{
    "issueId": "675569a1234567890abcdef0",
    "userId": "675569a1234567890abcdef1",
    "reportType": "FGR_DENUNCIA",
    "targetEntity": "FGR"
  }'
```

---

### 2. Get Reports List

**Endpoint**: `GET /api/government/reports`

Retrieve all government reports for a user with optional filters.

**Query Parameters**:
- `userId` (required) - User ID
- `status` (optional) - Filter by status
- `targetEntity` (optional) - Filter by entity
- `reportType` (optional) - Filter by type

**Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "report_id",
      "reportNumber": "RPT-FGR-123",
      "reportType": "FGR_DENUNCIA",
      "targetEntity": "FGR",
      "status": "ENVIADO",
      "priority": "ALTO",
      "createdAt": "2024-12-08T10:00:00.000Z",
      "issue": { ... },
      "user": { ... }
    }
  ]
}
```

**cURL Example**:
```bash
# Get all reports
curl "http://localhost:3000/api/government/reports?userId=user_id"

# Get reports with filters
curl "http://localhost:3000/api/government/reports?userId=user_id&status=ENVIADO&targetEntity=FGR"
```

---

### 3. Get Single Report

**Endpoint**: `GET /api/government/reports/:id`

Retrieve detailed information about a specific report.

**Query Parameters**:
- `userId` (required) - User ID for authorization

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "report_id",
    "reportNumber": "RPT-FGR-123",
    "reportType": "FGR_DENUNCIA",
    "targetEntity": "FGR",
    "status": "ENVIADO",
    "reportData": {
      "victim": { ... },
      "incident": { ... },
      "perpetrator": { ... }
    },
    "submission": {
      "submittedAt": "2024-12-08T12:00:00.000Z",
      "confirmationNumber": "CONF-FGR-123456"
    },
    "auditLog": [ ... ]
  }
}
```

**cURL Example**:
```bash
curl "http://localhost:3000/api/government/reports/report_id?userId=user_id"
```

---

### 4. Update Report

**Endpoint**: `PUT /api/government/reports/:id`

Update report data (only for draft or pending reports).

**Request Body**:
```json
{
  "userId": "user_id",
  "reportData": {
    "victim": {
      "age": 32
    }
  },
  "priority": "EMERGENCIA",
  "notes": "Updated with additional information"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Government report updated successfully",
  "data": { ... }
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:3000/api/government/reports/report_id \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "priority": "EMERGENCIA"
  }'
```

---

### 5. Submit Report

**Endpoint**: `POST /api/government/reports/:id/submit`

Submit a report to government authorities.

**Request Body**:
```json
{
  "userId": "user_id",
  "method": "MANUAL",
  "additionalData": {
    "notes": "Submitted via web form"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "reportId": "report_id",
    "reportNumber": "RPT-FGR-123",
    "confirmationNumber": "CONF-FGR-1733702400000-1234",
    "submittedAt": "2024-12-08T12:00:00.000Z",
    "status": "ENVIADO"
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/government/reports/report_id/submit \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "method": "MANUAL"
  }'
```

---

### 6. Export Report

**Endpoint**: `GET /api/government/reports/:id/export`

Export a report in specified format.

**Query Parameters**:
- `userId` (required) - User ID
- `format` (optional) - Export format (JSON, PDF, XML) - default: JSON
- `purpose` (optional) - Purpose of export

**Response** (200 OK):
```json
{
  "success": true,
  "format": "JSON",
  "data": {
    "reportNumber": "RPT-FGR-123",
    "reportType": "FGR_DENUNCIA",
    "victim": { ... },
    "incident": { ... },
    "metadata": {
      "exportedAt": "2024-12-08T12:00:00.000Z"
    }
  }
}
```

**cURL Examples**:
```bash
# Export as JSON
curl "http://localhost:3000/api/government/reports/report_id/export?userId=user_id&format=JSON"

# Export as PDF
curl "http://localhost:3000/api/government/reports/report_id/export?userId=user_id&format=PDF"

# Export as XML
curl "http://localhost:3000/api/government/reports/report_id/export?userId=user_id&format=XML"
```

---

### 7. Delete Report

**Endpoint**: `DELETE /api/government/reports/:id`

Soft delete a report (only draft or pending reports).

**Query Parameters**:
- `userId` (required) - User ID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

**cURL Example**:
```bash
curl -X DELETE "http://localhost:3000/api/government/reports/report_id?userId=user_id"
```

---

### 8. Get Statistics

**Endpoint**: `GET /api/government/reports/stats`

Get statistics for user's government reports.

**Query Parameters**:
- `userId` (required) - User ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "total": 15,
    "byStatus": {
      "BORRADOR": 2,
      "ENVIADO": 8,
      "RESUELTO": 5
    },
    "byEntity": {
      "FGR": 10,
      "POLICIA_FEDERAL": 3,
      "EMERGENCIAS_911": 2
    },
    "byType": {
      "FGR_DENUNCIA": 10,
      "POLICIA_REPORTE": 5
    },
    "submitted": 8,
    "pending": 2,
    "resolved": 5
  }
}
```

**cURL Example**:
```bash
curl "http://localhost:3000/api/government/reports/stats?userId=user_id"
```

---

## 💡 Usage Examples

### Complete Workflow Example

```bash
# 1. Create a report from an existing issue
REPORT_ID=$(curl -X POST http://localhost:3000/api/government/reports \
  -H "Content-Type: application/json" \
  -d '{
    "issueId": "issue_123",
    "userId": "user_123",
    "reportType": "FGR_DENUNCIA",
    "targetEntity": "FGR"
  }' | jq -r '.data._id')

# 2. Get the report details
curl "http://localhost:3000/api/government/reports/$REPORT_ID?userId=user_123"

# 3. Update report if needed
curl -X PUT http://localhost:3000/api/government/reports/$REPORT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "priority": "EMERGENCIA"
  }'

# 4. Export report for review
curl "http://localhost:3000/api/government/reports/$REPORT_ID/export?userId=user_123&format=PDF" \
  > report.txt

# 5. Submit the report
curl -X POST http://localhost:3000/api/government/reports/$REPORT_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "method": "MANUAL"
  }'

# 6. Check statistics
curl "http://localhost:3000/api/government/reports/stats?userId=user_123"
```

---

## 📝 Report Types and Entities

### Report Types

| Type | Description |
|------|-------------|
| `FGR_DENUNCIA` | FGR Crime Report |
| `POLICIA_REPORTE` | Police Report |
| `EMERGENCIA_911` | Emergency 911 Report |
| `DENUNCIA_ANONIMA` | Anonymous Report |
| `VIOLENCIA_DOMESTICA` | Domestic Violence Report |
| `DESAPARICION` | Missing Person Report |
| `OTRO` | Other |

### Target Entities

| Entity | Description | Contact |
|--------|-------------|---------|
| `FGR` | Fiscalía General de la República | 800-00-85-400 |
| `POLICIA_FEDERAL` | Federal Police | 088 |
| `POLICIA_ESTATAL` | State Police | Varies by state |
| `POLICIA_MUNICIPAL` | Municipal Police | Varies by municipality |
| `GUARDIA_NACIONAL` | National Guard | 088 |
| `EMERGENCIAS_911` | Emergency Services | 911 |
| `CNDH` | Comisión Nacional de Derechos Humanos | www.cndh.org.mx |

---

## 📄 Export Formats

### JSON Format

Structured data format suitable for:
- API integrations
- Data analysis
- Backup and archival
- System-to-system communication

### PDF Format

Human-readable document format suitable for:
- Manual submission
- Printing
- Email attachments
- Official documentation

**Note**: Current implementation returns formatted text. In production, use a PDF library like `pdfkit` or `puppeteer` for actual PDF generation.

### XML Format

Structured markup format suitable for:
- Legacy system integration
- Government system compatibility
- Data exchange standards

---

## 📋 Manual Submission Instructions

### FGR (Fiscalía General de la República)

**Method**: Web Form or Phone

**Steps**:
1. Visit https://www.fgr.org.mx/denuncia or call 800-00-85-400
2. Provide the incident details from the exported report
3. Request a case number for tracking
4. Update the report in DefiendeteMX with the case number received

**Required Information**:
- Victim information
- Incident date, time, and location
- Detailed description
- Perpetrator information (if known)
- Evidence references

### Emergency Services (911)

**Method**: Emergency Phone

**Steps**:
1. Call 911 for immediate emergencies
2. Provide location and incident details
3. Follow dispatcher instructions
4. Request incident number for records

**When to Use**:
- Immediate danger situations
- Active crimes in progress
- Medical emergencies
- Fire emergencies

### Anonymous Reports (089)

**Method**: Anonymous Hotline

**Steps**:
1. Call 089 for anonymous reporting
2. Provide incident details anonymously
3. No personal information required

**When to Use**:
- Fear of retaliation
- Witness protection concerns
- Sensitive information

---

## 🔒 Security and Privacy

### Data Protection

1. **Encryption**: All sensitive data should be encrypted at rest and in transit
2. **Access Control**: Reports are only accessible by the creating user
3. **Audit Trail**: Complete audit log of all report activities
4. **Confidentiality**: Reports marked as confidential by default
5. **INAI Compliance**: Follows Mexican data protection laws

### Best Practices

1. **Never share API credentials** in code or version control
2. **Use HTTPS** in production for all API calls
3. **Implement rate limiting** to prevent abuse
4. **Validate all inputs** before processing
5. **Log all access attempts** for security monitoring
6. **Regular security audits** of the system

### Privacy Considerations

- Personal data is only shared with authorized government entities
- Users control when and how reports are submitted
- Export functionality allows users to review data before submission
- Soft delete preserves audit trail while removing from active use

---

## 🧪 Testing

### Unit Tests

Run unit tests for the government service:

```bash
npm test -- governmentApiService.test.js
```

### Integration Tests

Run integration tests for API endpoints:

```bash
npm test -- app/api/government/reports/__tests__
```

### Manual Testing

Use the provided cURL examples to test each endpoint manually.

### Test Data

Create test issues first, then create reports from those issues:

```bash
# Create test issue
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "description": "Test description",
    "category": "VIOLENCIA_DOMESTICA",
    "user": "user_id",
    "incident": {
      "date": "2024-12-01",
      "location": {
        "city": "Ciudad de México"
      }
    }
  }'
```

---

## 🚀 Future Enhancements

### Planned Features

1. **Official API Integration**
   - Direct submission to FGR API when available
   - Real-time status updates from authorities
   - Automated case number retrieval

2. **Enhanced Export**
   - Actual PDF generation with proper formatting
   - Digital signatures for authenticity
   - QR codes for verification

3. **Notification System**
   - Email notifications for status changes
   - SMS alerts for urgent updates
   - Push notifications for mobile app

4. **Advanced Features**
   - Multi-language support
   - Batch report submission
   - Report templates
   - Automated follow-ups

5. **Analytics**
   - Response time tracking
   - Success rate analysis
   - Entity performance metrics

### API Readiness

The current implementation is designed to easily integrate with official APIs when they become available:

```javascript
// Future API integration example
async performSubmission(report, submissionData) {
  const apiConfig = this.getApiConfig(report.targetEntity);
  
  if (apiConfig.enabled) {
    // Make actual API call
    const response = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.formatForApi(report))
    });
    
    return await response.json();
  }
  
  // Fallback to manual submission
  return this.getManualSubmissionInstructions(report.targetEntity);
}
```

---

## 📚 Additional Resources

- [Issue Model Documentation](./ISSUE_MODEL_DOCUMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [FGR Official Website](https://www.fgr.org.mx)
- [CNDH Website](https://www.cndh.org.mx)

---

## 🆘 Support

For issues or questions:

1. Check this documentation
2. Review test files for examples
3. Check the service layer implementation
4. Consult the GovernmentReport model documentation

---

## 📞 Emergency Contacts

**In case of emergency, call:**

- 🚨 **911** - Emergencias
- 👮 **089** - Denuncia Anónima
- 📞 **088** - Policía Federal
- 📞 **800-00-85-400** - FGR
- 📞 **CNDH** - [www.cndh.org.mx](https://www.cndh.org.mx)

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0  
**API Version**: v1

---

**Made with 💜 to protect your rights**
