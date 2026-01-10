import mongoose from 'mongoose';

/**
 * VoiceRecording Model
 * Stores voice recordings with AI analysis (transcription and emotion detection)
 * for emergency situations and legal evidence
 */

const voiceRecordingSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Issue reference (optional - can be attached later)
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    index: true
  },

  // Recording metadata
  filename: {
    type: String,
    required: true
  },

  duration: {
    type: Number, // in seconds
    required: true,
    min: 0
  },

  fileSize: {
    type: Number, // in bytes
    required: true,
    min: 0
  },

  mimeType: {
    type: String,
    default: 'audio/webm'
  },

  // Storage information
  storageUrl: {
    type: String,
    required: true
  },

  storageProvider: {
    type: String,
    enum: ['LOCAL', 'CLOUDINARY', 'S3', 'AZURE'],
    default: 'LOCAL'
  },

  // Recording context
  recordedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },

  location: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    accuracy: Number,
    address: String
  },

  // Transcription results
  transcription: {
    text: {
      type: String,
      maxlength: 50000
    },
    language: {
      type: String,
      default: 'es'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    segments: [{
      text: String,
      start: Number, // timestamp in seconds
      end: Number,
      confidence: Number
    }],
    processedAt: Date,
    provider: {
      type: String,
      enum: ['WHISPER', 'GOOGLE', 'AZURE', 'AWS'],
      default: 'WHISPER'
    }
  },

  // Emotion analysis results
  emotionAnalysis: {
    primaryEmotion: {
      type: String,
      enum: ['CALM', 'STRESSED', 'FEARFUL', 'ANGRY', 'SAD', 'ANXIOUS', 'NEUTRAL', 'DISTRESSED']
    },
    emotions: [{
      emotion: {
        type: String,
        enum: ['CALM', 'STRESSED', 'FEARFUL', 'ANGRY', 'SAD', 'ANXIOUS', 'NEUTRAL', 'DISTRESSED']
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      timestamp: Number // when in recording this emotion was detected
    }],
    overallStressLevel: {
      type: Number,
      min: 0,
      max: 10
    },
    audioFeatures: {
      averagePitch: Number,
      pitchVariation: Number,
      averageVolume: Number,
      volumeVariation: Number,
      speechRate: Number, // words per minute
      pauseFrequency: Number
    },
    processedAt: Date,
    provider: {
      type: String,
      default: 'CUSTOM'
    }
  },

  // Analysis status
  analysisStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIAL'],
    default: 'PENDING',
    index: true
  },

  analysisError: {
    message: String,
    code: String,
    timestamp: Date
  },

  // Emergency flags
  isEmergency: {
    type: Boolean,
    default: false,
    index: true
  },

  emergencyKeywords: [{
    keyword: String,
    timestamp: Number,
    context: String
  }],

  // Privacy and security
  isEncrypted: {
    type: Boolean,
    default: false
  },

  encryptionKey: String, // Hashed encryption key reference

  // Retention policy
  expiresAt: {
    type: Date
  },

  autoDeleteAfterDays: {
    type: Number,
    default: 30
  },

  // Metadata
  tags: [String],

  notes: {
    type: String,
    maxlength: 2000
  },

  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },

  deletedAt: Date,

  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
voiceRecordingSchema.index({ user: 1, recordedAt: -1 });
voiceRecordingSchema.index({ issue: 1, recordedAt: -1 });
voiceRecordingSchema.index({ isEmergency: 1, recordedAt: -1 });
voiceRecordingSchema.index({ analysisStatus: 1, createdAt: 1 });
voiceRecordingSchema.index({ expiresAt: 1 }, { sparse: true });

// Virtual properties
voiceRecordingSchema.virtual('durationFormatted').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

voiceRecordingSchema.virtual('fileSizeFormatted').get(function() {
  const kb = this.fileSize / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
});

voiceRecordingSchema.virtual('hasTranscription').get(function() {
  return !!(this.transcription && this.transcription.text);
});

voiceRecordingSchema.virtual('hasEmotionAnalysis').get(function() {
  return !!(this.emotionAnalysis && this.emotionAnalysis.primaryEmotion);
});

voiceRecordingSchema.virtual('isAnalysisComplete').get(function() {
  return this.analysisStatus === 'COMPLETED' && this.hasTranscription && this.hasEmotionAnalysis;
});

// Instance methods

/**
 * Set expiration date based on retention policy
 */
voiceRecordingSchema.methods.setExpiration = function() {
  if (this.autoDeleteAfterDays > 0) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.autoDeleteAfterDays);
    this.expiresAt = expirationDate;
  }
  return this;
};

/**
 * Update transcription results
 */
voiceRecordingSchema.methods.updateTranscription = async function(transcriptionData) {
  this.transcription = {
    ...this.transcription,
    ...transcriptionData,
    processedAt: new Date()
  };
  
  // Check for emergency keywords
  if (transcriptionData.text) {
    this.detectEmergencyKeywords(transcriptionData.text);
  }
  
  this.updateAnalysisStatus();
  return this.save();
};

/**
 * Update emotion analysis results
 */
