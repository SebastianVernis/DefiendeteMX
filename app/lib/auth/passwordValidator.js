import validator from 'validator';

/**
 * Password Validation Utilities
 * Validates password strength and security requirements
 */

/**
 * Password validation rules
 */
export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validatePassword(password) {
  const errors = [];

  // Check if password exists
  if (!password) {
    return {
      isValid: false,
      errors: ['La contraseña es requerida']
    };
  }

  // Check minimum length
  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`La contraseña debe tener al menos ${PASSWORD_RULES.minLength} caracteres`);
  }

  // Check maximum length
  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(`La contraseña no puede exceder ${PASSWORD_RULES.maxLength} caracteres`);
  }

  // Check for uppercase letters
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  // Check for lowercase letters
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  // Check for numbers
  if (PASSWORD_RULES.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  // Check for special characters
  if (PASSWORD_RULES.requireSpecialChars) {
    const specialCharsRegex = new RegExp(`[${PASSWORD_RULES.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (!specialCharsRegex.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    errors.push('Esta contraseña es muy común. Por favor, elige una contraseña más segura');
  }

  // Check for sequential characters
  if (hasSequentialCharacters(password)) {
    errors.push('La contraseña no debe contener caracteres secuenciales (ej: 123, abc)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} Strength score and level
 */
export function calculatePasswordStrength(password) {
  let score = 0;
  
  if (!password) {
    return { score: 0, level: 'muy_debil', label: 'Muy Débil' };
  }

  // Length score
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety score
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Complexity score
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 1;
  if (/[a-zA-Z].*[0-9]|[0-9].*[a-zA-Z]/.test(password)) score += 1;

  // Determine strength level
  let level, label;
  if (score <= 3) {
    level = 'muy_debil';
    label = 'Muy Débil';
  } else if (score <= 5) {
    level = 'debil';
    label = 'Débil';
  } else if (score <= 7) {
    level = 'media';
    label = 'Media';
  } else if (score <= 9) {
    level = 'fuerte';
    label = 'Fuerte';
  } else {
    level = 'muy_fuerte';
    label = 'Muy Fuerte';
  }

  return { score, level, label };
}

/**
 * Check if password is in common passwords list
 * @param {string} password - Password to check
 * @returns {boolean} True if password is common
 */
function isCommonPassword(password) {
  const commonPasswords = [
    'password', 'password123', '12345678', '123456789', '1234567890',
    'qwerty', 'abc123', 'monkey', '1234567', '12345',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou',
    'master', 'sunshine', 'ashley', 'bailey', 'passw0rd',
    'shadow', '123123', '654321', 'superman', 'qazwsx',
    'michael', 'football', 'password1', 'admin', 'welcome'
  ];

  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Check for sequential characters
 * @param {string} password - Password to check
 * @returns {boolean} True if contains sequential characters
 */
function hasSequentialCharacters(password) {
  const sequences = [
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];

  const lowerPassword = password.toLowerCase();

  for (const sequence of sequences) {
    for (let i = 0; i < sequence.length - 2; i++) {
      const seq = sequence.substring(i, i + 3);
      const reverseSeq = seq.split('').reverse().join('');
      
      if (lowerPassword.includes(seq) || lowerPassword.includes(reverseSeq)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  const errors = [];

  if (!email) {
    return {
      isValid: false,
      errors: ['El email es requerido']
    };
  }

  if (!validator.isEmail(email)) {
    errors.push('El formato del email es inválido');
  }

  if (email.length > 255) {
    errors.push('El email no puede exceder 255 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate full name
 * @param {string} fullName - Full name to validate
 * @returns {Object} Validation result
 */
export function validateFullName(fullName) {
  const errors = [];

  if (!fullName) {
    return {
      isValid: false,
      errors: ['El nombre completo es requerido']
    };
  }

  if (fullName.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (fullName.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres');
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(fullName)) {
    errors.push('El nombre solo puede contener letras, espacios, guiones y apóstrofes');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate phone number (Mexican format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export function validatePhone(phone) {
  const errors = [];

  if (!phone) {
    return {
      isValid: true, // Phone is optional
      errors: []
    };
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  if (!/^[0-9]{10}$/.test(cleanPhone)) {
    errors.push('El teléfono debe tener 10 dígitos');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return validator.escape(input.trim());
}

export default {
  validatePassword,
  calculatePasswordStrength,
  validateEmail,
  validateFullName,
  validatePhone,
  sanitizeInput,
  PASSWORD_RULES
};
