# 📱 SMS Notification System - Complete Guide

## 📋 Overview

The SMS Notification System for DefiendeteMX provides comprehensive emergency alert capabilities and notification management through Twilio integration. This system enables users to send emergency alerts to predefined contacts, receive case updates, and manage all notification history.

---

## 🎯 Features

### Core Capabilities
- ✅ **Emergency Alerts** - Send SMS to all emergency contacts instantly
- ✅ **Custom SMS** - Send personalized messages to specific recipients
- ✅ **Batch SMS** - Send messages to multiple recipients simultaneously
- ✅ **Notification History** - Track all sent notifications with delivery status
- ✅ **Delivery Tracking** - Monitor SMS delivery status in real-time
- ✅ **Retry Logic** - Automatic retry for failed messages
- ✅ **Cost Tracking** - Monitor SMS costs per message
- ✅ **Template System** - Pre-built message templates for common scenarios

### Notification Types
- 🚨 **Emergency Alert** - Critical emergency notifications
- 📋 **Issue Update** - Case status change notifications
- ⚖️ **Court Reminder** - Upcoming court date reminders
- ✅ **Safety Check** - Periodic safety verification messages
- 📝 **Custom** - User-defined messages

---

## 🏗️ Architecture

### Components

```
SMS Notification System
├── Models
│   └── Notification.js          # Notification data model
├── Services
│   ├── smsService.js            # SMS sending logic (Twilio)
│   └── notificationService.js   # High-level orchestration
└── API Routes
    ├── /api/notifications/emergency
    ├── /api/notifications/send-sms
    ├── /api/notifications/batch-sms
    ├── /api/notifications/history
    └── /api/notifications/status/:id
```

### Data Flow

```
User Request → API Route → Notification Service → SMS Service → Twilio API
                                ↓
                        Notification Model (Database)
                                ↓
                        Delivery Status Tracking
```

---

## 🔧 Configuration

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Optional: Webhook for delivery status
TWILIO_STATUS_CALLBACK_URL=https://your-domain.com/api/webhooks/twilio-status
```

### 2. Get Twilio Credentials

1. Sign up at [Twilio Console](https://www.twilio.com/console)
2. Get your **Account SID** and **Auth Token** from the dashboard
3. Purchase a phone number or use a trial number
4. Copy credentials to your `.env` file

### 3. Install Dependencies

```bash
npm install twilio
```

---

## 📡 API Reference

### 1. Emergency Alert

**Endpoint:** `POST /api/notifications/emergency`

**Description:** Trigger emergency alert to all emergency contacts

**Request Body:**
```json
{
  "userId": "user123",
  "location": "Calle Principal 123, CDMX",
  "situation": "Detención policial",
  "coordinates": {
    "latitude": 19.4326,
    "longitude": -99.1332
  },
  "issueId": "issue123",
  "additionalMessage": "Necesito ayuda urgente"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "data": {
    "contactsNotified": 3,
    "smsResults": {
      "batchId": "batch_1234567890",
      "total": 3,
      "successful": 3,
      "failed": 0
    }
  }
}
```

**Example Usage:**
```javascript
const response = await fetch('/api/notifications/emergency', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    location: 'Calle Principal 123',
    situation: 'Emergencia'
  })
});

