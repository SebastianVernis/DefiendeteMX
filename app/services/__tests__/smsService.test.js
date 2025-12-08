/**
 * Unit Tests for SMS Service
 * Tests SMS sending, validation, and message generation
 */

import smsService from '../smsService';

// Mock Notification model
jest.mock('../../models/Notification', () => {
  return jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'mock-notification-id',
    save: jest.fn().mockResolvedValue(true),
    markAsSent: jest.fn().mockResolvedValue(true),
    markAsFailed: jest.fn().mockResolvedValue(true)
  }));
});

describe('SMS Service Tests', () => {
  
  describe('Phone Number Validation', () => {
    
    test('should validate correct 10-digit phone number', () => {
      expect(smsService.validatePhoneNumber('5512345678')).toBe(true);
      expect(smsService.validatePhoneNumber('1234567890')).toBe(true);
    });
    
    test('should reject invalid phone numbers', () => {
      expect(smsService.validatePhoneNumber('123')).toBe(false);
      expect(smsService.validatePhoneNumber('12345678901')).toBe(false);
      expect(smsService.validatePhoneNumber('abcdefghij')).toBe(false);
      expect(smsService.validatePhoneNumber('')).toBe(false);
    });
    
    test('should handle phone numbers with formatting', () => {
      expect(smsService.validatePhoneNumber('(555) 123-4567')).toBe(true);
      expect(smsService.validatePhoneNumber('555-123-4567')).toBe(true);
      expect(smsService.validatePhoneNumber('555.123.4567')).toBe(true);
    });
  });
  
  describe('Phone Number Formatting', () => {
    
    test('should format phone number to E.164 format', () => {
      const formatted = smsService.formatPhoneNumber('5512345678');
      expect(formatted).toBe('+525512345678');
    });
    
    test('should use custom country code', () => {
      const formatted = smsService.formatPhoneNumber('5512345678', '+1');
      expect(formatted).toBe('+15512345678');
    });
    
    test('should throw error for invalid phone number', () => {
      expect(() => {
        smsService.formatPhoneNumber('123');
      }).toThrow('Phone number must be 10 digits');
    });
    
    test('should clean phone number before formatting', () => {
      const formatted = smsService.formatPhoneNumber('(555) 123-4567');
      expect(formatted).toBe('+525551234567');
    });
  });
  
  describe('Message Template Generation', () => {
    
    test('should generate emergency alert message', () => {
      const message = smsService.generateMessage('EMERGENCY_ALERT', {
        userName: 'Juan Pérez',
        location: 'Calle Principal 123',
        situation: 'Detención policial'
      });
      
      expect(message).toContain('Juan Pérez');
      expect(message).toContain('Calle Principal 123');
      expect(message).toContain('Detención policial');
      expect(message).toContain('ALERTA DE EMERGENCIA');
    });
    
    test('should generate issue update message', () => {
      const message = smsService.generateMessage('ISSUE_UPDATE', {
        issueId: '12345',
        message: 'Estado actualizado'
      });
      
      expect(message).toContain('12345');
      expect(message).toContain('Estado actualizado');
    });
    
    test('should generate court reminder message', () => {
      const message = smsService.generateMessage('COURT_REMINDER', {
        date: '15 de enero de 2025',
        time: '10:00 AM',
        location: 'Juzgado Civil'
      });
      
      expect(message).toContain('15 de enero de 2025');
      expect(message).toContain('10:00 AM');
      expect(message).toContain('Juzgado Civil');
    });
    
    test('should generate safety check message', () => {
      const message = smsService.generateMessage('SAFETY_CHECK', {});
      
      expect(message).toContain('Verificación de seguridad');
      expect(message).toContain('SI o NO');
    });
    
    test('should throw error for unknown template', () => {
      expect(() => {
        smsService.generateMessage('UNKNOWN_TEMPLATE', {});
      }).toThrow('Template not found');
    });
    
    test('should handle missing variables gracefully', () => {
      const message = smsService.generateMessage('EMERGENCY_ALERT', {
        userName: 'Juan Pérez'
        // Missing location and situation
      });
      
      expect(message).toContain('Juan Pérez');
      // Should not throw error
    });
  });
  
  describe('SMS Cost Estimation', () => {
    
    test('should estimate cost for Mexico', () => {
      const estimate = smsService.estimateSMSCost(10, 'MX');
      
      expect(estimate.messageCount).toBe(10);
      expect(estimate.costPerSMS).toBe(0.0075);
      expect(estimate.totalCost).toBe(0.075);
      expect(estimate.currency).toBe('USD');
      expect(estimate.country).toBe('MX');
    });
    
    test('should estimate cost for US', () => {
      const estimate = smsService.estimateSMSCost(5, 'US');
      
      expect(estimate.messageCount).toBe(5);
      expect(estimate.costPerSMS).toBe(0.0075);
      expect(estimate.totalCost).toBe(0.0375);
    });
    
    test('should use default cost for unknown country', () => {
      const estimate = smsService.estimateSMSCost(10, 'XX');
      
      expect(estimate.costPerSMS).toBe(0.01);
      expect(estimate.totalCost).toBe(0.1);
    });
  });
  
  describe('Send SMS (Simulated)', () => {
    
    test('should send SMS successfully in simulation mode', async () => {
      const result = await smsService.sendSMS({
        to: '5512345678',
        message: 'Test message',
        recipientName: 'Test User',
        userId: 'user123',
        category: 'CUSTOM',
        priority: 'MEDIUM'
      });
      
      expect(result.success).toBe(true);
      expect(result.notification).toBeDefined();
      expect(result.result.simulated).toBe(true);
    });
    
    test('should reject invalid phone number', async () => {
      await expect(
        smsService.sendSMS({
          to: '123',
          message: 'Test message',
          recipientName: 'Test User'
        })
      ).rejects.toThrow('Invalid phone number format');
    });
    
    test('should create notification record', async () => {
      const result = await smsService.sendSMS({
        to: '5512345678',
        message: 'Test message',
        recipientName: 'Test User',
        userId: 'user123',
        issueId: 'issue123',
        category: 'EMERGENCY_ALERT',
        priority: 'CRITICAL'
      });
      
      expect(result.notification).toBeDefined();
      expect(result.notification.type).toBe('SMS');
      expect(result.notification.category).toBe('EMERGENCY_ALERT');
      expect(result.notification.priority).toBe('CRITICAL');
    });
  });
  
  describe('Batch SMS', () => {
    
    test('should send batch SMS to multiple recipients', async () => {
      const recipients = [
        { name: 'User 1', phone: '5512345678', userId: 'user1' },
        { name: 'User 2', phone: '5587654321', userId: 'user2' },
        { name: 'User 3', phone: '5511111111', userId: 'user3' }
      ];
      
      const result = await smsService.sendBatchSMS(
        recipients,
        'Test batch message',
        { category: 'CUSTOM', priority: 'MEDIUM' }
      );
      
      expect(result.batchId).toBeDefined();
      expect(result.total).toBe(3);
      expect(result.successful).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.notifications).toHaveLength(3);
    });
    
    test('should handle partial failures in batch', async () => {
      const recipients = [
        { name: 'User 1', phone: '5512345678', userId: 'user1' },
        { name: 'User 2', phone: 'invalid', userId: 'user2' }, // Invalid phone
        { name: 'User 3', phone: '5511111111', userId: 'user3' }
      ];
      
      const result = await smsService.sendBatchSMS(
        recipients,
        'Test batch message',
        { category: 'CUSTOM', priority: 'MEDIUM' }
      );
      
      expect(result.total).toBe(3);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(1);
    });
  });
  
  describe('Emergency Alert', () => {
    
    test('should send emergency alert to all contacts', async () => {
      const emergencyContacts = [
        { name: 'Contact 1', phone: '5512345678', isPrimary: true },
        { name: 'Contact 2', phone: '5587654321', isPrimary: false }
      ];
      
      const result = await smsService.sendEmergencyAlert({
        userId: 'user123',
        emergencyContacts,
        userName: 'Juan Pérez',
        location: 'Calle Principal 123',
        situation: 'Detención policial'
      });
      
      expect(result.success).toBe(true);
      expect(result.results.total).toBe(2);
      expect(result.results.successful).toBe(2);
    });
    
    test('should prioritize primary contacts', async () => {
      const emergencyContacts = [
        { name: 'Contact 1', phone: '5512345678', isPrimary: false },
        { name: 'Contact 2', phone: '5587654321', isPrimary: true }
      ];
      
      const result = await smsService.sendEmergencyAlert({
        userId: 'user123',
        emergencyContacts,
        userName: 'Juan Pérez',
        location: 'Calle Principal 123',
        situation: 'Emergencia'
      });
      
      expect(result.success).toBe(true);
      // Primary contact should be first in the batch
      expect(result.results.notifications[0].recipient).toBe('Contact 2');
    });
    
    test('should include coordinates in message if provided', async () => {
      const emergencyContacts = [
        { name: 'Contact 1', phone: '5512345678', isPrimary: true }
      ];
      
      const result = await smsService.sendEmergencyAlert({
        userId: 'user123',
        emergencyContacts,
        userName: 'Juan Pérez',
        location: 'Calle Principal 123',
        situation: 'Emergencia',
        coordinates: { latitude: 19.4326, longitude: -99.1332 }
      });
      
      expect(result.success).toBe(true);
    });
  });
  
  describe('Specialized Notifications', () => {
    
    test('should send issue update notification', async () => {
      const result = await smsService.sendIssueUpdateNotification({
        issueId: 'issue123',
        userId: 'user123',
        recipientPhone: '5512345678',
        recipientName: 'Test User',
        updateMessage: 'Estado actualizado',
        priority: 'MEDIUM'
      });
      
      expect(result.success).toBe(true);
      expect(result.notification.category).toBe('ISSUE_UPDATE');
    });
    
    test('should send court reminder', async () => {
      const result = await smsService.sendCourtReminder({
        userId: 'user123',
        recipientPhone: '5512345678',
        recipientName: 'Test User',
        date: '15 de enero de 2025',
        time: '10:00 AM',
        location: 'Juzgado Civil'
      });
      
      expect(result.success).toBe(true);
      expect(result.notification.category).toBe('COURT_REMINDER');
      expect(result.notification.priority).toBe('HIGH');
    });
    
    test('should send safety check', async () => {
      const result = await smsService.sendSafetyCheck({
        userId: 'user123',
        recipientPhone: '5512345678',
        recipientName: 'Test User'
      });
      
      expect(result.success).toBe(true);
      expect(result.notification.category).toBe('SAFETY_CHECK');
      expect(result.notification.priority).toBe('HIGH');
    });
  });
});
