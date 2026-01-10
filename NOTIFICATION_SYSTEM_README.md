# 📱 SMS Notification System - Quick Start

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
npm install twilio  # Optional: for production SMS
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your Twilio credentials:
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 📡 API Endpoints

### Emergency Alert
```bash
POST /api/notifications/emergency
```
```json
{
  "userId": "user123",
  "location": "Calle Principal 123",
  "situation": "Emergencia"
}
```

### Send SMS
```bash
POST /api/notifications/send-sms
```
```json
{
  "to": "5512345678",
  "message": "Test message",
  "recipientName": "Juan Pérez"
}
```

### Get History
```bash
GET /api/notifications/history?userId=user123&type=SMS
```

### Get Status
```bash
GET /api/notifications/status/:id
```

---

## 💻 Code Example

```javascript
// Send emergency alert
const response = await fetch('/api/notifications/emergency', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    location: 'Calle Principal 123',
    situation: 'Detención policial'
  })
});

const data = await response.json();
console.log(`Notified ${data.data.contactsNotified} contacts`);
```

---

## 📚 Documentation

- **Complete Guide:** [SMS_NOTIFICATION_GUIDE.md](./SMS_NOTIFICATION_GUIDE.md)
- **Implementation Summary:** [IMPLEMENTATION_SUMMARY_ISSUE_10.md](./IMPLEMENTATION_SUMMARY_ISSUE_10.md)
- **Main README:** [README.md](./README.md)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific tests
npm test -- smsService.test.js
npm test -- notificationService.test.js
npm test -- api.integration.test.js
```

---

## 🔧 Development Mode

Without Twilio credentials, the system runs in **simulation mode**:
- SMS messages are logged to console
- No actual SMS sent
- Perfect for development and testing
- No costs incurred

---

## 🚨 Emergency Alert Flow

1. User triggers emergency alert
2. System retrieves emergency contacts from user profile
3. SMS sent to all contacts with location and situation
4. Delivery status tracked in database
5. Issue updated with notification details

---

## 📊 Features

✅ Emergency SMS alerts  
✅ Custom SMS messages  
✅ Batch SMS sending  
✅ Delivery tracking  
✅ Cost tracking  
✅ Retry logic  
✅ Message templates  
✅ Notification history  

---

## 🔐 Security

- Phone number validation
- Rate limiting
- Encrypted credentials
- Privacy compliance
- Opt-out support

---

## 💰 Costs

- Mexico: ~$0.0075 USD per SMS
- United States: ~$0.0075 USD per SMS
- Cost tracking per notification
- Estimation before sending

---

## 🆘 Support

For detailed information, see [SMS_NOTIFICATION_GUIDE.md](./SMS_NOTIFICATION_GUIDE.md)

---

**Version:** 1.0.0  
**Last Updated:** December 8, 2025