const data = await response.json();
console.log(`Notified ${data.data.contactsNotified} contacts`);
```

---

### 2. Send Custom SMS

**Endpoint:** `POST /api/notifications/send-sms`

**Description:** Send custom SMS to a specific recipient

**Request Body:**
```json
{
  "to": "5512345678",
  "message": "Tu caso ha sido actualizado. Por favor revisa la plataforma.",
  "recipientName": "Juan Pérez",
  "userId": "user123",
  "issueId": "issue123",
  "category": "ISSUE_UPDATE",
  "priority": "MEDIUM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "notificationId": "notif123",
    "status": "SENT",
    "recipient": {
      "name": "Juan Pérez",
      "phone": "5512345678"
    },
    "sentAt": "2025-12-08T10:30:00.000Z",
    "simulated": false
  }
}
```

---

### 3. Send Batch SMS

**Endpoint:** `POST /api/notifications/batch-sms`

**Description:** Send SMS to multiple recipients

**Request Body:**
```json
{
  "recipients": [
    { "name": "Juan Pérez", "phone": "5512345678", "userId": "user1" },
    { "name": "María García", "phone": "5587654321", "userId": "user2" },
    { "name": "Carlos López", "phone": "5511111111", "userId": "user3" }
  ],
  "message": "Recordatorio: Audiencia mañana a las 10:00 AM",
  "issueId": "issue123",
  "category": "COURT_REMINDER",
  "priority": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch SMS sent",
  "data": {
    "batchId": "batch_1234567890",
    "total": 3,
    "successful": 3,
    "failed": 0,
    "notifications": [
      { "recipient": "Juan Pérez", "phone": "5512345678", "status": "sent" },
      { "recipient": "María García", "phone": "5587654321", "status": "sent" },
      { "recipient": "Carlos López", "phone": "5511111111", "status": "sent" }
    ]
  }
}
```

**Limitations:**
- Maximum 100 recipients per batch
- Rate limiting: 100ms delay between messages

---

### 4. Get Notification History

**Endpoint:** `GET /api/notifications/history`

**Description:** Retrieve notification history for a user

**Query Parameters:**
- `userId` (required) - User ID
- `type` (optional) - Filter by type (SMS, EMAIL, PUSH, IN_APP)
- `category` (optional) - Filter by category
- `status` (optional) - Filter by status
- `limit` (optional) - Number of results (default: 50)
- `skip` (optional) - Pagination offset (default: 0)

**Example Request:**
```
GET /api/notifications/history?userId=user123&type=SMS&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notif123",
        "type": "SMS",
        "category": "EMERGENCY_ALERT",
        "status": "DELIVERED",
        "recipient": {
          "name": "Juan Pérez",
          "phone": "5512345678"
        },
        "message": {
          "body": "🚨 ALERTA DE EMERGENCIA..."
        },
        "createdAt": "2025-12-08T10:30:00.000Z"
      }
    ],
    "stats": {
      "total": 50,
      "sent": 45,
      "delivered": 42,
      "failed": 3,
      "pending": 5
    },
    "pagination": {
      "limit": 20,
      "skip": 0,
      "total": 20
    }
  }
}
```

---

### 5. Get Notification Status

**Endpoint:** `GET /api/notifications/status/:id`

**Description:** Get detailed status of a specific notification

**Example Request:**
```
GET /api/notifications/status/notif123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notif123",
    "type": "SMS",
    "category": "EMERGENCY_ALERT",
    "priority": "CRITICAL",
    "status": "DELIVERED",
    "recipient": {
      "name": "Juan Pérez",
      "phone": "5512345678"
    },
    "message": {
      "body": "🚨 ALERTA DE EMERGENCIA..."
    },
    "delivery": {
      "sentAt": "2025-12-08T10:30:00.000Z",
      "deliveredAt": "2025-12-08T10:30:05.000Z",
      "attempts": 1
    },
    "provider": {
      "name": "TWILIO",
      "messageId": "SM1234567890",
      "cost": 0.0075,
      "currency": "USD"
    },
    "canRetry": false
  }
}
```

---

### 6. Update Notification Status

**Endpoint:** `PATCH /api/notifications/status/:id`

**Description:** Update notification status (mark as read, retry)

**Request Body:**
```json
{
  "action": "mark_read"
}
```

**Available Actions:**
- `mark_read` - Mark notification as read
- `retry` - Retry failed notification

**Response:**
```json
{
  "success": true,
  "message": "Action 'mark_read' completed successfully",
  "data": {
    "id": "notif123",
    "status": "DELIVERED",
    "delivery": {
      "readAt": "2025-12-08T10:35:00.000Z"
    }
  }
}
```

---

## 💻 Code Examples

### Example 1: Send Emergency Alert

```javascript
async function sendEmergencyAlert(userId, location, situation) {
  try {
    const response = await fetch('/api/notifications/emergency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        location,
        situation,
        coordinates: await getCurrentLocation()
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Emergency alert sent to ${data.data.contactsNotified} contacts`);
      return data;
    } else {
      console.error('❌ Failed to send alert:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    throw error;
  }
}

// Usage
await sendEmergencyAlert('user123', 'Calle Principal 123', 'Detención policial');
```

---

### Example 2: Send Custom SMS

```javascript
async function sendCustomSMS(phone, message, recipientName) {
  try {
    const response = await fetch('/api/notifications/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phone,
        message,
        recipientName,
        category: 'CUSTOM',
        priority: 'MEDIUM'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ SMS sent successfully');
      console.log('Notification ID:', data.data.notificationId);
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

// Usage
await sendCustomSMS('5512345678', 'Tu caso ha sido actualizado', 'Juan Pérez');
```

---

### Example 3: Get Notification History

```javascript
async function getNotificationHistory(userId, filters = {}) {
  try {
    const params = new URLSearchParams({
      userId,
      ...filters
    });
    
    const response = await fetch(`/api/notifications/history?${params}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`📊 Found ${data.data.notifications.length} notifications`);
      console.log('Stats:', data.data.stats);
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error getting history:', error);
    throw error;
  }
}

