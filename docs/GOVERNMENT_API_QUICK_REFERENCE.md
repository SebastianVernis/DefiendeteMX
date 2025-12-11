# 🚀 Government API Quick Reference - DefiendeteMX

## Quick Links

- 📖 [Full API Documentation](./GOVERNMENT_API_DOCUMENTATION.md)
- 🔗 [Integration Guide](./GOVERNMENT_INTEGRATION_GUIDE.md)
- 📋 [Implementation Summary](./IMPLEMENTATION_SUMMARY_ISSUE_11.md)

---

## 🎯 Quick Start (3 Steps)

### 1. Create Report
```bash
curl -X POST http://localhost:3000/api/government/reports \
  -H "Content-Type: application/json" \
  -d '{
    "issueId": "YOUR_ISSUE_ID",
    "userId": "YOUR_USER_ID",
    "reportType": "FGR_DENUNCIA",
    "targetEntity": "FGR"
  }'
```

### 2. Export Report
```bash
curl "http://localhost:3000/api/government/reports/REPORT_ID/export?userId=USER_ID&format=PDF"
```

### 3. Submit Report
```bash
curl -X POST http://localhost:3000/api/government/reports/REPORT_ID/submit \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "method": "MANUAL"}'
```

---

## 📋 API Endpoints Cheat Sheet

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/government/reports` | Create report |
| GET | `/api/government/reports?userId=X` | List reports |
| GET | `/api/government/reports/:id?userId=X` | Get report |
| PUT | `/api/government/reports/:id` | Update report |
| DELETE | `/api/government/reports/:id?userId=X` | Delete report |
| POST | `/api/government/reports/:id/submit` | Submit report |
| GET | `/api/government/reports/:id/export?format=X` | Export report |
| GET | `/api/government/reports/stats?userId=X` | Get stats |

---

## 🏛️ Report Types

| Code | Description |
|------|-------------|
| `FGR_DENUNCIA` | FGR Crime Report |
| `POLICIA_REPORTE` | Police Report |
| `EMERGENCIA_911` | Emergency 911 |
| `DENUNCIA_ANONIMA` | Anonymous Report |
| `VIOLENCIA_DOMESTICA` | Domestic Violence |
| `DESAPARICION` | Missing Person |

---

## 🎯 Target Entities

| Code | Name | Contact |
|------|------|---------|
| `FGR` | Fiscalía General | 800-00-85-400 |
| `POLICIA_FEDERAL` | Federal Police | 088 |
| `GUARDIA_NACIONAL` | National Guard | 088 |
| `EMERGENCIAS_911` | Emergency | 911 |
| `CNDH` | Human Rights | www.cndh.org.mx |

---

## 📊 Status Values

```
BORRADOR → PENDIENTE → ENVIADO → RECIBIDO → EN_PROCESO → RESUELTO → CERRADO
```

- **BORRADOR**: Draft (editable)
- **PENDIENTE**: Pending submission
- **ENVIADO**: Submitted
- **RECIBIDO**: Acknowledged
- **EN_PROCESO**: In progress
- **RESUELTO**: Resolved
- **CERRADO**: Closed

---

## 📄 Export Formats

- **JSON**: `?format=JSON` - Structured data
- **PDF**: `?format=PDF` - Document
- **XML**: `?format=XML` - Markup

---

## 🔧 React Component Example

```jsx
import { useState } from 'react';

function CreateReportButton({ issueId, userId }) {
  const [loading, setLoading] = useState(false);

  const createReport = async () => {
    setLoading(true);
    const res = await fetch('/api/government/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issueId,
        userId,
        reportType: 'FGR_DENUNCIA',
        targetEntity: 'FGR'
      })
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.success) {
      alert(`Report created: ${data.data.reportNumber}`);
    }
  };

  return (
    <button onClick={createReport} disabled={loading}>
      {loading ? 'Creating...' : 'Create Government Report'}
    </button>
  );
}
```

---

## 🔐 Required Parameters

### Create Report
- ✅ `issueId` - Existing issue ID
- ✅ `userId` - User ID
- ✅ `reportType` - Report type code
- ✅ `targetEntity` - Entity code
- ⚪ `additionalData` - Optional extra data

### Get/Update/Delete
- ✅ `userId` - User ID (query param)

### Submit
- ✅ `userId` - User ID
- ⚪ `method` - Submission method (default: MANUAL)

### Export
- ✅ `userId` - User ID
- ⚪ `format` - Export format (default: JSON)
- ⚪ `purpose` - Export purpose

---

## 📞 Emergency Contacts

| Service | Number | Website |
|---------|--------|---------|
| Emergency | **911** | - |
| FGR | **800-00-85-400** | fgr.org.mx/denuncia |
| Anonymous | **089** | - |
| Federal Police | **088** | - |

---

## ⚠️ Important Notes

1. **No Public APIs**: As of 2025, no official government APIs exist
2. **Manual Submission**: Reports must be submitted manually via official channels
3. **Export First**: Always export and review before submission
4. **Track Status**: Update report status after manual submission
5. **Keep Records**: Maintain confirmation numbers and case numbers

---

## 🧪 Test Commands

```bash
# Create test report
curl -X POST http://localhost:3000/api/government/reports \
  -H "Content-Type: application/json" \
  -d '{"issueId":"test","userId":"test","reportType":"FGR_DENUNCIA","targetEntity":"FGR"}'

# List reports
curl "http://localhost:3000/api/government/reports?userId=test"

# Get stats
curl "http://localhost:3000/api/government/reports/stats?userId=test"
```

---

## 🐛 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `userId is required` | Missing userId | Add userId parameter |
| `Issue not found` | Invalid issueId | Verify issue exists |
| `Unauthorized access` | Wrong userId | Use correct userId |
| `Cannot update submitted report` | Report already sent | Create new report |
| `Validation failed` | Missing required data | Fill all required fields |

---

## 📚 File Locations

```
app/
├── models/GovernmentReport.js
├── services/governmentApiService.js
└── api/government/reports/
    ├── route.js
    ├── [id]/route.js
    ├── [id]/submit/route.js
    ├── [id]/export/route.js
    └── stats/route.js
```

---

## 🔑 Environment Variables

```env
# Optional - for future API integration
FGR_API_ENDPOINT=https://api.fgr.gob.mx/v1
FGR_API_KEY=your_api_key
POLICIA_API_ENDPOINT=https://api.policia.gob.mx/v1
POLICIA_API_KEY=your_api_key
```

---

## ✅ Checklist for Submission

- [ ] Report created from issue
- [ ] All required fields filled
- [ ] Report exported and reviewed
- [ ] Submitted via official channel
- [ ] Confirmation number received
- [ ] Report status updated in system
- [ ] Case number recorded (if provided)

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0

For detailed information, see [Full Documentation](./GOVERNMENT_API_DOCUMENTATION.md)
