/**
 * Unit Tests for Notification Service
 * Tests notification orchestration and high-level logic
 */

import notificationService from '../notificationService';

// Mock dependencies
jest.mock('../../models/Notification');
jest.mock('../../models/User');
jest.mock('../../models/Issue');
jest.mock('../smsService');

import Notification from '../../models/Notification';
import User from '../../models/User';
import Issue from '../../models/Issue';
import smsService from '../smsService';

describe('Notification Service Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Send Notification', () => {
    
    test('should send SMS notification', async () => {
      smsService.sendSMS.mockResolvedValue({
        success: true,
        notification: { _id: 'notif123', status: 'SENT' }
      });
      
      const result = await notificationService.sendNotification({
        type: 'SMS',
        category: 'CUSTOM',
        priority: 'MEDIUM',
        recipient: {
          phone: '5512345678',
          name: 'Test User',
          userId: 'user123'
        },
        message: {
          body: 'Test message'
        }
      });
      
      expect(result.success).toBe(true);
      expect(smsService.sendSMS).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '5512345678',
          message: 'Test message',
          recipientName: 'Test User'
        })
      );
    });
    
    test('should create in-app notification', async () => {
      const mockNotification = {
        save: jest.fn().mockResolvedValue(true),
        _id: 'notif123',
        status: 'DELIVERED'
      };
      
      Notification.mockImplementation(() => mockNotification);
      
      const result = await notificationService.sendNotification({
        type: 'IN_APP',
        category: 'SYSTEM_NOTIFICATION',
        priority: 'LOW',
        recipient: {
          userId: 'user123',
          name: 'Test User'
        },
        message: {
          subject: 'Test',
          body: 'Test message'
        }
      });
      
      expect(result.success).toBe(true);
      expect(mockNotification.save).toHaveBeenCalled();
    });
    
    test('should throw error for unsupported notification type', async () => {
      await expect(
        notificationService.sendNotification({
          type: 'UNSUPPORTED',
          category: 'CUSTOM',
          recipient: {},
          message: {}
        })
      ).rejects.toThrow('Unsupported notification type');
    });
  });
  
  describe('Trigger Emergency Alert', () => {
    
    test('should send emergency alert to all contacts', async () => {
      const mockUser = {
        _id: 'user123',
        fullName: 'Juan Pérez',
        phone: '5512345678',
        emergencyContacts: [
          { name: 'Contact 1', phone: '5511111111', isPrimary: true },
          { name: 'Contact 2', phone: '5522222222', isPrimary: false }
        ]
      };
      
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      smsService.sendEmergencyAlert.mockResolvedValue({
        success: true,
        results: { total: 2, successful: 2, failed: 0 }
      });
      
      const result = await notificationService.triggerEmergencyAlert({
        userId: 'user123',
        location: 'Calle Principal 123',
        situation: 'Detención policial'
      });
      
      expect(result.success).toBe(true);
      expect(result.contactsNotified).toBe(2);
      expect(smsService.sendEmergencyAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          emergencyContacts: mockUser.emergencyContacts,
          userName: 'Juan Pérez'
        })
      );
    });
    
    test('should throw error if user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
      
      await expect(
        notificationService.triggerEmergencyAlert({
          userId: 'nonexistent',
          location: 'Test',
          situation: 'Test'
        })
      ).rejects.toThrow('User not found');
    });
    
    test('should throw error if no emergency contacts', async () => {
      const mockUser = {
        _id: 'user123',
        fullName: 'Juan Pérez',
        emergencyContacts: []
      };
      
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      await expect(
        notificationService.triggerEmergencyAlert({
          userId: 'user123',
          location: 'Test',
          situation: 'Test'
        })
      ).rejects.toThrow('No emergency contacts configured');
    });
    
    test('should update issue if provided', async () => {
      const mockUser = {
        _id: 'user123',
        fullName: 'Juan Pérez',
        emergencyContacts: [
          { name: 'Contact 1', phone: '5511111111', isPrimary: true }
        ]
      };
      
      const mockIssue = {
        _id: 'issue123',
        emergencyContacts: [
          { name: 'Contact 1', phone: '5511111111' }
        ],
        addNote: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };
      
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      Issue.findById.mockResolvedValue(mockIssue);
      
      smsService.sendEmergencyAlert.mockResolvedValue({
        success: true,
        results: { total: 1, successful: 1, failed: 0 }
      });
      
      await notificationService.triggerEmergencyAlert({
        userId: 'user123',
        issueId: 'issue123',
        location: 'Test',
        situation: 'Test'
      });
      
      expect(mockIssue.addNote).toHaveBeenCalled();
      expect(mockIssue.save).toHaveBeenCalled();
    });
  });
  
  describe('Notify Issue Status Change', () => {
    
    test('should send notification on status change', async () => {
      const mockIssue = {
        _id: 'issue123',
        user: {
          _id: 'user123',
          fullName: 'Juan Pérez',
          phone: '5512345678',
          email: 'juan@example.com'
        }
      };
      
      Issue.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockIssue)
      });
      
      smsService.sendIssueUpdateNotification.mockResolvedValue({
        success: true
      });
      
      const mockNotification = {
        save: jest.fn().mockResolvedValue(true)
      };
      Notification.mockImplementation(() => mockNotification);
      
      const result = await notificationService.notifyIssueStatusChange({
        issueId: 'issue123',
        newStatus: 'EN_PROCESO',
        userId: 'user123',
        notes: 'Caso en revisión'
      });
      
      expect(result.success).toBe(true);
      expect(smsService.sendIssueUpdateNotification).toHaveBeenCalled();
    });
    
    test('should throw error if issue not found', async () => {
      Issue.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      
      await expect(
        notificationService.notifyIssueStatusChange({
          issueId: 'nonexistent',
          newStatus: 'EN_PROCESO',
          userId: 'user123'
        })
      ).rejects.toThrow('Issue not found');
    });
  });
  
  describe('Send Court Date Reminder', () => {
    
    test('should send court reminder', async () => {
      const mockUser = {
        _id: 'user123',
        fullName: 'Juan Pérez',
        phone: '5512345678',
        email: 'juan@example.com'
      };
      
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      smsService.sendCourtReminder.mockResolvedValue({
        success: true
      });
      
      const result = await notificationService.sendCourtDateReminder({
        issueId: 'issue123',
        userId: 'user123',
        courtDate: new Date('2025-01-15'),
        courtTime: '10:00 AM',
        courtLocation: 'Juzgado Civil'
      });
      
      expect(result.success).toBe(true);
      expect(smsService.sendCourtReminder).toHaveBeenCalled();
    });
    
    test('should throw error if user has no phone', async () => {
      const mockUser = {
        _id: 'user123',
        fullName: 'Juan Pérez',
        phone: null
      };
      
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      await expect(
        notificationService.sendCourtDateReminder({
          issueId: 'issue123',
          userId: 'user123',
          courtDate: new Date(),
          courtTime: '10:00 AM',
          courtLocation: 'Test'
        })
      ).rejects.toThrow('User phone number not available');
    });
  });
  
  describe('Notify High Risk Issue', () => {
    
    test('should notify user for high risk issue', async () => {
      const mockIssue = {
        _id: 'issue123',
        user: {
          _id: 'user123',
          fullName: 'Juan Pérez',
          phone: '5512345678',
          emergencyContacts: []
        },
        safetyAssessment: {
          riskLevel: 'ALTO'
        }
      };
      
      Issue.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockIssue)
      });
      
      smsService.sendSMS.mockResolvedValue({
        success: true
      });
      
      const result = await notificationService.notifyHighRiskIssue('issue123');
      
      expect(result.success).toBe(true);
      expect(result.riskLevel).toBe('ALTO');
      expect(smsService.sendSMS).toHaveBeenCalled();
    });
    
    test('should trigger emergency alert for extreme risk', async () => {
      const mockIssue = {
        _id: 'issue123',
        user: {
          _id: 'user123',
          fullName: 'Juan Pérez',
          phone: '5512345678',
          emergencyContacts: [
            { name: 'Contact 1', phone: '5511111111' }
          ]
        },
        safetyAssessment: {
          riskLevel: 'EXTREMO'
        }
      };
      
      Issue.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockIssue)
      });
      
      smsService.sendSMS.mockResolvedValue({ success: true });
      smsService.sendEmergencyAlert.mockResolvedValue({ success: true });
      
      const result = await notificationService.notifyHighRiskIssue('issue123');
      
      expect(result.success).toBe(true);
      expect(smsService.sendEmergencyAlert).toHaveBeenCalled();
    });
    
    test('should not notify for low/medium risk', async () => {
      const mockIssue = {
        _id: 'issue123',
        user: {
          _id: 'user123',
          fullName: 'Juan Pérez',
          phone: '5512345678'
        },
        safetyAssessment: {
          riskLevel: 'MEDIO'
        }
      };
      
      Issue.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockIssue)
      });
      
      const result = await notificationService.notifyHighRiskIssue('issue123');
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('does not require notification');
    });
  });
  
  describe('Get Notification History', () => {
    
    test('should retrieve notification history', async () => {
      const mockNotifications = [
        { _id: 'notif1', type: 'SMS', status: 'DELIVERED' },
        { _id: 'notif2', type: 'SMS', status: 'SENT' }
      ];
      
      Notification.findByUser = jest.fn().mockResolvedValue(mockNotifications);
      
      const result = await notificationService.getNotificationHistory('user123', {
        type: 'SMS',
        limit: 10
      });
      
      expect(result).toHaveLength(2);
      expect(Notification.findByUser).toHaveBeenCalledWith('user123', expect.any(Object));
    });
  });
  
  describe('Get Notification Statistics', () => {
    
    test('should retrieve notification stats', async () => {
      const mockStats = [{
        total: 100,
        sent: 80,
        delivered: 75,
        failed: 5,
        pending: 15,
        totalCost: 7.5
      }];
      
      Notification.getStats = jest.fn().mockResolvedValue(mockStats);
      
      const result = await notificationService.getNotificationStats('user123');
      
      expect(result.total).toBe(100);
      expect(result.sent).toBe(80);
      expect(result.delivered).toBe(75);
    });
    
    test('should return default stats if no data', async () => {
      Notification.getStats = jest.fn().mockResolvedValue([]);
      
      const result = await notificationService.getNotificationStats('user123');
      
      expect(result.total).toBe(0);
      expect(result.sent).toBe(0);
    });
  });
  
  describe('Mark Notification as Read', () => {
    
    test('should mark notification as read', async () => {
      const mockNotification = {
        _id: 'notif123',
        markAsRead: jest.fn().mockResolvedValue(true)
      };
      
      Notification.findById.mockResolvedValue(mockNotification);
      
      const result = await notificationService.markNotificationAsRead('notif123');
      
      expect(mockNotification.markAsRead).toHaveBeenCalled();
    });
    
    test('should throw error if notification not found', async () => {
      Notification.findById.mockResolvedValue(null);
      
      await expect(
        notificationService.markNotificationAsRead('nonexistent')
      ).rejects.toThrow('Notification not found');
    });
  });
  
  describe('Retry Failed Notification', () => {
    
    test('should retry failed SMS notification', async () => {
      const mockNotification = {
        _id: 'notif123',
        type: 'SMS',
        canRetry: true,
        recipient: { phone: '5512345678', name: 'Test User' },
        message: { body: 'Test message' },
        category: 'CUSTOM',
        priority: 'MEDIUM',
        retry: jest.fn().mockResolvedValue(true)
      };
      
      Notification.findById.mockResolvedValue(mockNotification);
      smsService.sendSMS.mockResolvedValue({ success: true });
      
      const result = await notificationService.retryFailedNotification('notif123');
      
      expect(mockNotification.retry).toHaveBeenCalled();
      expect(smsService.sendSMS).toHaveBeenCalled();
    });
    
    test('should throw error if cannot retry', async () => {
      const mockNotification = {
        _id: 'notif123',
        canRetry: false
      };
      
      Notification.findById.mockResolvedValue(mockNotification);
      
      await expect(
        notificationService.retryFailedNotification('notif123')
      ).rejects.toThrow('Cannot retry this notification');
    });
  });
});
