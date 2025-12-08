import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * Represents users of the DefiendeteMX platform
 */

const UserSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false // Don't return password by default
  },
  
  // Profile Information
  fullName: {
    type: String,
    required: [true, 'Nombre completo es requerido'],
    trim: true,
    maxlength: [100, 'Nombre no puede exceder 100 caracteres']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['MASCULINO', 'FEMENINO', 'NO_BINARIO', 'PREFIERO_NO_DECIR', 'OTRO']
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'México' }
  },
  
  // Emergency Contacts
  emergencyContacts: [{
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos']
    },
    email: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // User Role
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'MODERATOR', 'LEGAL_ADVISOR'],
    default: 'USER'
  },
  
  // Premium Status
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: Date,
  
  // Privacy Settings
  privacySettings: {
    shareLocation: { type: Boolean, default: false },
    allowNotifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: false }
  },
  
  // Metadata
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Soft Delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1, isDeleted: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for user's issues
UserSchema.virtual('issues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'user'
});

// Virtual for account locked status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Instance method to increment login attempts
UserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  // Otherwise increment
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Static method to find active users
UserSchema.statics.findActive = function() {
  return this.find({ isActive: true, isDeleted: false });
};

// Static method to find by email (including password)
UserSchema.statics.findByCredentials = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(), 
    isActive: true, 
    isDeleted: false 
  }).select('+password');
};

// Soft delete method
UserSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false;
  return this.save();
};

// Export model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