voiceRecordingSchema.methods.updateEmotionAnalysis = async function(emotionData) {
  this.emotionAnalysis = {
    ...this.emotionAnalysis,
    ...emotionData,
    processedAt: new Date()
  };
  
  // Set emergency flag based on stress level
  if (emotionData.overallStressLevel >= 7) {
    this.isEmergency = true;
  }
  
  this.updateAnalysisStatus();
  return this.save();
};

/**
 * Detect emergency keywords in transcription
 */
voiceRecordingSchema.methods.detectEmergencyKeywords = function(text) {
  const emergencyKeywords = [
    'ayuda', 'auxilio', 'socorro', 'emergencia', 'peligro',
    'policía', 'ambulancia', 'violencia', 'golpe', 'amenaza',
    'secuestro', 'robo', 'asalto', 'agresión', 'abuso'
  ];
  
  const lowerText = text.toLowerCase();
  const foundKeywords = [];
  
  emergencyKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      foundKeywords.push({
        keyword,
        context: this.extractContext(lowerText, keyword)
      });
      this.isEmergency = true;
    }
  });
  
  if (foundKeywords.length > 0) {
    this.emergencyKeywords = foundKeywords;
  }
};

/**
 * Extract context around a keyword
 */
voiceRecordingSchema.methods.extractContext = function(text, keyword, contextLength = 50) {
  const index = text.indexOf(keyword);
  if (index === -1) return '';
  
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + keyword.length + contextLength);
  
  return text.substring(start, end);
};

/**
 * Update analysis status based on completion
 */
voiceRecordingSchema.methods.updateAnalysisStatus = function() {
  const hasTranscription = !!(this.transcription && this.transcription.text);
  const hasEmotion = !!(this.emotionAnalysis && this.emotionAnalysis.primaryEmotion);
  
  if (hasTranscription && hasEmotion) {
    this.analysisStatus = 'COMPLETED';
  } else if (hasTranscription || hasEmotion) {
    this.analysisStatus = 'PARTIAL';
  }
};

/**
 * Attach recording to an issue
 */
voiceRecordingSchema.methods.attachToIssue = async function(issueId) {
  this.issue = issueId;
  return this.save();
};

/**
 * Soft delete recording
 */
voiceRecordingSchema.methods.softDelete = async function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

/**
 * Mark as emergency
 */
voiceRecordingSchema.methods.markAsEmergency = async function() {
  this.isEmergency = true;
  return this.save();
};

// Static methods

/**
 * Find active recordings (not deleted)
 */
voiceRecordingSchema.statics.findActive = function() {
  return this.find({ isDeleted: false });
};

/**
 * Find recordings by user
 */
voiceRecordingSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user: userId, isDeleted: false };
  
  if (options.isEmergency !== undefined) {
    query.isEmergency = options.isEmergency;
  }
  
  if (options.analysisStatus) {
    query.analysisStatus = options.analysisStatus;
  }
  
  return this.find(query)
    .sort({ recordedAt: -1 })
    .limit(options.limit || 50);
};

/**
 * Find recordings by issue
 */
voiceRecordingSchema.statics.findByIssue = function(issueId) {
  return this.find({ issue: issueId, isDeleted: false })
    .sort({ recordedAt: -1 });
};

/**
 * Find emergency recordings
 */
voiceRecordingSchema.statics.findEmergencies = function(options = {}) {
  const query = { isEmergency: true, isDeleted: false };
  
  if (options.userId) {
    query.user = options.userId;
  }
  
  return this.find(query)
    .sort({ recordedAt: -1 })
    .limit(options.limit || 20);
};

/**
 * Find recordings pending analysis
 */
voiceRecordingSchema.statics.findPendingAnalysis = function() {
  return this.find({
    analysisStatus: { $in: ['PENDING', 'PROCESSING'] },
    isDeleted: false
  })
  .sort({ createdAt: 1 })
  .limit(100);
};

/**
 * Find expired recordings for cleanup
 */
voiceRecordingSchema.statics.findExpired = function() {
  return this.find({
    expiresAt: { $lte: new Date() },
    isDeleted: false
  });
};

/**
 * Get statistics for user
 */
voiceRecordingSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), isDeleted: false } },
    {
      $group: {
        _id: null,
        totalRecordings: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        totalSize: { $sum: '$fileSize' },
        emergencyCount: {
          $sum: { $cond: ['$isEmergency', 1, 0] }
        },
        analyzedCount: {
          $sum: { $cond: [{ $eq: ['$analysisStatus', 'COMPLETED'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalRecordings: 0,
    totalDuration: 0,
    totalSize: 0,
    emergencyCount: 0,
    analyzedCount: 0
  };
};

// Middleware

// Set expiration before saving
voiceRecordingSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.setExpiration();
  }
  next();
});

// Prevent modification of deleted recordings
voiceRecordingSchema.pre('save', function(next) {
  if (!this.isNew && this.isDeleted && this.isModified() && !this.isModified('isDeleted')) {
    return next(new Error('Cannot modify deleted recording'));
  }
  next();
});

// Export model
const VoiceRecording = mongoose.models.VoiceRecording || mongoose.model('VoiceRecording', voiceRecordingSchema);

export default VoiceRecording;
