/**
 * Issue Validator
 * Validates issue data before database operations
 */

/**
 * Validate required fields for creating an issue
 * @param {Object} data - Issue data to validate
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export function validateCreateIssue(data) {
  const errors = [];
  
  // Required fields
  if (!data.title || data.title.trim() === '') {
    errors.push({ field: 'title', message: 'Título es requerido' });
  } else if (data.title.length > 200) {
    errors.push({ field: 'title', message: 'Título no puede exceder 200 caracteres' });
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push({ field: 'description', message: 'Descripción es requerida' });
  } else if (data.description.length > 5000) {
    errors.push({ field: 'description', message: 'Descripción no puede exceder 5000 caracteres' });
  }
  
  if (!data.category) {
    errors.push({ field: 'category', message: 'Categoría es requerida' });
  } else if (!isValidCategory(data.category)) {
    errors.push({ field: 'category', message: 'Categoría inválida' });
  }
  
  if (!data.user) {
    errors.push({ field: 'user', message: 'Usuario es requerido' });
  }
  
  // Validate incident date if provided
  if (data.incident && data.incident.date) {
    if (!isValidDate(data.incident.date)) {
      errors.push({ field: 'incident.date', message: 'Fecha del incidente inválida' });
    } else if (new Date(data.incident.date) > new Date()) {
      errors.push({ field: 'incident.date', message: 'Fecha del incidente no puede ser futura' });
    }
  } else {
    errors.push({ field: 'incident.date', message: 'Fecha del incidente es requerida' });
  }
  
  // Validate incident time format if provided
  if (data.incident && data.incident.time) {
    if (!isValidTime(data.incident.time)) {
      errors.push({ field: 'incident.time', message: 'Formato de hora inválido (use HH:MM)' });
    }
  }
  
  // Validate coordinates if provided
  if (data.incident && data.incident.location && data.incident.location.coordinates) {
    const { latitude, longitude } = data.incident.location.coordinates;
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      errors.push({ field: 'incident.location.coordinates.latitude', message: 'Latitud debe estar entre -90 y 90' });
    }
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      errors.push({ field: 'incident.location.coordinates.longitude', message: 'Longitud debe estar entre -180 y 180' });
    }
  }
  
  // Validate emergency contacts if provided
  if (data.emergencyContacts && Array.isArray(data.emergencyContacts)) {
    data.emergencyContacts.forEach((contact, index) => {
      if (!contact.name) {
        errors.push({ field: `emergencyContacts[${index}].name`, message: 'Nombre del contacto es requerido' });
      }
      if (!contact.phone) {
        errors.push({ field: `emergencyContacts[${index}].phone`, message: 'Teléfono del contacto es requerido' });
      } else if (!isValidPhone(contact.phone)) {
        errors.push({ field: `emergencyContacts[${index}].phone`, message: 'Teléfono debe tener 10 dígitos' });
      }
    });
  }
  
  // Validate evidence files if provided
  if (data.evidenceFiles && Array.isArray(data.evidenceFiles)) {
    data.evidenceFiles.forEach((file, index) => {
      if (!file.url) {
        errors.push({ field: `evidenceFiles[${index}].url`, message: 'URL del archivo es requerida' });
      }
      if (file.fileType && !isValidFileType(file.fileType)) {
        errors.push({ field: `evidenceFiles[${index}].fileType`, message: 'Tipo de archivo inválido' });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate data for updating an issue
 * @param {Object} data - Issue data to validate
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export function validateUpdateIssue(data) {
  const errors = [];
  
  // Optional fields validation
  if (data.title !== undefined) {
    if (data.title.trim() === '') {
      errors.push({ field: 'title', message: 'Título no puede estar vacío' });
    } else if (data.title.length > 200) {
      errors.push({ field: 'title', message: 'Título no puede exceder 200 caracteres' });
    }
  }
  
  if (data.description !== undefined) {
    if (data.description.trim() === '') {
      errors.push({ field: 'description', message: 'Descripción no puede estar vacía' });
    } else if (data.description.length > 5000) {
      errors.push({ field: 'description', message: 'Descripción no puede exceder 5000 caracteres' });
    }
  }
  
  if (data.status !== undefined && !isValidStatus(data.status)) {
    errors.push({ field: 'status', message: 'Estado inválido' });
  }
  
  if (data.priority !== undefined && !isValidPriority(data.priority)) {
    errors.push({ field: 'priority', message: 'Prioridad inválida' });
  }
  
  if (data.category !== undefined && !isValidCategory(data.category)) {
    errors.push({ field: 'category', message: 'Categoría inválida' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate status transition
 * @param {string} currentStatus - Current issue status
 * @param {string} newStatus - New status to transition to
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validateStatusTransition(currentStatus, newStatus) {
  const validTransitions = {
    'NUEVO': ['EN_PROCESO', 'REQUIERE_ATENCION', 'ARCHIVADO'],
    'EN_PROCESO': ['REQUIERE_ATENCION', 'RESUELTO', 'ARCHIVADO'],
    'REQUIERE_ATENCION': ['EN_PROCESO', 'RESUELTO', 'ARCHIVADO'],
    'RESUELTO': ['CERRADO', 'EN_PROCESO'], // Can reopen
    'CERRADO': ['ARCHIVADO'],
    'ARCHIVADO': [] // Cannot transition from archived
  };
  
  if (!validTransitions[currentStatus]) {
    return {
      isValid: false,
      error: 'Estado actual inválido'
    };
  }
  
  if (!validTransitions[currentStatus].includes(newStatus)) {
    return {
      isValid: false,
      error: `No se puede cambiar de ${currentStatus} a ${newStatus}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate safety assessment data
 * @param {Object} data - Safety assessment data
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export function validateSafetyAssessment(data) {
  const errors = [];
  
  if (data.riskLevel && !isValidRiskLevel(data.riskLevel)) {
    errors.push({ field: 'riskLevel', message: 'Nivel de riesgo inválido' });
  }
  
  // If immediate danger is true, risk level should be at least HIGH
  if (data.immediateDanger === true && data.riskLevel && !['ALTO', 'EXTREMO'].includes(data.riskLevel)) {
    errors.push({ 
      field: 'riskLevel', 
      message: 'Nivel de riesgo debe ser ALTO o EXTREMO cuando hay peligro inmediato' 
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper validation functions

function isValidCategory(category) {
  const validCategories = [
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
  ];
  return validCategories.includes(category);
}

function isValidStatus(status) {
  const validStatuses = ['NUEVO', 'EN_PROCESO', 'REQUIERE_ATENCION', 'RESUELTO', 'CERRADO', 'ARCHIVADO'];
  return validStatuses.includes(status);
}

function isValidPriority(priority) {
  const validPriorities = ['BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA', 'CRITICO'];
  return validPriorities.includes(priority);
}

function isValidRiskLevel(riskLevel) {
  const validRiskLevels = ['BAJO', 'MEDIO', 'ALTO', 'EXTREMO'];
  return validRiskLevels.includes(riskLevel);
}

function isValidFileType(fileType) {
  const validFileTypes = ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER'];
  return validFileTypes.includes(fileType);
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function isValidTime(timeString) {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

function isValidPhone(phone) {
  // Mexican phone number: 10 digits
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize input data
 * @param {Object} data - Data to sanitize
 * @returns {Object} - Sanitized data
 */
export function sanitizeIssueData(data) {
  const sanitized = { ...data };
  
  // Trim string fields
  if (sanitized.title) sanitized.title = sanitized.title.trim();
  if (sanitized.description) sanitized.description = sanitized.description.trim();
  if (sanitized.subcategory) sanitized.subcategory = sanitized.subcategory.trim();
  
  // Remove any potentially dangerous HTML/script tags
  if (sanitized.description) {
    sanitized.description = sanitized.description
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }
  
  return sanitized;
}

/**
 * Validate complete issue object
 * @param {Object} issue - Complete issue object
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export function validateCompleteIssue(issue) {
  const errors = [];
  
  // Run all validations
  const createValidation = validateCreateIssue(issue);
  if (!createValidation.isValid) {
    errors.push(...createValidation.errors);
  }
  
  if (issue.safetyAssessment) {
    const safetyValidation = validateSafetyAssessment(issue.safetyAssessment);
    if (!safetyValidation.isValid) {
      errors.push(...safetyValidation.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  validateCreateIssue,
  validateUpdateIssue,
  validateStatusTransition,
  validateSafetyAssessment,
  validateCompleteIssue,
  sanitizeIssueData
};
