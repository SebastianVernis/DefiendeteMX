import mongoose from 'mongoose';

/**
 * Chat Model
 * Manages AI chatbot conversations for legal and emotional assistance
 */

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentiment: {
    type: String,
    enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'DISTRESSED', 'CRISIS'],
    default: 'NEUTRAL'
  },
  metadata: {
    tokens: Number,
    processingTime: Number,
    confidence: { type: Number, min: 0, max: 1 },
    detectedIntent: String,
    suggestedActions: [String]
  }
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  helpful: Boolean,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  messages: {
    type: [messageSchema],
    default: [],
    validate: {
      validator: function(messages) {
        return messages.length <= 500;
      },
      message: 'Conversation cannot exceed 500 messages'
    }
  },
  context: {
    legalScenario: {
      type: String,
      enum: [
        'DETENCION_POLICIAL',
        'VIOLENCIA_DOMESTICA',
        'VIOLENCIA_SEXUAL',
        'ACOSO_LABORAL',
        'DISCRIMINACION',
        'ABUSO_AUTORIDAD',
        'DERECHOS_CONSUMIDOR',
        'GENERAL',
        'OTRO'
      ]
    },
    emotionalState: {
      type: String,
      enum: ['CALM', 'ANXIOUS', 'DISTRESSED', 'CRISIS', 'UNKNOWN'],
      default: 'UNKNOWN'
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW'
    },
    needsEmergencyHelp: {
      type: Boolean,
      default: false
    },
    relatedIssue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    }
  },
  crisisDetection: {
    detected: {
      type: Boolean,
      default: false
    },
    detectedAt: Date,
    keywords: [String],
    interventionTriggered: {
      type: Boolean,
      default: false
    },
    interventionDetails: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'ENDED', 'ARCHIVED'],
    default: 'ACTIVE',
    index: true
  },
  feedback: feedbackSchema,
  overallSatisfaction: {
    type: Number,
    min: 1,
    max: 5
  },
  language: {
    type: String,
    enum: ['es', 'en'],
    default: 'es'
  },
  deviceInfo: {
    type: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown'
    },
    userAgent: String
  },
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    userMessages: {
      type: Number,
      default: 0
    },
    assistantMessages: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    sessionDuration: Number,
    topicsDiscussed: [String]
  },
  startedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  endedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: Date
}, {
  timestamps: true,
  collection: 'chats'
});

// Indexes
chatSchema.index({ user: 1, startedAt: -1 });
chatSchema.index({ user: 1, status: 1 });
chatSchema.index({ sessionId: 1, status: 1 });
chatSchema.index({ 'context.legalScenario': 1 });
chatSchema.index({ 'context.riskLevel': 1 });
chatSchema.index({ 'crisisDetection.detected': 1 });
chatSchema.index({ createdAt: -1 });

// Virtuals
chatSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

