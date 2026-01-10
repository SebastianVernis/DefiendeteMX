/**
 * Unit Tests for Issue Validator
 * Tests validation logic and business rules
 */

import {
  validateCreateIssue,
  validateUpdateIssue,
  validateStatusTransition,
  validateSafetyAssessment,
  sanitizeIssueData
} from '../validators/issueValidator';

describe('Issue Validator Tests', () => {
  
  describe('validateCreateIssue', () => {
    
    test('should pass validation with valid data', () => {
      const validData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: {
          date: new Date('2024-01-01')
        }
      };
      
      const result = validateCreateIssue(validData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should fail validation when title is missing', () => {
      const invalidData = {
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'title',
        message: 'Título es requerido'
      });
    });
    
    test('should fail validation when title is too long', () => {
      const invalidData = {
        title: 'a'.repeat(201),
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'title')).toBe(true);
    });
    
    test('should fail validation when description is missing', () => {
      const invalidData = {
        title: 'Test Issue',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'description',
        message: 'Descripción es requerida'
      });
    });
    
    test('should fail validation when category is invalid', () => {
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'INVALID_CATEGORY',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'category',
        message: 'Categoría inválida'
      });
    });
    
    test('should fail validation when user is missing', () => {
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        incident: { date: new Date() }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'user',
        message: 'Usuario es requerido'
      });
    });
    
    test('should fail validation when incident date is missing', () => {
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011'
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'incident.date')).toBe(true);
    });
    
    test('should fail validation when incident date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: futureDate }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'incident.date',
        message: 'Fecha del incidente no puede ser futura'
      });
    });
    
    test('should fail validation with invalid time format', () => {
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: {
          date: new Date(),
          time: '25:00' // Invalid hour
        }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'incident.time')).toBe(true);
    });
    
    test('should fail validation with invalid coordinates', () => {
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: {
          date: new Date(),
          location: {
            coordinates: {
              latitude: 100, // Invalid
              longitude: 200 // Invalid
            }
          }
        }
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    test('should fail validation with invalid emergency contact phone', () => {
      const invalidData = {
        title: 'Test Issue',
        description: 'This is a test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        emergencyContacts: [{
          name: 'John Doe',
          phone: '123' // Invalid: not 10 digits
        }]
      };
      
      const result = validateCreateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field.includes('emergencyContacts'))).toBe(true);
    });
  });
  
  describe('validateUpdateIssue', () => {
    
    test('should pass validation with valid update data', () => {
      const validData = {
        title: 'Updated Title',
        status: 'EN_PROCESO'
      };
      
      const result = validateUpdateIssue(validData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should fail validation with empty title', () => {
      const invalidData = {
        title: '   '
      };
      
      const result = validateUpdateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'title',
        message: 'Título no puede estar vacío'
      });
    });
    
    test('should fail validation with invalid status', () => {
      const invalidData = {
        status: 'INVALID_STATUS'
      };
      
      const result = validateUpdateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'status',
        message: 'Estado inválido'
      });
    });
    
    test('should fail validation with invalid priority', () => {
      const invalidData = {
        priority: 'INVALID_PRIORITY'
      };
      
      const result = validateUpdateIssue(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'priority',
        message: 'Prioridad inválida'
      });
    });
  });
  
  describe('validateStatusTransition', () => {
    
    test('should allow valid transition from NUEVO to EN_PROCESO', () => {
      const result = validateStatusTransition('NUEVO', 'EN_PROCESO');
      
      expect(result.isValid).toBe(true);
    });
    
    test('should allow valid transition from EN_PROCESO to RESUELTO', () => {
      const result = validateStatusTransition('EN_PROCESO', 'RESUELTO');
      
      expect(result.isValid).toBe(true);
    });
    
    test('should allow reopening from RESUELTO to EN_PROCESO', () => {
      const result = validateStatusTransition('RESUELTO', 'EN_PROCESO');
      
      expect(result.isValid).toBe(true);
    });
    
    test('should not allow transition from NUEVO to RESUELTO', () => {
      const result = validateStatusTransition('NUEVO', 'RESUELTO');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('No se puede cambiar');
    });
    
    test('should not allow transition from ARCHIVADO', () => {
      const result = validateStatusTransition('ARCHIVADO', 'EN_PROCESO');
      
      expect(result.isValid).toBe(false);
    });
    
    test('should not allow transition from CERRADO to NUEVO', () => {
      const result = validateStatusTransition('CERRADO', 'NUEVO');
      
      expect(result.isValid).toBe(false);
    });
  });
  
  describe('validateSafetyAssessment', () => {
    
    test('should pass validation with valid risk level', () => {
      const validData = {
        riskLevel: 'ALTO',
        immediateDanger: false
      };
      
      const result = validateSafetyAssessment(validData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should fail validation with invalid risk level', () => {
      const invalidData = {
        riskLevel: 'INVALID_LEVEL'
      };
      
      const result = validateSafetyAssessment(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'riskLevel',
        message: 'Nivel de riesgo inválido'
      });
    });
    
    test('should fail when immediate danger is true but risk level is low', () => {
      const invalidData = {
        immediateDanger: true,
        riskLevel: 'BAJO'
      };
      
      const result = validateSafetyAssessment(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'riskLevel')).toBe(true);
    });
    
    test('should pass when immediate danger is true and risk level is high', () => {
      const validData = {
        immediateDanger: true,
        riskLevel: 'ALTO'
      };
      
      const result = validateSafetyAssessment(validData);
      
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('sanitizeIssueData', () => {
    
    test('should trim string fields', () => {
      const data = {
        title: '  Test Title  ',
        description: '  Test Description  ',
        subcategory: '  Test Subcategory  '
      };
      
      const sanitized = sanitizeIssueData(data);
      
      expect(sanitized.title).toBe('Test Title');
      expect(sanitized.description).toBe('Test Description');
      expect(sanitized.subcategory).toBe('Test Subcategory');
    });
    
    test('should remove script tags from description', () => {
      const data = {
        title: 'Test Title',
        description: 'Test <script>alert("xss")</script> Description'
      };
      
      const sanitized = sanitizeIssueData(data);
      
      expect(sanitized.description).not.toContain('<script>');
      expect(sanitized.description).toContain('Test');
      expect(sanitized.description).toContain('Description');
    });
    
    test('should remove iframe tags from description', () => {
      const data = {
        title: 'Test Title',
        description: 'Test <iframe src="evil.com"></iframe> Description'
      };
      
      const sanitized = sanitizeIssueData(data);
      
      expect(sanitized.description).not.toContain('<iframe>');
      expect(sanitized.description).toContain('Test');
      expect(sanitized.description).toContain('Description');
    });
    
    test('should preserve other data unchanged', () => {
      const data = {
        title: 'Test Title',
        description: 'Test Description',
        category: 'VIOLENCIA_DOMESTICA',
        priority: 'ALTO',
        user: '507f1f77bcf86cd799439011'
      };
      
      const sanitized = sanitizeIssueData(data);
      
      expect(sanitized.category).toBe('VIOLENCIA_DOMESTICA');
      expect(sanitized.priority).toBe('ALTO');
      expect(sanitized.user).toBe('507f1f77bcf86cd799439011');
    });
  });
});

export default {
  validateCreateIssue,
  validateUpdateIssue,
  validateStatusTransition,
  validateSafetyAssessment,
  sanitizeIssueData
};
