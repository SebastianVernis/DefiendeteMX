import mongoose from 'mongoose';

/**
 * GovernmentReport Model - Track reports submitted to Mexican government authorities
 * Supports FGR (Fiscalía General de la República), Policía, and emergency services
 */

const GovernmentReportSchema = new mongoose.Schema({
  // Report Identification
  reportNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  reportType: {
    type: String,
    enum: {
      values: [
        'FGR_DENUNCIA',           // FGR Crime Report
        'POLICIA_REPORTE',        // Police Report
        'EMERGENCIA_911',         // Emergency 911
        'DENUNCIA_ANONIMA',       // Anonymous Report (089)
        'VIOLENCIA_DOMESTICA',    // Domestic Violence
        'DESAPARICION',           // Missing Person
        'OTRO'                    // Other
      ],
      message: 'Tipo de reporte inválido'
    },
    required: true
  },
  
  // Government Entity
  targetEntity: {
    type: String,
    enum: {
      values: [
        'FGR',                    // Fiscalía General de la República
        'POLICIA_FEDERAL',        // Federal Police
        'POLICIA_ESTATAL',        // State Police
        'POLICIA_MUNICIPAL',      // Municipal Police
        'GUARDIA_NACIONAL',       // National Guard
        'EMERGENCIAS_911',        // 911 Emergency
        'CNDH',                   // Comisión Nacional de Derechos Humanos
        'OTRO'
      ],
      message: 'Entidad gubernamental inválida'
    },
    required: true
  },
  
  // Link to Original Issue
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true,
    index: true
  },
  
  // User who created the report
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Report Status
  status: {
    type: String,
    enum: {
      values: [
        'BORRADOR',              // Draft
        'PENDIENTE',             // Pending submission
        'ENVIADO',               // Submitted
        'RECIBIDO',              // Acknowledged by authority
        'EN_PROCESO',            // In progress
        'REQUIERE_INFO',         // Requires additional information
        'RESUELTO',              // Resolved
        'CERRADO',               // Closed
        'RECHAZADO'              // Rejected
      ],
      message: 'Estado inválido'
    },
    default: 'BORRADOR',
    required: true
  },
  
  // Report Content
  reportData: {
    // Victim Information
    victim: {
      fullName: String,
      age: Number,
      gender: String,
      identification: String,
      phone: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
      }
    },
    
    // Incident Details
    incident: {
      date: Date,
      time: String,
      location: {
        address: String,
        city: String,
        state: String,
        coordinates: {
          latitude: Number,
          longitude: Number
        },
        description: String
      },
      description: String,
      category: String,
      severity: String
    },
    
    // Perpetrator Information
    perpetrator: {
      name: String,
      age: Number,
      gender: String,
      relationship: String,
      description: String,
      knownAddress: String,
      hasWeapons: Boolean,
      weaponDescription: String
    },
    
    // Witnesses
    witnesses: [{
      name: String,
      contact: String,
      relationship: String,
      statement: String
    }],
    
    // Evidence References
    evidenceFiles: [{
      filename: String,
      fileType: String,
      description: String,
      url: String
    }],
    
    // Additional Information
    additionalInfo: String,
    urgencyLevel: {
      type: String,
      enum: ['BAJO', 'MEDIO', 'ALTO', 'CRITICO']
    }
  },
  
  // Submission Details
  submission: {
    submittedAt: Date,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submissionMethod: {
      type: String,
      enum: ['API', 'MANUAL', 'WEB_FORM', 'PHONE', 'IN_PERSON']
    },
    confirmationNumber: String,
    receiptUrl: String,
    
    // For future API integration
    apiEndpoint: String,
    apiResponse: mongoose.Schema.Types.Mixed,
    apiRequestId: String
  },
  
  // Government Response
  governmentResponse: {
    caseNumber: String,           // Official case number from authority
    assignedOfficer: String,
    assignedDepartment: String,
    responseDate: Date,
    responseNotes: String,
    nextSteps: String,
    estimatedResolutionDate: Date,
    
    // Status updates from authority
    statusUpdates: [{
      status: String,
      date: Date,
      notes: String,
      updatedBy: String
    }]
  },
  
  // Follow-up Information
  followUp: {
    lastContactDate: Date,
    nextFollowUpDate: Date,
    contactMethod: String,
    contactPerson: String,
    notes: [String]
  },
  
  // Export History
  exports: [{
    format: {
      type: String,
      enum: ['PDF', 'JSON', 'XML', 'DOCX']
    },
    exportedAt: Date,
    exportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileUrl: String,
    purpose: String
  }],
  
  // Audit Trail
  auditLog: [{
    action: {
      type: String,
      enum: [
        'CREATED',
        'UPDATED',
        'SUBMITTED',
        'STATUS_CHANGED',
        'EXPORTED',
        'VIEWED',
        'DELETED'
      ]
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    details: String,
    ipAddress: String
  }],
  
  // Privacy and Security
  isConfidential: {
    type: Boolean,
    default: true
  },
  encryptionStatus: {
    type: String,
    enum: ['NONE', 'PARTIAL', 'FULL'],
    default: 'NONE'
  },
  
  // Metadata
  priority: {
    type: String,
    enum: ['BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA', 'CRITICO'],
    default: 'MEDIO'
  },
  tags: [String],
  notes: [String],
  
  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
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
GovernmentReportSchema.index({ user: 1, createdAt: -1 });
GovernmentReportSchema.index({ issue: 1 });
GovernmentReportSchema.index({ status: 1, targetEntity: 1 });
GovernmentReportSchema.index({ reportType: 1, createdAt: -1 });
GovernmentReportSchema.index({ 'submission.confirmationNumber': 1 });
GovernmentReportSchema.index({ 'governmentResponse.caseNumber': 1 });
GovernmentReportSchema.index({ isDeleted: 1, status: 1 });

// Compound indexes
GovernmentReportSchema.index({ user: 1, status: 1, isDeleted: 1 });
GovernmentReportSchema.index({ targetEntity: 1, status: 1, createdAt: -1 });

// Virtual for days since submission
GovernmentReportSchema.virtual('daysSinceSubmission').get(function() {
  if (!this.submission.submittedAt) return null;
  
  const now = new Date();
  const submitted = this.submission.submittedAt;
  const diffTime = Math.abs(now - submitted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is pending response
GovernmentReportSchema.virtual('isPendingResponse').get(function() {
  return this.status === 'ENVIADO' && !this.governmentResponse.caseNumber;
});

// Pre-save hook to update timestamps and audit log
GovernmentReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-generate report number if not exists
  if (!this.reportNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.reportNumber = `RPT-${this.targetEntity}-${timestamp}-${random}`;
  }
  
  next();
});

// Instance method to add audit log entry
GovernmentReportSchema.methods.addAuditLog = function(action, userId, details, ipAddress) {
  this.auditLog.push({
    action,
    performedBy: userId,
    performedAt: new Date(),
    details,
    ipAddress
  });
  return this.save();
};

// Instance method to update status
GovernmentReportSchema.methods.updateStatus = function(newStatus, userId, notes) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  this.auditLog.push({
    action: 'STATUS_CHANGED',
    performedBy: userId,
    performedAt: new Date(),
    details: `Status changed from ${oldStatus} to ${newStatus}. ${notes || ''}`
  });
  
  return this.save();
};

// Instance method to submit report
GovernmentReportSchema.methods.submit = function(userId, method = 'MANUAL', confirmationNumber) {
  this.status = 'ENVIADO';
  this.submission.submittedAt = new Date();
  this.submission.submittedBy = userId;
  this.submission.submissionMethod = method;
  
  if (confirmationNumber) {
    this.submission.confirmationNumber = confirmationNumber;
  }
  
  this.auditLog.push({
    action: 'SUBMITTED',
    performedBy: userId,
    performedAt: new Date(),
    details: `Report submitted via ${method}`
  });
  
  return this.save();
};

// Instance method to add export record
GovernmentReportSchema.methods.addExport = function(format, userId, fileUrl, purpose) {
  this.exports.push({
    format,
    exportedAt: new Date(),
    exportedBy: userId,
    fileUrl,
    purpose
  });
  
  this.auditLog.push({
    action: 'EXPORTED',
    performedBy: userId,
    performedAt: new Date(),
    details: `Report exported as ${format}`
  });
  
  return this.save();
};

// Instance method to add government response
GovernmentReportSchema.methods.addGovernmentResponse = function(responseData) {
  this.governmentResponse = {
    ...this.governmentResponse,
    ...responseData,
    responseDate: responseData.responseDate || new Date()
  };
  
  if (responseData.caseNumber) {
    this.status = 'RECIBIDO';
  }
  
  return this.save();
};

// Instance method to add status update from government
GovernmentReportSchema.methods.addGovernmentStatusUpdate = function(status, notes, updatedBy) {
  if (!this.governmentResponse.statusUpdates) {
    this.governmentResponse.statusUpdates = [];
  }
  
  this.governmentResponse.statusUpdates.push({
    status,
    date: new Date(),
    notes,
    updatedBy
  });
  
  // Update main status if applicable
  const statusMap = {
    'EN_PROCESO': 'EN_PROCESO',
    'RESUELTO': 'RESUELTO',
    'CERRADO': 'CERRADO'
  };
  
  if (statusMap[status]) {
    this.status = statusMap[status];
  }
  
  return this.save();
};

// Instance method for soft delete
GovernmentReportSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  
  this.auditLog.push({
    action: 'DELETED',
    performedBy: userId,
    performedAt: new Date(),
    details: 'Report soft deleted'
  });
  
  return this.save();
};

