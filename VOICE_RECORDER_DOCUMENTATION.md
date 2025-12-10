# 🎙️ Voice Recorder with AI Analysis - Documentation

## Overview

The Voice Recorder component is a comprehensive audio recording solution with AI-powered transcription and emotion analysis. It's designed for emergency situations, legal evidence collection, and documentation of important conversations.

---

## 🌟 Features

### Core Functionality
- ✅ **Background Recording**: Continue recording while using other app features
- ✅ **Real-time Visualization**: Audio level waveform display
- ✅ **Pause/Resume**: Full control over recording sessions
- ✅ **Automatic Upload**: Seamless cloud storage integration
- ✅ **GPS Location**: Automatic location tagging

### AI Analysis
- ✅ **Speech-to-Text**: Powered by OpenAI Whisper API
- ✅ **Emotion Detection**: Analyze emotional state from audio
- ✅ **Stress Level**: Calculate overall stress (0-10 scale)
- ✅ **Emergency Keywords**: Automatic detection of distress signals
- ✅ **Confidence Scores**: Reliability metrics for all analyses

### Security & Privacy
- ✅ **Encrypted Storage**: All recordings are encrypted
- ✅ **Auto-Deletion**: 30-day retention policy
- ✅ **User Consent**: Explicit permission requests
- ✅ **GDPR Compliant**: Full data protection compliance

---

## 📁 File Structure

```
/app
├── /models
│   └── VoiceRecording.js              # Mongoose model for recordings
├── /issues/services
│   └── aiAnalysisService.js           # AI transcription & emotion analysis
├── /api/voice
│   ├── /upload/route.js               # Upload endpoint
│   ├── /transcribe/route.js           # Transcription endpoint
│   ├── /analyze-emotion/route.js      # Emotion analysis endpoint
│   └── /analyze/route.js              # Complete analysis endpoint
├── /components/features
│   └── VoiceRecorder.js               # Main recorder component
└── /grabador
    └── page.js                        # Demo page
```

---

## 🔧 Installation & Setup

### 1. Dependencies

Already included in `package.json`:
```json
{
  "dependencies": {
    "mongoose": "^8.0.3",
    "next": "14.0.0",
    "react": "18.2.0"
  }
}
```

### 2. Environment Variables

Add to `.env.local`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/defiendete-mx

# OpenAI API (for production transcription)
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Custom emotion analysis API
EMOTION_API_KEY=your-emotion-api-key-here
```

### 3. Database Setup

The VoiceRecording model will automatically create indexes on first use. No manual setup required.

---

## 💻 Usage

### Basic Implementation

```jsx
import VoiceRecorder from '@/app/components/features/VoiceRecorder';

