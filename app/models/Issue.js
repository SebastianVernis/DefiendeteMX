import mongoose from 'mongoose';

/**
 * Issue Model - Comprehensive Violence Tracking System
 * Designed for tracking domestic violence and abuse cases
 */

const IssueSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Título es requerido'],
    trim: true,
    maxlength: [200, 'Título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descripción es requerida'],
    trim: true,
    maxlength: [5000, 'Descripción no puede exceder 5000 caracteres']
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: {
      values: ['NUEVO', 'EN_PROCESO', 'REQUIERE_ATENCION', 'RESUELTO', 'CERRADO', 'ARCHIVADO'],
      message: 'Estado inválido'
    },
    default: 'NUEVO',
    required: true
  },
  priority: {
    type: String,
    enum: {
      values: ['BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA', 'CRITICO'],
      message: 'Prioridad inválida'
    },
    default: 'MEDIO',
    required: true
  },
  
  // Category and Type
  category: {
    type: String,
    enum: {
      values: [
        'VIOLENCIA_DOMESTICA',
        'VIOLENCIA_FISICA',
        'VIOLENCIA_PSICOLOGICA',
        'VIOLENCIA_SEXUAL',
        'VIOLENCIA_ECONOMICA',
        'ACOSO',
        'ACOSO_LABORAL',
        'ACOSO_ESCOLAR',
        'ABUSO_SEXUAL',
        'DISCRIMINACION',
        'AMENAZAS',
        'OTRO'
      ],
      message: 'Categoría inválida'
    },
    required: [true, 'Categoría es requerida']
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuario es requerido'],
    index: true
  },
  
  // Incident Details
  incident: {
    date: {
      type: Date,
      required: [true, 'Fecha del incidente es requerida']
    },
    time: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180
        }
      },
      description: String // e.g., "En la cocina", "En la calle"
    },
    witnesses: [{
      name: String,
      contact: String,
      relationship: String,
      statement: String
    }],
    policeReportFiled: {
      type: Boolean,
      default: false
    },
    policeReportNumber: String,
    policeStation: String
  },
  
  // Perpetrator Information
  perpetrator: {
    name: String,
    age: Number,
    gender: {
      type: String,
      enum: ['MASCULINO', 'FEMENINO', 'NO_BINARIO', 'DESCONOCIDO']
    },
    relationship: {
      type: String,
      enum: [
        'PAREJA_ACTUAL',
        'EX_PAREJA',
        'ESPOSO',
        'ESPOSA',
        'NOVIO',
        'NOVIA',
        'FAMILIAR',
        'PADRE',
        'MADRE',
        'HERMANO',
        'HERMANA',
        'HIJO',
        'HIJA',
        'CONOCIDO',
        'DESCONOCIDO',
        'JEFE',
        'COMPAÑERO_TRABAJO',
        'OTRO'
      ]
    },
    description: String,
    hasWeapons: Boolean,
    weaponDescription: String,
    hasViolenceHistory: Boolean,
    hasSubstanceAbuse: Boolean,
    substanceDetails: String,
    hasRestrainingOrder: Boolean,
    restrainingOrderDetails: String
  },
  
  // Victim Information
  victim: {
    injuries: [{
      type: {
        type: String,
        enum: ['FISICA', 'PSICOLOGICA', 'SEXUAL', 'ECONOMICA']
      },
      description: String,
      severity: {
        type: String,
        enum: ['LEVE', 'MODERADA', 'GRAVE', 'CRITICA']
      },
      requiresMedicalAttention: Boolean
    }],
    medicalAttentionReceived: Boolean,
    medicalFacility: String,
    medicalReportNumber: String,
    psychologicalImpact: {
      type: String,
      enum: ['NINGUNO', 'LEVE', 'MODERADO', 'SEVERO', 'CRITICO']
    },
    needsImmediateShelter: Boolean,
    hasDependents: Boolean,
    dependentsCount: Number,
    dependentsAges: [Number]
  },
  
  // Safety Assessment
  safetyAssessment: {
    riskLevel: {
      type: String,
      enum: ['BAJO', 'MEDIO', 'ALTO', 'EXTREMO'],
      default: 'MEDIO'
    },
    immediateDanger: {
      type: Boolean,
      default: false
    },
    threatsMade: Boolean,
    threatDetails: String,
    escalationPattern: Boolean,
    hasAccessToVictim: Boolean,
    victimFearsForLife: Boolean,
    childrenInvolved: Boolean,
    childrenAtRisk: Boolean,
    safetyPlanCreated: Boolean,
    safetyPlanDetails: String
  },
  
  // Evidence Files
  evidenceFiles: [{
    url: {
      type: String,
      required: true
    },
    filename: String,
    fileType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER']
    },
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    size: Number, // in bytes
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Emergency Contacts
  emergencyContacts: [{
    name: {
      type: String,
      required: true
    },
    relationship: String,
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos']
    },
    email: String,
    hasBeenNotified: {
      type: Boolean,
      default: false
    },
    notifiedAt: Date,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Legal Case Information
  legalCase: {
    caseNumber: String,
    courtName: String,
    lawyerName: String,
    lawyerContact: String,
    lawyerEmail: String,
    prosecutorName: String,
    prosecutorContact: String,
    nextCourtDate: Date,
    restrainingOrderIssued: Boolean,
    restrainingOrderExpires: Date,
    criminalChargesFiled: Boolean,
    chargesDescription: String,
    civilCaseFiled: Boolean,
    civilCaseDetails: String
  },
  
  // Support Services
  supportServices: {
    shelterProvided: Boolean,
    shelterName: String,
    counselingProvided: Boolean,
    counselorName: String,
    counselorContact: String,
    legalAidProvided: Boolean,
    legalAidOrganization: String,
    medicalSupportProvided: Boolean,
    financialAssistanceProvided: Boolean,
    otherServices: [String]
  },
  
  // Status History (Audit Trail)
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Notes and Updates
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['GENERAL', 'LEGAL', 'MEDICAL', 'SAFETY', 'FOLLOW_UP']
    }
  }],
  
  // Follow-up Actions
  followUpActions: [{
    action: {
      type: String,
      required: true
    },
    dueDate: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    priority: {
      type: String,
      enum: ['BAJO', 'MEDIO', 'ALTO', 'URGENTE']
    }
  }],
  
  // Privacy and Confidentiality
  confidential: {
    type: Boolean,
    default: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    sharedAt: Date,
    permissions: {
      canView: { type: Boolean, default: true },
      canEdit: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false }
    }
  }],
  
  // Metadata
  source: {
    type: String,
    enum: ['WEB', 'MOBILE', 'PHONE', 'IN_PERSON', 'REFERRAL'],
    default: 'WEB'
  },
  referredBy: String,
  tags: [String],
  
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
  },
  lastViewedAt: Date,
  resolvedAt: Date,
  closedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
