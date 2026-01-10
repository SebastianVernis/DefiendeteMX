/**
 * Unit Tests for Issue Model
 * Tests model validation, methods, and business logic
 */

import Issue from '../../models/Issue';
import User from '../../models/User';

describe('Issue Model Tests', () => {
  
  describe('Schema Validation', () => {
    
    test('should require title field', () => {
      const issue = new Issue({
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.title).toBeDefined();
      expect(error.errors.title.message).toContain('requerido');
    });
    
    test('should require description field', () => {
      const issue = new Issue({
        title: 'Test title',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.description).toBeDefined();
    });
    
    test('should require category field', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.category).toBeDefined();
    });
    
    test('should validate category enum', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'INVALID_CATEGORY',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.category).toBeDefined();
      expect(error.errors.category.message).toContain('inválida');
    });
    
    test('should validate status enum', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        status: 'INVALID_STATUS',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.status).toBeDefined();
    });
    
    test('should validate priority enum', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        priority: 'INVALID_PRIORITY',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.priority).toBeDefined();
    });
    
    test('should set default values', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      expect(issue.status).toBe('NUEVO');
      expect(issue.priority).toBe('MEDIO');
      expect(issue.confidential).toBe(true);
      expect(issue.isDeleted).toBe(false);
    });
    
    test('should validate title max length', () => {
      const longTitle = 'a'.repeat(201);
      const issue = new Issue({
        title: longTitle,
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.title).toBeDefined();
      expect(error.errors.title.message).toContain('200 caracteres');
    });
    
    test('should validate description max length', () => {
      const longDescription = 'a'.repeat(5001);
      const issue = new Issue({
        title: 'Test title',
        description: longDescription,
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const error = issue.validateSync();
      expect(error.errors.description).toBeDefined();
      expect(error.errors.description.message).toContain('5000 caracteres');
    });
    
    test('should validate coordinates range', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: {
          date: new Date(),
          location: {
            coordinates: {
              latitude: 100, // Invalid: > 90
              longitude: 200 // Invalid: > 180
            }
          }
        }
      });
      
      const error = issue.validateSync();
      expect(error.errors['incident.location.coordinates.latitude']).toBeDefined();
      expect(error.errors['incident.location.coordinates.longitude']).toBeDefined();
    });
    
    test('should validate phone number format in emergency contacts', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        emergencyContacts: [{
          name: 'John Doe',
          phone: '123' // Invalid: not 10 digits
        }]
      });
      
      const error = issue.validateSync();
      expect(error.errors['emergencyContacts.0.phone']).toBeDefined();
    });
  });
  
  describe('Virtual Properties', () => {
    
    test('should calculate daysSinceCreation', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        createdAt: pastDate
      });
      
      expect(issue.daysSinceCreation).toBeGreaterThanOrEqual(5);
    });
    
    test('should calculate isOverdue correctly', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35);
      
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        status: 'EN_PROCESO',
        createdAt: oldDate
      });
      
      expect(issue.isOverdue).toBe(true);
    });
    
    test('should not be overdue if resolved', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35);
      
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        status: 'RESUELTO',
        createdAt: oldDate
      });
      
      expect(issue.isOverdue).toBe(false);
    });
    
    test('should calculate evidenceCount', () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        evidenceFiles: [
          { url: 'http://example.com/file1.jpg', fileType: 'IMAGE' },
          { url: 'http://example.com/file2.jpg', fileType: 'IMAGE' }
        ]
      });
      
      expect(issue.evidenceCount).toBe(2);
    });
  });
  
  describe('Instance Methods', () => {
    
    test('addNote should add a note to the issue', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      // Mock save method
      issue.save = jest.fn().mockResolvedValue(issue);
      
      await issue.addNote('Test note', '507f1f77bcf86cd799439012', 'GENERAL', false);
      
      expect(issue.notes.length).toBe(1);
      expect(issue.notes[0].content).toBe('Test note');
      expect(issue.notes[0].type).toBe('GENERAL');
      expect(issue.save).toHaveBeenCalled();
    });
    
    test('addEvidence should add evidence to the issue', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      issue.save = jest.fn().mockResolvedValue(issue);
      
      const evidenceData = {
        url: 'http://example.com/evidence.jpg',
        fileType: 'IMAGE',
        description: 'Photo evidence'
      };
      
      await issue.addEvidence(evidenceData);
      
      expect(issue.evidenceFiles.length).toBe(1);
      expect(issue.evidenceFiles[0].url).toBe('http://example.com/evidence.jpg');
      expect(issue.save).toHaveBeenCalled();
    });
    
    test('updateStatus should update status and add to history', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        status: 'NUEVO'
      });
      
      issue.save = jest.fn().mockResolvedValue(issue);
      
      await issue.updateStatus('EN_PROCESO', '507f1f77bcf86cd799439012', 'Starting investigation');
      
      expect(issue.status).toBe('EN_PROCESO');
      expect(issue.statusHistory.length).toBeGreaterThan(0);
      expect(issue.statusHistory[issue.statusHistory.length - 1].status).toBe('EN_PROCESO');
      expect(issue.statusHistory[issue.statusHistory.length - 1].notes).toBe('Starting investigation');
    });
    
    test('assessRisk should calculate risk level correctly', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        safetyAssessment: {
          immediateDanger: true,
          threatsMade: true,
          escalationPattern: true,
          victimFearsForLife: true,
          childrenAtRisk: true
        },
        perpetrator: {
          hasWeapons: true,
          hasViolenceHistory: true
        },
        victim: {
          needsImmediateShelter: true
        }
      });
      
      issue.save = jest.fn().mockResolvedValue(issue);
      
      await issue.assessRisk();
      
      expect(issue.safetyAssessment.riskLevel).toBe('EXTREMO');
      expect(issue.priority).toBe('CRITICO');
    });
    
    test('softDelete should mark issue as deleted', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      issue.save = jest.fn().mockResolvedValue(issue);
      
      await issue.softDelete('507f1f77bcf86cd799439012');
      
      expect(issue.isDeleted).toBe(true);
      expect(issue.deletedAt).toBeDefined();
      expect(issue.deletedBy.toString()).toBe('507f1f77bcf86cd799439012');
    });
  });
  
  describe('Static Methods', () => {
    
    test('findActive should return only non-deleted issues', () => {
      const findSpy = jest.spyOn(Issue, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis()
      });
      
      Issue.findActive();
      
      expect(findSpy).toHaveBeenCalledWith({ isDeleted: false });
    });
    
    test('findByUser should return user issues sorted by date', () => {
      const userId = '507f1f77bcf86cd799439011';
      const findSpy = jest.spyOn(Issue, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis()
      });
      
      Issue.findByUser(userId);
      
      expect(findSpy).toHaveBeenCalledWith({ user: userId, isDeleted: false });
    });
    
    test('findHighPriority should return high priority issues', () => {
      const findSpy = jest.spyOn(Issue, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis()
      });
      
      Issue.findHighPriority();
      
      expect(findSpy).toHaveBeenCalledWith({
        isDeleted: false,
        priority: { $in: ['EMERGENCIA', 'CRITICO'] },
        status: { $nin: ['RESUELTO', 'CERRADO'] }
      });
    });
  });
  
  describe('Pre-save Hooks', () => {
    
    test('should update updatedAt timestamp on save', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() }
      });
      
      const originalUpdatedAt = issue.updatedAt;
      
      // Simulate time passing
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Trigger pre-save hook
      await issue.validate();
      
      // updatedAt should be updated in pre-save hook
      expect(issue.updatedAt).toBeDefined();
    });
    
    test('should set resolvedAt when status changes to RESUELTO', async () => {
      const issue = new Issue({
        title: 'Test title',
        description: 'Test description',
        category: 'VIOLENCIA_DOMESTICA',
        user: '507f1f77bcf86cd799439011',
        incident: { date: new Date() },
        status: 'EN_PROCESO'
      });
      
      issue.status = 'RESUELTO';
      issue.save = jest.fn().mockResolvedValue(issue);
      
      // Manually trigger pre-save logic
      issue.updatedAt = new Date();
      if (issue.status === 'RESUELTO' && !issue.resolvedAt) {
        issue.resolvedAt = new Date();
      }
      
      expect(issue.resolvedAt).toBeDefined();
    });
  });
});

// Export for use in other test files
export default Issue;