export default function MyPage() {
  const userId = 'user-123'; // Get from auth

  const handleRecordingComplete = (blob) => {
    console.log('Recording completed:', blob);
  };

  const handleAnalysisComplete = (results) => {
    console.log('Analysis results:', results);
  };

  return (
    <VoiceRecorder
      userId={userId}
      onRecordingComplete={handleRecordingComplete}
      onAnalysisComplete={handleAnalysisComplete}
      autoAnalyze={true}
      showVisualization={true}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userId` | string | required | User ID for recording ownership |
| `issueId` | string | optional | Link recording to specific issue |
| `onRecordingComplete` | function | optional | Callback when recording finishes |
| `onAnalysisComplete` | function | optional | Callback when analysis completes |
| `autoAnalyze` | boolean | `true` | Automatically analyze after recording |
| `showVisualization` | boolean | `true` | Show audio waveform visualization |

---

## 🔌 API Endpoints

### POST /api/voice/upload

Upload a voice recording.

**Request:**
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('userId', 'user-123');
formData.append('issueId', 'issue-456'); // optional
formData.append('latitude', '19.4326'); // optional
formData.append('longitude', '-99.1332'); // optional
formData.append('notes', 'Emergency recording'); // optional

const response = await fetch('/api/voice/upload', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "id": "recording-id",
  "filename": "recording_1234567890.webm",
  "duration": 125,
  "durationFormatted": "2:05",
  "fileSize": 1024000,
  "fileSizeFormatted": "1.00 MB",
  "recordedAt": "2024-12-08T10:30:00.000Z",
  "analysisStatus": "PENDING",
  "location": {
    "latitude": 19.4326,
    "longitude": -99.1332
  },
  "message": "Recording uploaded successfully"
}
```

### POST /api/voice/transcribe

Transcribe a recording.

**Request:**
```javascript
const formData = new FormData();
formData.append('recordingId', 'recording-id');

const response = await fetch('/api/voice/transcribe', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "recordingId": "recording-id",
  "transcription": {
    "text": "Necesito ayuda urgente...",
    "language": "es",
    "confidence": 0.92,
    "segments": [
      {
        "text": "Necesito ayuda urgente",
        "start": 0,
        "end": 2.5,
        "confidence": 0.95
      }
    ],
    "processedAt": "2024-12-08T10:31:00.000Z",
    "provider": "WHISPER"
  },
  "isEmergency": true,
  "emergencyKeywords": [
    {
      "keyword": "ayuda",
      "context": "Necesito ayuda urgente"
    }
  ],
  "analysisStatus": "PARTIAL"
}
```

### POST /api/voice/analyze-emotion

Analyze emotions in a recording.

**Request:**
```javascript
const formData = new FormData();
formData.append('recordingId', 'recording-id');

const response = await fetch('/api/voice/analyze-emotion', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "recordingId": "recording-id",
  "emotionAnalysis": {
    "primaryEmotion": "STRESSED",
    "emotions": [
      {
        "emotion": "STRESSED",
        "confidence": 0.78,
        "timestamp": 0
      },
      {
        "emotion": "ANXIOUS",
        "confidence": 0.65,
        "timestamp": 0
      }
    ],
    "overallStressLevel": 8,
    "audioFeatures": {
      "averagePitch": 220.5,
      "pitchVariation": 45.2,
      "averageVolume": 0.72,
      "volumeVariation": 0.28,
      "speechRate": 165,
      "pauseFrequency": 12
    },
    "processedAt": "2024-12-08T10:31:30.000Z",
    "provider": "CUSTOM"
  },
  "isEmergency": true,
  "analysisStatus": "COMPLETED"
}
```

### POST /api/voice/analyze

Complete analysis (transcription + emotion).

**Request:**
```javascript
const formData = new FormData();
formData.append('recordingId', 'recording-id');

const response = await fetch('/api/voice/analyze', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "recordingId": "recording-id",
  "transcription": { /* ... */ },
  "emotionAnalysis": { /* ... */ },
  "isEmergency": true,
  "emergencyKeywords": [ /* ... */ ],
  "analysisStatus": "COMPLETED",
  "message": "Complete analysis finished successfully"
}
```

### GET /api/voice/upload

Get user's recordings.

**Query Parameters:**
- `userId` (required): User ID
- `issueId` (optional): Filter by issue
- `isEmergency` (optional): Filter emergency recordings
- `limit` (optional): Max results (default: 50)

**Response:**
```json
{
  "recordings": [
    {
      "_id": "recording-id",
      "filename": "recording.webm",
      "duration": 125,
      "recordedAt": "2024-12-08T10:30:00.000Z",
      "analysisStatus": "COMPLETED",
      "isEmergency": true
    }
  ],
  "count": 1
}
```

---

## 📊 Data Model

### VoiceRecording Schema

```javascript
{
  user: ObjectId,              // Required: User reference
  issue: ObjectId,             // Optional: Issue reference
  filename: String,            // Required: File name
  duration: Number,            // Required: Duration in seconds
  fileSize: Number,            // Required: Size in bytes
  mimeType: String,            // Default: 'audio/webm'
  storageUrl: String,          // Required: Storage location
  storageProvider: String,     // Default: 'LOCAL'
  recordedAt: Date,            // Default: now
  
  location: {
    latitude: Number,          // -90 to 90
    longitude: Number,         // -180 to 180
    accuracy: Number,
    address: String
  },
  
  transcription: {
    text: String,
    language: String,          // Default: 'es'
    confidence: Number,        // 0-1
    segments: [{
      text: String,
      start: Number,
      end: Number,
      confidence: Number
    }],
    processedAt: Date,
    provider: String           // Default: 'WHISPER'
  },
  
  emotionAnalysis: {
    primaryEmotion: String,    // CALM, STRESSED, FEARFUL, etc.
    emotions: [{
      emotion: String,
      confidence: Number,
      timestamp: Number
    }],
    overallStressLevel: Number, // 0-10
    audioFeatures: {
      averagePitch: Number,
      pitchVariation: Number,
      averageVolume: Number,
      volumeVariation: Number,
      speechRate: Number,
      pauseFrequency: Number
    },
    processedAt: Date,
    provider: String
  },
  
  analysisStatus: String,      // PENDING, PROCESSING, COMPLETED, FAILED
  isEmergency: Boolean,        // Default: false
  emergencyKeywords: [{
    keyword: String,
    timestamp: Number,
    context: String
  }],
  
  expiresAt: Date,             // Auto-deletion date
  autoDeleteAfterDays: Number, // Default: 30
  isDeleted: Boolean,          // Default: false
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI Components

### Emotion Badges

```jsx
import { getEmotionColor, getEmotionIcon } from '@/app/issues/services/aiAnalysisService';

const emotion = 'STRESSED';
const color = getEmotionColor(emotion);  // 'from-orange-400 to-red-500'
const icon = getEmotionIcon(emotion);    // '😰'

<div className={`bg-gradient-to-r ${color}`}>
  {icon} {emotion}
</div>
```

### Stress Level Display

```jsx
import { formatStressLevel } from '@/app/issues/services/aiAnalysisService';

const level = 8;
const { label, color, bgColor } = formatStressLevel(level);
// label: 'Alto'
// color: 'text-orange-600'
// bgColor: 'bg-orange-100'

<Badge className={`${color} ${bgColor}`}>
  Estrés: {label} ({level}/10)
</Badge>
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run voice recorder tests only
npm test -- --testPathPattern="voiceRecording|aiAnalysisService"

# Watch mode
npm test:watch
```

### Test Coverage

- ✅ VoiceRecording model validation
- ✅ Virtual properties
- ✅ Instance methods
- ✅ Emergency keyword detection
- ✅ AI analysis service functions
- ✅ File validation
- ✅ Emotion detection
- ✅ Stress level calculation

---

## 🔒 Security Considerations

### 1. Microphone Permissions

Always request explicit user consent:
```javascript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
```

### 2. Data Encryption

Recordings should be encrypted at rest:
```javascript
recording.isEncrypted = true;
recording.encryptionKey = hashedKey;
```

### 3. Access Control

Verify user ownership before allowing access:
```javascript
if (recording.user.toString() !== userId) {
  return res.status(403).json({ error: 'Unauthorized' });
}
```

### 4. Rate Limiting

Implement rate limiting on API endpoints to prevent abuse.

### 5. File Size Limits

Maximum file size: 25MB (enforced in validation)

---

## 🚀 Production Deployment

### 1. Environment Setup

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
OPENAI_API_KEY=sk-...
```

### 2. Cloud Storage

For production, use cloud storage instead of base64:

```javascript
// Example with Cloudinary
import { v2 as cloudinary } from 'cloudinary';

const result = await cloudinary.uploader.upload(audioFile, {
  resource_type: 'video',
  folder: 'voice-recordings'
});

recording.storageUrl = result.secure_url;
recording.storageProvider = 'CLOUDINARY';
```

### 3. Background Jobs

Use a queue system for analysis:

```javascript
// Example with Bull
import Queue from 'bull';

const analysisQueue = new Queue('voice-analysis');

analysisQueue.process(async (job) => {
  const { recordingId } = job.data;
  await analyzeRecording(recordingId);
});
```

---

## 📱 Mobile Considerations

### iOS Safari

- Requires user interaction to start recording
- Background recording limited to 3 minutes
- Use `webkit` prefixes for Web Audio API

### Android Chrome

- Full background recording support
- Better audio quality options
- Supports all standard audio formats

### Progressive Web App

Add to manifest.json:
```json
{
  "permissions": ["microphone"],
  "background_color": "#ffffff",
  "display": "standalone"
}
```

---

## 🐛 Troubleshooting

### Issue: Microphone permission denied

**Solution:** Check browser settings and ensure HTTPS connection.

### Issue: Recording not starting

**Solution:** Verify MediaRecorder API support:
```javascript
if (!navigator.mediaDevices || !MediaRecorder) {
  alert('Recording not supported in this browser');
}
```

### Issue: Analysis failing

**Solution:** Check API keys and network connectivity. Fallback to mock data in development.

### Issue: Large file sizes

**Solution:** Adjust recording quality:
```javascript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 64000 // Lower bitrate
});
```

---

## 📚 Additional Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## 🤝 Contributing

To contribute to the voice recorder feature:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@defiendete-mx.com
- Documentation: [Full docs](https://docs.defiendete-mx.com)

---

**Last Updated:** December 8, 2025  
**Version:** 1.0.0  
**Author:** DefiendeteMX Development Team