IssueSchema.index({ user: 1, createdAt: -1 });
IssueSchema.index({ status: 1, priority: -1 });
IssueSchema.index({ category: 1 });
IssueSchema.index({ 'incident.date': -1 });
IssueSchema.index({ 'safetyAssessment.riskLevel': 1 });
IssueSchema.index({ isDeleted: 1, status: 1 });
IssueSchema.index({ tags: 1 });

// Compound indexes
IssueSchema.index({ user: 1, status: 1, isDeleted: 1 });
IssueSchema.index({ category: 1, priority: -1, createdAt: -1 });

// Text index for search
IssueSchema.index({ 
  title: 'text', 
  description: 'text',
  'notes.content': 'text'
});

// Virtual for days since creation
IssueSchema.virtual('daysSinceCreation').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue (if status is not resolved after 30 days)
IssueSchema.virtual('isOverdue').get(function() {
  if (this.status === 'RESUELTO' || this.status === 'CERRADO') {
    return false;
  }
  return this.daysSinceCreation > 30;
});

// Virtual for evidence count
IssueSchema.virtual('evidenceCount').get(function() {
  return this.evidenceFiles ? this.evidenceFiles.length : 0;
});

// Pre-save hook to update timestamps
IssueSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set resolved/closed dates
  if (this.isModified('status')) {
    if (this.status === 'RESUELTO' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    if (this.status === 'CERRADO' && !this.closedAt) {
      this.closedAt = new Date();
    }
    
    // Add to status history
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
  
  next();
});

// Instance method to add note
IssueSchema.methods.addNote = function(content, userId, type = 'GENERAL', isPrivate = false) {
  this.notes.push({
    content,
    createdBy: userId,
    type,
    isPrivate,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to add evidence
IssueSchema.methods.addEvidence = function(evidenceData) {
  this.evidenceFiles.push({
    ...evidenceData,
    uploadedAt: new Date()
  });
  return this.save();
};

// Instance method to update status
IssueSchema.methods.updateStatus = function(newStatus, userId, notes) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    changedAt: new Date(),
    notes
  });
  return this.save();
};

// Instance method to assess risk
IssueSchema.methods.assessRisk = function() {
  let riskScore = 0;
  
  // Calculate risk based on various factors
  if (this.safetyAssessment.immediateDanger) riskScore += 5;
  if (this.safetyAssessment.threatsMade) riskScore += 3;
  if (this.safetyAssessment.escalationPattern) riskScore += 3;
  if (this.safetyAssessment.victimFearsForLife) riskScore += 4;
  if (this.safetyAssessment.childrenAtRisk) riskScore += 3;
  if (this.perpetrator.hasWeapons) riskScore += 4;
  if (this.perpetrator.hasViolenceHistory) riskScore += 2;
  if (this.victim.needsImmediateShelter) riskScore += 3;
  
  // Set risk level based on score
  if (riskScore >= 15) {
    this.safetyAssessment.riskLevel = 'EXTREMO';
    this.priority = 'CRITICO';
  } else if (riskScore >= 10) {
    this.safetyAssessment.riskLevel = 'ALTO';
    this.priority = 'EMERGENCIA';
  } else if (riskScore >= 5) {
    this.safetyAssessment.riskLevel = 'MEDIO';
    this.priority = 'ALTO';
  } else {
    this.safetyAssessment.riskLevel = 'BAJO';
  }
  
  return this.save();
};

// Instance method for soft delete
IssueSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

// Static method to find active issues
IssueSchema.statics.findActive = function() {
  return this.find({ isDeleted: false });
};

// Static method to find by user
IssueSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 });
};

// Static method to find high priority issues
IssueSchema.statics.findHighPriority = function() {
  return this.find({
    isDeleted: false,
    priority: { $in: ['EMERGENCIA', 'CRITICO'] },
    status: { $nin: ['RESUELTO', 'CERRADO'] }
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to find by category
IssueSchema.statics.findByCategory = function(category) {
  return this.find({ category, isDeleted: false }).sort({ createdAt: -1 });
};

// Static method for search
IssueSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    isDeleted: false
  }).sort({ score: { $meta: 'textScore' } });
};

// Export model
const Issue = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);

export default Issue;
