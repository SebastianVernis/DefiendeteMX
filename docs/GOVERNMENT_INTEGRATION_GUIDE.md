# 🔗 Government API Integration Guide - DefiendeteMX

## Quick Start Guide

This guide will help you integrate the Government API features into your DefiendeteMX application.

---

## 📋 Prerequisites

1. **DefiendeteMX Application** running with:
   - MongoDB database configured
   - Issue tracking system operational
   - User authentication working

2. **Environment Variables** configured in `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Optional** (for future official API integration):
   ```env
   FGR_API_ENDPOINT=https://api.fgr.gob.mx/v1
   FGR_API_KEY=your_api_key
   ```

---

## 🚀 Quick Start

### Step 1: Create a Report from an Issue

```javascript
// Frontend example (React/Next.js)
async function createGovernmentReport(issueId, userId) {
  const response = await fetch('/api/government/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      issueId: issueId,
      userId: userId,
      reportType: 'FGR_DENUNCIA',
      targetEntity: 'FGR',
      additionalData: {
        victimAge: 30,
        victimGender: 'FEMENINO'
      }
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Report created:', data.data.reportNumber);
    return data.data;
  } else {
    console.error('Error:', data.error);
  }
}
```

### Step 2: Export Report for Submission

```javascript
async function exportReport(reportId, userId, format = 'PDF') {
  const response = await fetch(
    `/api/government/reports/${reportId}/export?userId=${userId}&format=${format}`
  );
  
  const data = await response.json();
  
  if (data.success) {
    // Download or display the exported report
    console.log('Report exported:', data.format);
    return data.data;
  }
}
```

### Step 3: Submit Report

```javascript
async function submitReport(reportId, userId) {
  const response = await fetch(
    `/api/government/reports/${reportId}/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        method: 'MANUAL'
      })
    }
  );
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Confirmation:', data.data.confirmationNumber);
    return data.data;
  }
}
```

---

## 🎨 React Component Example

### GovernmentReportButton Component

```jsx
'use client';

import { useState } from 'react';

export default function GovernmentReportButton({ issue, userId }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const createReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/government/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId: issue._id,
          userId: userId,
          reportType: 'FGR_DENUNCIA',
          targetEntity: 'FGR'
        })
      });

      const data = await response.json();

      if (data.success) {
        setReport(data.data);
        alert(`Report created: ${data.data.reportNumber}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const response = await fetch(
        `/api/government/reports/${report._id}/export?userId=${userId}&format=${format}`
      );

      const data = await response.json();

      if (data.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${report.reportNumber}.${format.toLowerCase()}`;
        a.click();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const submitReport = async () => {
    if (!confirm('Are you sure you want to submit this report?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/government/reports/${report._id}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            method: 'MANUAL'
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`Report submitted! Confirmation: ${data.data.confirmationNumber}`);
        setReport({ ...report, status: 'ENVIADO' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {!report ? (
        <button
          onClick={createReport}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Government Report'}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Report: {report.reportNumber} - Status: {report.status}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportReport('JSON')}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Export JSON
            </button>
            
            <button
              onClick={() => exportReport('PDF')}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Export PDF
            </button>
            
            {report.status === 'BORRADOR' && (
              <button
                onClick={submitReport}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Report
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">Error: {error}</p>
      )}
    </div>
  );
}
```

### Usage in Page

```jsx
import GovernmentReportButton from '@/app/components/GovernmentReportButton';

export default function IssuePage({ issue, user }) {
  return (
    <div>
      <h1>{issue.title}</h1>
      <p>{issue.description}</p>
      
      {/* Add government report button */}
      <GovernmentReportButton issue={issue} userId={user._id} />
    </div>
  );
}
```

---

## 📊 Dashboard Integration

### Reports Dashboard Component

```jsx
'use client';

import { useState, useEffect } from 'react';

export default function GovernmentReportsDashboard({ userId }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [userId]);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `/api/government/reports?userId=${userId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/government/reports/stats?userId=${userId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Total Reports</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Submitted</h3>
            <p className="text-2xl font-bold">{stats.submitted}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Pending</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Resolved</h3>
            <p className="text-2xl font-bold">{stats.resolved}</p>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Government Reports</h2>
        </div>
        
        <div className="divide-y">
          {reports.map(report => (
            <div key={report._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{report.reportNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {report.targetEntity} - {report.reportType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <span className={`px-2 py-1 text-xs rounded ${
                  report.status === 'ENVIADO' ? 'bg-green-100 text-green-800' :
                  report.status === 'BORRADOR' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 Backend Integration

### Custom Service Extension

If you need to extend the government service:

```javascript
// app/services/customGovernmentService.js
import governmentApiService from './governmentApiService';

class CustomGovernmentService {
  // Add custom validation
  async validateReportBeforeSubmission(reportId, userId) {
    const result = await governmentApiService.getReportById(reportId, userId);
    
    if (!result.success) {
      return result;
    }
    
    const report = result.data;
    
    // Custom validation logic
    const errors = [];
    
    if (!report.reportData.victim?.fullName) {
      errors.push('Victim name is required');
    }
    
    if (!report.reportData.incident?.description || 
        report.reportData.incident.description.length < 50) {
      errors.push('Incident description must be at least 50 characters');
    }
    
    if (errors.length > 0) {
      return {
        success: false,
        error: `Validation failed: ${errors.join(', ')}`
      };
    }
    
    return { success: true };
  }
  
  // Add custom notification
  async submitWithNotification(reportId, userId, notificationService) {
    // Validate first
    const validation = await this.validateReportBeforeSubmission(reportId, userId);
    
    if (!validation.success) {
      return validation;
    }
    
    // Submit report
    const result = await governmentApiService.submitReport(reportId, userId);
    
    if (result.success) {
      // Send notification
      await notificationService.sendNotification({
        userId,
        type: 'REPORT_SUBMITTED',
        message: `Report ${result.data.reportNumber} submitted successfully`,
        data: result.data
      });
    }
    
    return result;
  }
}

export default new CustomGovernmentService();
```

---

## 🔐 Security Best Practices

### 1. Authentication Middleware

```javascript
// middleware/auth.js
export function requireAuth(handler) {
  return async (request, context) => {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify JWT token here
    // ...
    
    return handler(request, context);
  };
}

// Usage in route
import { requireAuth } from '@/middleware/auth';

export const GET = requireAuth(async (request) => {
  // Your handler code
});
```

### 2. Rate Limiting

```javascript
// middleware/rateLimit.js
const rateLimits = new Map();

export function rateLimit(maxRequests = 10, windowMs = 60000) {
  return (handler) => {
    return async (request, context) => {
      const userId = request.headers.get('x-user-id');
      const key = `${userId}-${request.url}`;
      
      const now = Date.now();
      const userRequests = rateLimits.get(key) || [];
      
      // Remove old requests
      const recentRequests = userRequests.filter(
        time => now - time < windowMs
      );
      
      if (recentRequests.length >= maxRequests) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
      
      recentRequests.push(now);
      rateLimits.set(key, recentRequests);
      
      return handler(request, context);
    };
  };
}
```

---

## 📱 Mobile App Integration

### React Native Example

```javascript
// services/governmentReportService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class GovernmentReportService {
  constructor() {
    this.baseUrl = 'https://your-api.com/api/government/reports';
  }

  async createReport(issueId, reportType, targetEntity) {
    const userId = await AsyncStorage.getItem('userId');
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        issueId,
        userId,
        reportType,
        targetEntity
      })
    });
    
    return await response.json();
  }

  async getReports() {
    const userId = await AsyncStorage.getItem('userId');
    
    const response = await fetch(`${this.baseUrl}?userId=${userId}`);
    return await response.json();
  }

  async submitReport(reportId) {
    const userId = await AsyncStorage.getItem('userId');
    
    const response = await fetch(`${this.baseUrl}/${reportId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, method: 'MANUAL' })
    });
    
    return await response.json();
  }
}

export default new GovernmentReportService();
```

---

## 🧪 Testing Your Integration

### Integration Test Example

```javascript
// __tests__/integration/governmentReports.test.js
describe('Government Reports Integration', () => {
  let testUserId;
  let testIssueId;
  let testReportId;

  beforeAll(async () => {
    // Create test user and issue
    testUserId = await createTestUser();
    testIssueId = await createTestIssue(testUserId);
  });

  test('Complete report workflow', async () => {
    // 1. Create report
    const createResponse = await fetch('/api/government/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issueId: testIssueId,
        userId: testUserId,
        reportType: 'FGR_DENUNCIA',
        targetEntity: 'FGR'
      })
    });
    
    const createData = await createResponse.json();
    expect(createData.success).toBe(true);
    testReportId = createData.data._id;

    // 2. Get report
    const getResponse = await fetch(
      `/api/government/reports/${testReportId}?userId=${testUserId}`
    );
    const getData = await getResponse.json();
    expect(getData.success).toBe(true);

    // 3. Export report
    const exportResponse = await fetch(
      `/api/government/reports/${testReportId}/export?userId=${testUserId}&format=JSON`
    );
    const exportData = await exportResponse.json();
    expect(exportData.success).toBe(true);

    // 4. Submit report
    const submitResponse = await fetch(
      `/api/government/reports/${testReportId}/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testUserId, method: 'MANUAL' })
      }
    );
    const submitData = await submitResponse.json();
    expect(submitData.success).toBe(true);
    expect(submitData.data.confirmationNumber).toBeDefined();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData(testUserId, testIssueId, testReportId);
  });
});
```

---

## 🚨 Troubleshooting

### Common Issues

1. **"Issue not found" error**
   - Verify the issue ID exists
   - Check user has access to the issue

2. **"Cannot update submitted report"**
   - Reports can only be edited in BORRADOR or PENDIENTE status
   - Create a new report if changes are needed

3. **"Validation failed" on submission**
   - Ensure all required fields are filled
   - Check incident date, description, and location

4. **MongoDB connection errors**
   - Verify MONGODB_URI in .env
   - Ensure MongoDB is running

---

## 📚 Additional Resources

- [Government API Documentation](./GOVERNMENT_API_DOCUMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0
