/**
 * AI Analysis Service
 * Provides transcription and emotion analysis for voice recordings
 * Integrates with OpenAI Whisper and custom emotion detection
 */

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {Buffer|Blob} audioFile - Audio file to transcribe
 * @param {Object} options - Transcription options
 * @returns {Promise<Object>} Transcription results
 */
export async function transcribeAudio(audioFile, options = {}) {
  try {
    const {
      language = 'es',
      model = 'whisper-1',
      responseFormat = 'verbose_json',
      temperature = 0
    } = options;

    // For demo/development: Mock transcription
    if (process.env.NODE_ENV === 'development' && !process.env.OPENAI_API_KEY) {
      return mockTranscription(audioFile);
    }

    // Create FormData for API request
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', model);
    formData.append('language', language);
    formData.append('response_format', responseFormat);
    formData.append('temperature', temperature);

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Format response
    return {
      text: data.text,
      language: data.language || language,
      confidence: calculateConfidence(data),
      segments: formatSegments(data.segments || []),
      provider: 'WHISPER',
      duration: data.duration
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

/**
 * Analyze emotions from audio file
 * @param {Buffer|Blob} audioFile - Audio file to analyze
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Emotion analysis results
 */
export async function analyzeEmotions(audioFile, options = {}) {
  try {
    // For demo/development: Mock emotion analysis
    if (process.env.NODE_ENV === 'development' && !process.env.EMOTION_API_KEY) {
      return mockEmotionAnalysis(audioFile);
    }

    // Extract audio features
    const audioFeatures = await extractAudioFeatures(audioFile);

    // Analyze emotions based on audio features
    const emotions = detectEmotionsFromFeatures(audioFeatures);

    // Calculate overall stress level
    const stressLevel = calculateStressLevel(emotions, audioFeatures);

    // Determine primary emotion
    const primaryEmotion = emotions.reduce((prev, current) => 
      (current.confidence > prev.confidence) ? current : prev
    );

    return {
      primaryEmotion: primaryEmotion.emotion,
      emotions: emotions,
      overallStressLevel: stressLevel,
      audioFeatures: audioFeatures,
      provider: 'CUSTOM'
    };
  } catch (error) {
    console.error('Emotion analysis error:', error);
    throw new Error(`Failed to analyze emotions: ${error.message}`);
  }
}

/**
 * Extract audio features from file
 * @param {Buffer|Blob} audioFile - Audio file
 * @returns {Promise<Object>} Audio features
 */
async function extractAudioFeatures(audioFile) {
  // In a real implementation, this would use Web Audio API or a library like meyda.js
  // For now, we'll return mock features based on file characteristics
  
  const fileSize = audioFile.size || audioFile.length;
  const duration = estimateDuration(fileSize);

  // Mock feature extraction
  return {
    averagePitch: 150 + Math.random() * 100, // Hz
    pitchVariation: 20 + Math.random() * 30, // Hz
    averageVolume: 0.5 + Math.random() * 0.3, // 0-1
    volumeVariation: 0.1 + Math.random() * 0.2, // 0-1
    speechRate: 120 + Math.random() * 60, // words per minute
    pauseFrequency: 5 + Math.random() * 10 // pauses per minute
  };
}

/**
 * Detect emotions from audio features
 * @param {Object} features - Audio features
 * @returns {Array<Object>} Detected emotions with confidence
 */
function detectEmotionsFromFeatures(features) {
  const emotions = [];

  // High pitch + high variation = Stressed/Anxious
  if (features.averagePitch > 200 && features.pitchVariation > 40) {
    emotions.push({ emotion: 'STRESSED', confidence: 0.75, timestamp: 0 });
    emotions.push({ emotion: 'ANXIOUS', confidence: 0.65, timestamp: 0 });
  }

  // High volume + high variation = Angry
  if (features.averageVolume > 0.7 && features.volumeVariation > 0.2) {
    emotions.push({ emotion: 'ANGRY', confidence: 0.70, timestamp: 0 });
  }

  // Low volume + low variation = Sad/Fearful
  if (features.averageVolume < 0.4 && features.volumeVariation < 0.15) {
    emotions.push({ emotion: 'SAD', confidence: 0.60, timestamp: 0 });
    emotions.push({ emotion: 'FEARFUL', confidence: 0.55, timestamp: 0 });
  }

  // High speech rate + high pause frequency = Anxious/Distressed
  if (features.speechRate > 150 && features.pauseFrequency > 12) {
    emotions.push({ emotion: 'ANXIOUS', confidence: 0.68, timestamp: 0 });
    emotions.push({ emotion: 'DISTRESSED', confidence: 0.72, timestamp: 0 });
  }

  // Low speech rate + low pause frequency = Calm
  if (features.speechRate < 130 && features.pauseFrequency < 8) {
    emotions.push({ emotion: 'CALM', confidence: 0.65, timestamp: 0 });
  }

  // Moderate values = Neutral
  if (emotions.length === 0) {
    emotions.push({ emotion: 'NEUTRAL', confidence: 0.70, timestamp: 0 });
  }

  // Sort by confidence
  return emotions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Calculate overall stress level
 * @param {Array<Object>} emotions - Detected emotions
 * @param {Object} features - Audio features
 * @returns {Number} Stress level (0-10)
 */
function calculateStressLevel(emotions, features) {
  let stressScore = 5; // baseline

  // Adjust based on emotions
  emotions.forEach(emotion => {
    switch (emotion.emotion) {
      case 'STRESSED':
      case 'ANXIOUS':
      case 'DISTRESSED':
        stressScore += emotion.confidence * 3;
        break;
      case 'ANGRY':
      case 'FEARFUL':
        stressScore += emotion.confidence * 2.5;
        break;
      case 'SAD':
        stressScore += emotion.confidence * 1.5;
        break;
      case 'CALM':
        stressScore -= emotion.confidence * 2;
        break;
      case 'NEUTRAL':
        stressScore -= emotion.confidence * 0.5;
        break;
    }
  });

  // Adjust based on audio features
  if (features.pitchVariation > 40) stressScore += 1;
  if (features.volumeVariation > 0.25) stressScore += 1;
  if (features.speechRate > 160) stressScore += 1;
  if (features.pauseFrequency > 15) stressScore += 1;

  // Clamp to 0-10 range
  return Math.max(0, Math.min(10, Math.round(stressScore)));
}

/**
 * Calculate confidence from Whisper response
 * @param {Object} data - Whisper API response
 * @returns {Number} Confidence score (0-1)
 */
function calculateConfidence(data) {
  if (data.segments && data.segments.length > 0) {
    const avgConfidence = data.segments.reduce((sum, seg) => 
      sum + (seg.avg_logprob || 0), 0
    ) / data.segments.length;
    
    // Convert log probability to confidence (approximate)
    return Math.max(0, Math.min(1, (avgConfidence + 1) / 2));
  }
  return 0.85; // default confidence
}

/**
 * Format segments from Whisper response
 * @param {Array} segments - Raw segments
 * @returns {Array} Formatted segments
 */
function formatSegments(segments) {
  return segments.map(seg => ({
    text: seg.text,
    start: seg.start,
    end: seg.end,
    confidence: seg.avg_logprob ? Math.max(0, Math.min(1, (seg.avg_logprob + 1) / 2)) : 0.85
  }));
}

/**
 * Estimate audio duration from file size
 * @param {Number} fileSize - File size in bytes
 * @returns {Number} Estimated duration in seconds
 */
function estimateDuration(fileSize) {
  // Rough estimate: ~16KB per second for compressed audio
  return Math.round(fileSize / 16000);
}

/**
 * Mock transcription for development
 * @param {Buffer|Blob} audioFile - Audio file
 * @returns {Object} Mock transcription
 */
function mockTranscription(audioFile) {
  const mockTexts = [
    'Necesito ayuda urgente. Estoy en una situación de peligro.',
    'Me encuentro en la calle Principal número 123. Por favor envíen ayuda.',
    'Hay una persona amenazándome. Tengo miedo por mi seguridad.',
    'Estoy siendo víctima de violencia doméstica. Necesito asistencia legal.',
    'Me detuvieron sin motivo aparente. Necesito contactar a un abogado.'
  ];

  const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
  const duration = estimateDuration(audioFile.size || audioFile.length);

  return {
    text: randomText,
    language: 'es',
    confidence: 0.85 + Math.random() * 0.1,
    segments: [
      {
        text: randomText,
        start: 0,
        end: duration,
        confidence: 0.85 + Math.random() * 0.1
      }
    ],
    provider: 'WHISPER',
    duration: duration
  };
}

/**
 * Mock emotion analysis for development
 * @param {Buffer|Blob} audioFile - Audio file
 * @returns {Object} Mock emotion analysis
 */
function mockEmotionAnalysis(audioFile) {
  const emotionSets = [
    {
      primary: 'STRESSED',
      emotions: [
        { emotion: 'STRESSED', confidence: 0.78, timestamp: 0 },
        { emotion: 'ANXIOUS', confidence: 0.65, timestamp: 0 },
        { emotion: 'FEARFUL', confidence: 0.52, timestamp: 0 }
      ],
      stressLevel: 8
    },
    {
      primary: 'FEARFUL',
      emotions: [
        { emotion: 'FEARFUL', confidence: 0.82, timestamp: 0 },
        { emotion: 'ANXIOUS', confidence: 0.70, timestamp: 0 },
        { emotion: 'DISTRESSED', confidence: 0.68, timestamp: 0 }
      ],
      stressLevel: 9
    },
    {
      primary: 'ANGRY',
      emotions: [
        { emotion: 'ANGRY', confidence: 0.75, timestamp: 0 },
        { emotion: 'STRESSED', confidence: 0.60, timestamp: 0 }
      ],
      stressLevel: 7
    },
    {
      primary: 'ANXIOUS',
      emotions: [
        { emotion: 'ANXIOUS', confidence: 0.72, timestamp: 0 },
        { emotion: 'STRESSED', confidence: 0.58, timestamp: 0 },
        { emotion: 'NEUTRAL', confidence: 0.45, timestamp: 0 }
      ],
      stressLevel: 6
    }
  ];

  const randomSet = emotionSets[Math.floor(Math.random() * emotionSets.length)];

  return {
    primaryEmotion: randomSet.primary,
    emotions: randomSet.emotions,
    overallStressLevel: randomSet.stressLevel,
    audioFeatures: {
      averagePitch: 150 + Math.random() * 100,
      pitchVariation: 20 + Math.random() * 30,
      averageVolume: 0.5 + Math.random() * 0.3,
      volumeVariation: 0.1 + Math.random() * 0.2,
      speechRate: 120 + Math.random() * 60,
      pauseFrequency: 5 + Math.random() * 10
    },
    provider: 'CUSTOM'
  };
}

/**
 * Process complete audio analysis (transcription + emotion)
 * @param {Buffer|Blob} audioFile - Audio file to analyze
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Complete analysis results
 */
export async function processAudioAnalysis(audioFile, options = {}) {
  try {
    // Run transcription and emotion analysis in parallel
    const [transcription, emotions] = await Promise.all([
      transcribeAudio(audioFile, options.transcription),
      analyzeEmotions(audioFile, options.emotion)
    ]);

    return {
      transcription,
      emotionAnalysis: emotions,
      processedAt: new Date(),
      success: true
    };
  } catch (error) {
    console.error('Audio analysis error:', error);
    return {
      success: false,
      error: error.message,
      processedAt: new Date()
    };
  }
}

/**
 * Validate audio file
 * @param {File|Blob} file - Audio file to validate
 * @returns {Object} Validation result
 */
export function validateAudioFile(file) {
  const errors = [];
  
  // Check file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  // Check file size (max 25MB)
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push(`File size exceeds maximum of 25MB (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }

  // Check file type
  const validTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
  if (file.type && !validTypes.includes(file.type)) {
    errors.push(`Invalid file type: ${file.type}. Supported types: ${validTypes.join(', ')}`);
  }

  // Check duration (if available) - max 10 minutes
  if (file.duration && file.duration > 600) {
    errors.push(`Recording too long: ${Math.round(file.duration)}s. Maximum: 600s (10 minutes)`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Convert audio blob to base64
 * @param {Blob} blob - Audio blob
 * @returns {Promise<String>} Base64 encoded audio
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get emotion color for UI display
 * @param {String} emotion - Emotion name
 * @returns {String} Tailwind color class
 */
export function getEmotionColor(emotion) {
  const colors = {
    CALM: 'from-green-400 to-emerald-500',
    STRESSED: 'from-orange-400 to-red-500',
    FEARFUL: 'from-purple-400 to-pink-500',
    ANGRY: 'from-red-500 to-red-700',
    SAD: 'from-blue-400 to-indigo-500',
    ANXIOUS: 'from-yellow-400 to-orange-500',
    NEUTRAL: 'from-gray-400 to-gray-500',
    DISTRESSED: 'from-red-600 to-pink-600'
  };
  return colors[emotion] || 'from-gray-400 to-gray-500';
}

/**
 * Get emotion icon for UI display
 * @param {String} emotion - Emotion name
 * @returns {String} Emoji icon
 */
export function getEmotionIcon(emotion) {
  const icons = {
    CALM: '😌',
    STRESSED: '😰',
    FEARFUL: '😨',
    ANGRY: '😠',
    SAD: '😢',
    ANXIOUS: '😟',
    NEUTRAL: '😐',
    DISTRESSED: '😱'
  };
  return icons[emotion] || '😐';
}

/**
 * Format stress level for display
 * @param {Number} level - Stress level (0-10)
 * @returns {Object} Formatted stress info
 */
export function formatStressLevel(level) {
  if (level <= 3) {
    return { label: 'Bajo', color: 'text-green-600', bgColor: 'bg-green-100' };
  } else if (level <= 6) {
    return { label: 'Moderado', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  } else if (level <= 8) {
    return { label: 'Alto', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  } else {
    return { label: 'Crítico', color: 'text-red-600', bgColor: 'bg-red-100' };
  }
}