// Usage
const history = await getNotificationHistory('user123', {
  type: 'SMS',
  limit: 20
});
```

---

### Example 4: Retry Failed Notification

```javascript
async function retryNotification(notificationId) {
  try {
    const response = await fetch(`/api/notifications/status/${notificationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'retry'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Notification retry initiated');
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error retrying notification:', error);
    throw error;
  }
}

// Usage
await retryNotification('notif123');
```

---

## 📝 Message Templates

### Available Templates

The system includes pre-built message templates:

```javascript
// Emergency Alert
"🚨 ALERTA DE EMERGENCIA - {userName} necesita ayuda urgente. 
Ubicación: {location}. Situación: {situation}. 
Por favor contacta inmediatamente. DefiendeteMX"

// Issue Update
"📋 Actualización de caso #{issueId}: {message}. DefiendeteMX"

// Court Reminder
"⚖️ Recordatorio: Audiencia el {date} a las {time} en {location}. DefiendeteMX"

// Safety Check
"✅ Verificación de seguridad: ¿Estás bien? Responde SI o NO. DefiendeteMX"
```

### Using Templates in Code

```javascript
import smsService from './app/services/smsService';

// Generate message from template
const message = smsService.generateMessage('EMERGENCY_ALERT', {
  userName: 'Juan Pérez',
  location: 'Calle Principal 123',
  situation: 'Detención policial'
});

console.log(message);
// Output: "🚨 ALERTA DE EMERGENCIA - Juan Pérez necesita ayuda urgente..."
```

---

## 💰 Cost Management

### SMS Cost Estimation

```javascript
import smsService from './app/services/smsService';

// Estimate cost for sending SMS
const estimate = smsService.estimateSMSCost(10, 'MX');

console.log(`Sending ${estimate.messageCount} SMS to Mexico`);
console.log(`Cost per SMS: $${estimate.costPerSMS} ${estimate.currency}`);
console.log(`Total cost: $${estimate.totalCost} ${estimate.currency}`);

// Output:
// Sending 10 SMS to Mexico
// Cost per SMS: $0.0075 USD
// Total cost: $0.075 USD
```

### Cost Tracking

All notifications automatically track costs:

```javascript
// Get notification with cost info
const notification = await notificationService.getNotificationById('notif123');

console.log('Provider:', notification.provider.name);
console.log('Cost:', notification.provider.cost);
console.log('Currency:', notification.provider.currency);
```

---

## 🔒 Security & Privacy

### Best Practices

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use different credentials for development and production
   - Rotate credentials regularly

2. **Phone Number Validation**
   - All phone numbers are validated before sending
   - Only 10-digit Mexican phone numbers are accepted
   - Invalid numbers are rejected with clear error messages

3. **Rate Limiting**
   - Batch SMS includes 100ms delay between messages
   - Maximum 100 recipients per batch
   - Prevents API throttling and abuse

4. **User Consent**
   - Track consent timestamps in notification model
   - Respect opt-out preferences
   - Provide unsubscribe mechanism

5. **Data Privacy**
   - Notification data is encrypted at rest
   - Sensitive information is not logged
   - GDPR compliance ready

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run SMS service tests only
npm test -- smsService.test.js

# Run notification service tests only
npm test -- notificationService.test.js

# Run API integration tests
npm test -- api.integration.test.js

# Run with coverage
npm test -- --coverage
```

### Test in Development Mode

When Twilio credentials are not configured, the system runs in **simulation mode**:

```javascript
// SMS will be logged to console instead of sent
console.log('📱 [SIMULATED SMS]');
console.log('To: +525512345678');
console.log('Message: Test message');
```

This allows development and testing without incurring SMS costs.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. SMS Not Sending

**Problem:** SMS not being sent, no error messages

**Solution:**
- Check Twilio credentials in `.env`
- Verify phone number format (10 digits)
- Check Twilio account balance
- Review Twilio console for errors

#### 2. Invalid Phone Number

**Problem:** "Invalid phone number format" error

**Solution:**
- Ensure phone number is exactly 10 digits
- Remove country code, spaces, and special characters
- Example: `5512345678` (correct) vs `+52 55 1234 5678` (incorrect)

#### 3. Delivery Failures

**Problem:** SMS marked as FAILED

**Solution:**
- Check recipient phone number is active
- Verify phone number is not blocked
- Review error details in notification record
- Use retry mechanism for transient failures

#### 4. High Costs

**Problem:** Unexpected SMS costs

**Solution:**
- Use cost estimation before sending
- Monitor notification statistics
- Implement daily/monthly limits
- Review batch sending patterns

---

## 📊 Monitoring & Analytics

### Get Notification Statistics

```javascript
// Get stats for specific user
const stats = await notificationService.getNotificationStats('user123');

console.log('Total notifications:', stats.total);
console.log('Sent:', stats.sent);
console.log('Delivered:', stats.delivered);
console.log('Failed:', stats.failed);
console.log('Total cost:', stats.totalCost);
```

### Monitor Delivery Rates

```javascript
// Calculate delivery rate
const deliveryRate = (stats.delivered / stats.sent) * 100;
console.log(`Delivery rate: ${deliveryRate.toFixed(2)}%`);

// Calculate failure rate
const failureRate = (stats.failed / stats.total) * 100;
console.log(`Failure rate: ${failureRate.toFixed(2)}%`);
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Configure production Twilio credentials
- [ ] Set up webhook URL for delivery status
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Test emergency alert flow
- [ ] Verify phone number validation
- [ ] Review cost estimates
- [ ] Set up backup SMS provider (optional)

### Environment Configuration

```env
# Production .env
NODE_ENV=production
TWILIO_ACCOUNT_SID=your-production-sid
TWILIO_AUTH_TOKEN=your-production-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_STATUS_CALLBACK_URL=https://your-domain.com/api/webhooks/twilio-status
```

---

## 📚 Additional Resources

- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio SMS API Reference](https://www.twilio.com/docs/sms/api)
- [Twilio Pricing](https://www.twilio.com/sms/pricing)
- [DefiendeteMX Documentation](./DOCUMENTATION.md)

---

## 🤝 Support

For issues or questions:

1. Check this guide first
2. Review error messages in console
3. Check Twilio console for delivery status
4. Contact support team

---

**Last Updated:** December 8, 2025  
**Version:** 1.0.0  
**Author:** Blackbox AI Agent
