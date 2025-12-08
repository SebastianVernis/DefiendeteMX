# 🎙️ Voice Recorder - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. View the Demo

Visit the demo page:
```
http://localhost:3000/grabador
```

### 2. Basic Usage

```jsx
import VoiceRecorder from '@/app/components/features/VoiceRecorder';

export default function MyPage() {
  return (
    <VoiceRecorder
      userId="user-123"
      autoAnalyze={true}
      showVisualization={true}
    />
  );
}
```

### 3. Environment Setup

Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/defiendete-mx
OPENAI_API_KEY=your-key-here  # Optional for production
```

### 4. Start Development

```bash
npm install
npm run dev
```

---

## 📋 Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🎤 Recording | ✅ | Start/pause/stop audio recording |
| 📊 Visualization | ✅ | Real-time audio waveform |
| 📝 Transcription | ✅ | Speech-to-text with Whisper API |
| 😰 Emotions | ✅ | Detect stress and emotions |
| 🚨 Emergency | ✅ | Auto-detect emergency keywords |
| 📍 Location | ✅ | GPS tagging |
| 💾 Storage | ✅ | MongoDB with auto-expiration |

---

## 🔌 API Endpoints

### Upload Recording
```javascript
POST /api/voice/upload
FormData: { audio, userId, issueId?, latitude?, longitude? }
```

### Analyze Recording
```javascript
POST /api/voice/analyze
FormData: { recordingId }
```

### Get Recordings
```javascript
GET /api/voice/upload?userId=123&limit=50
```

---

## 🎨 Customization

### Change Colors

Edit emotion colors in `aiAnalysisService.js`:
```javascript
export function getEmotionColor(emotion) {
  const colors = {
    CALM: 'from-green-400 to-emerald-500',
    STRESSED: 'from-orange-400 to-red-500',
    // Add your colors...
  };
  return colors[emotion];
}
```

### Adjust Recording Quality

In `VoiceRecorder.js`:
```javascript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm',
  audioBitsPerSecond: 128000 // Adjust bitrate
});
```

### Change Retention Period

In `VoiceRecording.js` model:
```javascript
autoDeleteAfterDays: {
  type: Number,
  default: 30 // Change to your preference
}
```

---

## 🧪 Testing

Run tests:
```bash
npm test
```

Test specific files:
```bash
npm test -- voiceRecording.model.test.js
npm test -- aiAnalysisService.test.js
```

---

## 🐛 Common Issues

### Microphone not working
- Ensure HTTPS connection
- Check browser permissions
- Try different browser

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### MongoDB connection error
- Check MONGODB_URI in .env.local
- Ensure MongoDB is running
- Verify network connectivity

---

## 📚 Documentation

- **Full Docs:** `VOICE_RECORDER_DOCUMENTATION.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY_ISSUE_9.md`
- **Code Examples:** Check test files

---

## 🎯 Next Steps

1. ✅ Review the demo page
2. ✅ Test recording functionality
3. ✅ Check API responses
4. ✅ Customize for your needs
5. ✅ Deploy to production

---

## 💡 Pro Tips

- Use mock data in development (no API key needed)
- Test on mobile devices for best experience
- Enable HTTPS for production deployment
- Monitor MongoDB storage usage
- Implement rate limiting for API routes

---

## 🆘 Need Help?

- Check `VOICE_RECORDER_DOCUMENTATION.md` for detailed info
- Review test files for usage examples
- Inspect browser console for errors
- Check MongoDB logs for database issues

---

**Happy Recording! 🎙️**