chatSchema.virtual('duration').get(function() {
  if (this.endedAt) {
    return Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  return Math.floor((Date.now() - this.startedAt) / 1000);
});

// Instance Methods
chatSchema.methods.addMessage = function(role, content, metadata = {}) {
  const message = {
    role,
    content,
    timestamp: new Date(),
    sentiment: metadata.sentiment || 'NEUTRAL',
    metadata: {
      tokens: metadata.tokens,
      processingTime: metadata.processingTime,
      confidence: metadata.confidence,
      detectedIntent: metadata.detectedIntent,
      suggestedActions: metadata.suggestedActions || []
    }
  };

  this.messages.push(message);
  this.lastMessageAt = new Date();
  this.analytics.totalMessages = this.messages.length;
  
  if (role === 'user') {
    this.analytics.userMessages += 1;
  } else if (role === 'assistant') {
    this.analytics.assistantMessages += 1;
  }

  if (!this.title && role === 'user' && this.messages.length <= 2) {
    this.title = content.substring(0, 100) + (content.length > 100 ? '...' : '');
  }

  return this.save();
};

chatSchema.methods.detectCrisis = function(keywords = []) {
  this.crisisDetection.detected = true;
  this.crisisDetection.detectedAt = new Date();
  this.crisisDetection.keywords = keywords;
  this.context.needsEmergencyHelp = true;
  this.context.riskLevel = 'CRITICAL';
  this.context.emotionalState = 'CRISIS';
  return this.save();
};

chatSchema.methods.triggerIntervention = function(details) {
  this.crisisDetection.interventionTriggered = true;
  this.crisisDetection.interventionDetails = details;
  return this.save();
};

chatSchema.methods.updateContext = function(contextUpdates) {
  Object.assign(this.context, contextUpdates);
  return this.save();
};

chatSchema.methods.endSession = function() {
  this.status = 'ENDED';
  this.endedAt = new Date();
  this.analytics.sessionDuration = Math.floor((this.endedAt - this.startedAt) / 1000);
  return this.save();
};

chatSchema.methods.addFeedback = function(rating, comment = '', helpful = null) {
  this.feedback = {
    rating,
    comment,
    helpful,
    timestamp: new Date()
  };
  this.overallSatisfaction = rating;
  return this.save();
};

chatSchema.methods.getSummary = function() {
  return {
    sessionId: this.sessionId,
    title: this.title,
    messageCount: this.messages.length,
    duration: this.duration,
    status: this.status,
    legalScenario: this.context.legalScenario,
    riskLevel: this.context.riskLevel,
    crisisDetected: this.crisisDetection.detected,
    satisfaction: this.overallSatisfaction,
    startedAt: this.startedAt,
    endedAt: this.endedAt
  };
};

chatSchema.methods.exportAsText = function() {
  let text = `Chat Session: ${this.title || 'Untitled'}\n`;
  text += `Session ID: ${this.sessionId}\n`;
  text += `Started: ${this.startedAt.toLocaleString('es-MX')}\n`;
  text += `Status: ${this.status}\n\n`;
  text += `${'='.repeat(50)}\n\n`;

  this.messages.forEach((msg) => {
    const role = msg.role === 'user' ? 'Usuario' : 'Asistente';
    const time = msg.timestamp.toLocaleTimeString('es-MX');
    text += `[${time}] ${role}:\n${msg.content}\n\n`;
  });

  return text;
};

// Static Methods
chatSchema.statics.createSession = async function(userId, sessionId, metadata = {}) {
  const chat = new this({
    user: userId,
    sessionId,
    language: metadata.language || 'es',
    deviceInfo: metadata.deviceInfo || {},
    context: {
      legalScenario: metadata.legalScenario || 'GENERAL',
      emotionalState: 'UNKNOWN',
      riskLevel: 'LOW'
    }
  });

  return await chat.save();
};

chatSchema.statics.getActiveSessions = async function(userId) {
  return await this.find({
    user: userId,
    status: 'ACTIVE',
    isDeleted: false
  })
  .sort({ lastMessageAt: -1 })
  .limit(10);
};

chatSchema.statics.getChatHistory = async function(userId, options = {}) {
  const {
    limit = 20,
    skip = 0,
    status = null,
    legalScenario = null
  } = options;

  const query = {
    user: userId,
    isDeleted: false
  };

  if (status) query.status = status;
  if (legalScenario) query['context.legalScenario'] = legalScenario;

  return await this.find(query)
    .sort({ startedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('sessionId title status context.legalScenario context.riskLevel startedAt lastMessageAt analytics.totalMessages overallSatisfaction');
};

chatSchema.statics.getCrisisConversations = async function(options = {}) {
  const { limit = 50, resolved = false } = options;

  return await this.find({
    'crisisDetection.detected': true,
    'crisisDetection.interventionTriggered': resolved,
    isDeleted: false
  })
  .populate('user', 'fullName email phone')
  .sort({ 'crisisDetection.detectedAt': -1 })
  .limit(limit);
};

chatSchema.statics.getUserAnalytics = async function(userId) {
  const chats = await this.find({ user: userId, isDeleted: false });

  return {
    totalSessions: chats.length,
    activeSessions: chats.filter(c => c.status === 'ACTIVE').length,
    totalMessages: chats.reduce((sum, c) => sum + c.messages.length, 0),
    averageSatisfaction: chats
      .filter(c => c.overallSatisfaction)
      .reduce((sum, c, _, arr) => sum + c.overallSatisfaction / arr.length, 0),
    crisisDetections: chats.filter(c => c.crisisDetection.detected).length,
    topScenarios: this._getTopScenarios(chats),
    totalDuration: chats.reduce((sum, c) => sum + (c.analytics.sessionDuration || 0), 0)
  };
};

chatSchema.statics._getTopScenarios = function(chats) {
  const scenarios = {};
  chats.forEach(chat => {
    const scenario = chat.context.legalScenario;
    if (scenario) {
      scenarios[scenario] = (scenarios[scenario] || 0) + 1;
    }
  });
  return Object.entries(scenarios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([scenario, count]) => ({ scenario, count }));
};

// Middleware
chatSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

chatSchema.pre('save', function(next) {
  if (this.status === 'ENDED' && !this.isNew && this.isModified('messages')) {
    return next(new Error('Cannot modify ended chat session'));
  }
  next();
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