// Static method to find active reports
GovernmentReportSchema.statics.findActive = function() {
  return this.find({ isDeleted: false });
};

// Static method to find by user
GovernmentReportSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 });
};

// Static method to find by issue
GovernmentReportSchema.statics.findByIssue = function(issueId) {
  return this.find({ issue: issueId, isDeleted: false }).sort({ createdAt: -1 });
};

// Static method to find by entity
GovernmentReportSchema.statics.findByEntity = function(entity) {
  return this.find({ targetEntity: entity, isDeleted: false }).sort({ createdAt: -1 });
};

// Static method to find pending reports
GovernmentReportSchema.statics.findPending = function() {
  return this.find({
    isDeleted: false,
    status: { $in: ['BORRADOR', 'PENDIENTE'] }
  }).sort({ createdAt: -1 });
};

// Static method to find submitted reports awaiting response
GovernmentReportSchema.statics.findAwaitingResponse = function() {
  return this.find({
    isDeleted: false,
    status: 'ENVIADO',
    'governmentResponse.caseNumber': { $exists: false }
  }).sort({ 'submission.submittedAt': 1 });
};

// Export model
const GovernmentReport = mongoose.models.GovernmentReport || mongoose.model('GovernmentReport', GovernmentReportSchema);

export default GovernmentReport;
