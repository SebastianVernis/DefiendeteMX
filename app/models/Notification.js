import mongoose from 'mongoose';

/**
 * Notification Model
 * Tracks all notifications sent through the system (SMS, Email, Push)
 * Provides audit trail and delivery status tracking
 */

const NotificationSchema = new mongoose.Schema({
  // Notification Type
  type: {
    type: String,
    enum: {
      values: ['SMS', 'EMAIL', 'PUSH', 'IN_APP'],
      message: 'Tipo de notificación inválido'
    },
    required: [true, 'Tipo de notificación es requerido'],
    index: true
  },
  
  // Notification Category
  category: {
    type: String,
    enum: {
      values: [
        'EMERGENCY_ALERT',
        'ISSUE_UPDATE',
        'STATUS_CHANGE',
        'COURT_REMINDER',
        'SAFETY_CHECK',
        'SYSTEM_NOTIFICATION',
        'CUSTOM'
      ],
      message: 'Categoría inválida'
    },
    required: [true, 'Categoría es requerida'],
    index: true
  },
  
  // Priority Level
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'],
    default: 'MEDIUM',
    required: true,
    index: true
  },
  
  // Recipient Information
  recipient: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos']
    },
    email: String,
    deviceToken: String // For push notifications
  },
  
  // Sender Information
  sender: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    system: {
      type: Boolean,
      default: false
    }
  },
  
  // Message Content
  message: {
    subject: String,
    body: {
      type: String,
      required: [true, 'Mensaje es requerido'],
      maxlength: [1600, 'Mensaje no puede exceder 1600 caracteres'] // SMS limit consideration
    },
    template: String,
    variables: mongoose.Schema.Types.Mixed // Template variables
  },
  
  // Related Entities
  relatedIssue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    index: true
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // Delivery Status
  status: {
    type: String,
    enum: {
      values: [
        'PENDING',
        'QUEUED',
        'SENDING',
        'SENT',
        'DELIVERED',
        'FAILED',
        'BOUNCED',
        'REJECTED',
        'CANCELLED'
      ],
      message: 'Estado inválido'
    },
    default: 'PENDING',
    required: true,
    index: true
  },
  
  // Delivery Tracking
  delivery: {
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date,
    failedAt: Date,
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    nextRetryAt: Date
  },
  
  // Provider Information (for SMS/Email)
  provider: {
    name: {
      type: String,
      enum: ['TWILIO', 'SENDGRID', 'FIREBASE', 'CUSTOM', 'SYSTEM']
    },
    messageId: String, // Provider's message ID
    cost: Number, // Cost in cents/pesos
    currency: {
      type: String,
      default: 'MXN'
    },
    response: mongoose.Schema.Types.Mixed // Provider response data
  },
  
  // Error Tracking
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed,
    occurredAt: Date
  },
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    deviceInfo: String,
    tags: [String]
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    index: true
  },
  expiresAt: Date,
  
  // Batch Information
  batchId: {
    type: String,
    index: true
  },
  batchSize: Number,
  batchIndex: Number,
  
  // User Actions
  userActions: {
    opened: {
      type: Boolean,
      default: false
    },
    openedAt: Date,
    clicked: {
      type: Boolean,
      default: false
    },
    clickedAt: Date,
    dismissed: {
      type: Boolean,
      default: false
    },
    dismissedAt: Date
  },
  
  // Compliance & Privacy
  consentGiven: {
    type: Boolean,
    default: false
  },
  consentTimestamp: Date,
  optedOut: {
    type: Boolean,
    default: false
  },
  optedOutAt: Date,
  
  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
NotificationSchema.index({ type: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ 'recipient.userId': 1, createdAt: -1 });
NotificationSchema.index({ relatedIssue: 1, type: 1 });
NotificationSchema.index({ category: 1, priority: -1 });
NotificationSchema.index({ status: 1, scheduledFor: 1 });
NotificationSchema.index({ batchId: 1, batchIndex: 1 });
NotificationSchema.index({ isDeleted: 1, status: 1 });

// Compound indexes
NotificationSchema.index({ 
  'recipient.userId': 1, 
  type: 1, 
  status: 1, 
  isDeleted: 1 
});

// Virtual for delivery time
NotificationSchema.virtual('deliveryTime').get(function() {
  if (this.delivery.sentAt && this.delivery.deliveredAt) {
    return this.delivery.deliveredAt - this.delivery.sentAt;
  }
  return null;
});

// Virtual for is expired
NotificationSchema.virtual('isExpired').get(function() {
  if (this.expiresAt) {
    return new Date() > this.expiresAt;
  }
  return false;
});

// Virtual for can retry
NotificationSchema.virtual('canRetry').get(function() {
  return this.status === 'FAILED' && 
         this.delivery.attempts < this.delivery.maxAttempts &&
         !this.isExpired;
});

// Pre-save hook
NotificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set delivery timestamps based on status
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'SENT':
        if (!this.delivery.sentAt) {
          this.delivery.sentAt = now;
        }
        break;
      case 'DELIVERED':
        if (!this.delivery.deliveredAt) {
          this.delivery.deliveredAt = now;
        }
        break;
      case 'FAILED':
        if (!this.delivery.failedAt) {
          this.delivery.failedAt = now;
        }
        this.delivery.attempts += 1;
        
        // Calculate next retry time (exponential backoff)
        if (this.canRetry) {
          const backoffMinutes = Math.pow(2, this.delivery.attempts) * 5; // 5, 10, 20 minutes
          this.delivery.nextRetryAt = new Date(now.getTime() + backoffMinutes * 60000);
        }
        break;
    }
  }
  
  next();
});

// Instance method to mark as sent
NotificationSchema.methods.markAsSent = function(providerResponse = {}) {
  this.status = 'SENT';
  this.delivery.sentAt = new Date();
  
  if (providerResponse.messageId) {
    this.provider.messageId = providerResponse.messageId;
  }
  if (providerResponse.cost) {
    this.provider.cost = providerResponse.cost;
  }
  
  this.provider.response = providerResponse;
  
  return this.save();
};

// Instance method to mark as delivered
NotificationSchema.methods.markAsDelivered = function() {
  this.status = 'DELIVERED';
  this.delivery.deliveredAt = new Date();
  return this.save();
};

// Instance method to mark as failed
NotificationSchema.methods.markAsFailed = function(errorInfo) {
  this.status = 'FAILED';
  this.delivery.failedAt = new Date();
  this.error = {
    code: errorInfo.code || 'UNKNOWN_ERROR',
    message: errorInfo.message || 'Unknown error occurred',
    details: errorInfo.details || {},
    occurredAt: new Date()
  };
  return this.save();
};

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.delivery.readAt = new Date();
  this.userActions.opened = true;
  this.userActions.openedAt = new Date();
  return this.save();
};

// Instance method to retry sending
NotificationSchema.methods.retry = function() {
  if (!this.canRetry) {
    throw new Error('Cannot retry this notification');
  }
  
  this.status = 'PENDING';
  this.delivery.nextRetryAt = null;
  return this.save();
};

// Static method to find pending notifications
NotificationSchema.statics.findPending = function() {
  return this.find({
    status: 'PENDING',
    isDeleted: false,
    $or: [
      { scheduledFor: { $lte: new Date() } },
      { scheduledFor: { $exists: false } }
    ]
  }).sort({ priority: -1, createdAt: 1 });
};

// Static method to find failed notifications ready for retry
NotificationSchema.statics.findReadyForRetry = function() {
  return this.find({
    status: 'FAILED',
    isDeleted: false,
    'delivery.attempts': { $lt: this.schema.path('delivery.maxAttempts').defaultValue },
    'delivery.nextRetryAt': { $lte: new Date() }
  }).sort({ priority: -1, createdAt: 1 });
};

// Static method to find by user
NotificationSchema.statics.findByUser = function(userId, options = {}) {
  const query = {
    'recipient.userId': userId,
    isDeleted: false
  };
  
  if (options.type) {
    query.type = options.type;
  }
  if (options.category) {
    query.category = options.category;
  }
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Static method to find by issue
NotificationSchema.statics.findByIssue = function(issueId) {
  return this.find({
    relatedIssue: issueId,
    isDeleted: false
  }).sort({ createdAt: -1 });
};

// Static method to get notification statistics
NotificationSchema.statics.getStats = function(userId = null, dateRange = {}) {
  const matchQuery = { isDeleted: false };
  
  if (userId) {
    matchQuery['recipient.userId'] = mongoose.Types.ObjectId(userId);
  }
  
  if (dateRange.start || dateRange.end) {
    matchQuery.createdAt = {};
    if (dateRange.start) matchQuery.createdAt.$gte = dateRange.start;
    if (dateRange.end) matchQuery.createdAt.$lte = dateRange.end;
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        sent: { $sum: { $cond: [{ $eq: ['$status', 'SENT'] }, 1, 0] } },
        delivered: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
        totalCost: { $sum: '$provider.cost' },
        avgDeliveryTime: { $avg: '$deliveryTime' }
      }
    }
  ]);
};

// Instance method for soft delete
NotificationSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Export model
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;
