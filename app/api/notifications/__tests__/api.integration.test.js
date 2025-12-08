/**
 * Integration Tests for Notification API Routes
 * Tests API endpoints with mocked services
 */

import { POST as emergencyPOST } from '../emergency/route';
import { POST as sendSmsPOST } from '../send-sms/route';
import { GET as historyGET } from '../history/route';
import { GET as statusGET, PATCH as statusPATCH } from '../status/[id]/route';
import { POST as batchSmsPOST } from '../batch-sms/route';

// Mock services
jest.mock('../../../services/notificationService');
jest.mock('../../../services/smsService');
jest.mock('../../../config/database');

import notificationService from '../../../services/notificationService';
import smsService from '../../../services/smsService';
import connectDB from '../../../config/database';

// Mock NextResponse
const mockJson = jest.fn((data, options) => ({
  json: data,
  status: options?.status || 200
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: mockJson
  }
}));

describe('Notification API Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    connectDB.mockResolvedValue(true);
  });
  
  describe('POST /api/notifications/emergency', () => {
    
    test('should trigger emergency alert successfully', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          userId: 'user123',
          location: 'Calle Principal 123',
          situation: 'Detención policial',
          coordinates: { latitude: 19.4326, longitude: -99.1332 }
        })
      };
      
      notificationService.triggerEmergencyAlert.mockResolvedValue({
        success: true,
        contactsNotified: 2,
        smsResults: { total: 2, successful: 2, failed: 0 }
      });
      
      const response = await emergencyPOST(mockRequest);
      
      expect(connectDB).toHaveBeenCalled();
      expect(notificationService.triggerEmergencyAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user123',
          location: 'Calle Principal 123',
          situation: 'Detención policial'
        })
      );
      expect(response.status).toBe(200);
      expect(response.json.success).toBe(true);
    });
    
    test('should return 400 if userId is missing', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          location: 'Test'
        })
      };
      
      const response = await emergencyPOST(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.json.success).toBe(false);
      expect(response.json.error).toContain('userId is required');
    });
    
    test('should return 500 on service error', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          userId: 'user123'
        })
      };
      
      notificationService.triggerEmergencyAlert.mockRejectedValue(
        new Error('Service error')
      );
      
      const response = await emergencyPOST(mockRequest);
      
      expect(response.status).toBe(500);
      expect(response.json.success).toBe(false);
    });
  });
  
  describe('POST /api/notifications/send-sms', () => {
    
    test('should send SMS successfully', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          to: '5512345678',
          message: 'Test message',
          recipientName: 'Test User',
          userId: 'user123',
          category: 'CUSTOM',
          priority: 'MEDIUM'
        })
      };
      
      smsService.validatePhoneNumber.mockReturnValue(true);
      smsService.sendSMS.mockResolvedValue({
        success: true,
        notification: {
          _id: 'notif123',
          status: 'SENT',
          recipient: { name: 'Test User', phone: '5512345678' },
          delivery: { sentAt: new Date() }
        },
        result: { simulated: false }
      });
      
      const response = await sendSmsPOST(mockRequest);
      
      expect(smsService.sendSMS).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.json.success).toBe(true);
    });
    
    test('should return 400 if phone number is missing', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          message: 'Test',
          recipientName: 'Test User'
        })
      };
      
      const response = await sendSmsPOST(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.json.error).toContain('phone number');
    });
    
    test('should return 400 if phone number is invalid', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          to: '123',
          message: 'Test',
          recipientName: 'Test User'
        })
      };
      
      smsService.validatePhoneNumber.mockReturnValue(false);
      
      const response = await sendSmsPOST(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.json.error).toContain('Invalid phone number');
    });
  });
  
  describe('POST /api/notifications/batch-sms', () => {
    
    test('should send batch SMS successfully', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          recipients: [
            { name: 'User 1', phone: '5512345678' },
            { name: 'User 2', phone: '5587654321' }
          ],
          message: 'Test batch message',
          category: 'CUSTOM'
        })
      };
      
      smsService.validatePhoneNumber.mockReturnValue(true);
      smsService.sendBatchSMS.mockResolvedValue({
        batchId: 'batch123',
        total: 2,
        successful: 2,
        failed: 0,
        notifications: []
      });
      
      const response = await batchSmsPOST(mockRequest);
      
      expect(smsService.sendBatchSMS).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.json.success).toBe(true);
    });
    
    test('should return 400 if recipients array is empty', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          recipients: [],
          message: 'Test'
        })
      };
      
      const response = await batchSmsPOST(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.json.error).toContain('Recipients array');
    });
    
    test('should return 400 if batch size exceeds limit', async () => {
      const recipients = Array(101).fill({ name: 'User', phone: '5512345678' });
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          recipients,
          message: 'Test'
        })
      };
      
      smsService.validatePhoneNumber.mockReturnValue(true);
      
      const response = await batchSmsPOST(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.json.error).toContain('Maximum 100 recipients');
    });
  });
  
  describe('GET /api/notifications/history', () => {
    
    test('should retrieve notification history', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/notifications/history?userId=user123&type=SMS&limit=10'
      };
      
      const mockNotifications = [
        { _id: 'notif1', type: 'SMS', status: 'DELIVERED' },
        { _id: 'notif2', type: 'SMS', status: 'SENT' }
      ];
      
      const mockStats = {
        total: 10,
        sent: 8,
        delivered: 7,
        failed: 1,
        pending: 2
      };
      
      notificationService.getNotificationHistory.mockResolvedValue(mockNotifications);
      notificationService.getNotificationStats.mockResolvedValue(mockStats);
      
      const response = await historyGET(mockRequest);
      
      expect(notificationService.getNotificationHistory).toHaveBeenCalledWith(
        'user123',
        expect.objectContaining({ type: 'SMS', limit: 10 })
      );
      expect(response.status).toBe(200);
      expect(response.json.success).toBe(true);
      expect(response.json.data.notifications).toHaveLength(2);
    });
    
    test('should return 400 if userId is missing', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/notifications/history'
      };
      
      const response = await historyGET(mockRequest);
      
      expect(response.status).toBe(400);
      expect(response.json.error).toContain('userId is required');
    });
  });
  
  describe('GET /api/notifications/status/:id', () => {
    
    test('should retrieve notification status', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/notifications/status/notif123'
      };
      
      const mockParams = { id: 'notif123' };
      
      const mockNotification = {
        _id: 'notif123',
        type: 'SMS',
        status: 'DELIVERED',
        recipient: { name: 'Test User', phone: '5512345678' },
        message: { body: 'Test message' },
        delivery: { sentAt: new Date(), deliveredAt: new Date() },
        provider: { name: 'TWILIO', messageId: 'msg123' },
        canRetry: false
      };
      
      notificationService.getNotificationById.mockResolvedValue(mockNotification);
      
      const response = await statusGET(mockRequest, { params: mockParams });
      
      expect(notificationService.getNotificationById).toHaveBeenCalledWith('notif123');
      expect(response.status).toBe(200);
      expect(response.json.success).toBe(true);
      expect(response.json.data.id).toBe('notif123');
    });
    
    test('should return 400 if notification ID is missing', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/notifications/status/'
      };
      
      const mockParams = { id: null };
      
      const response = await statusGET(mockRequest, { params: mockParams });
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('PATCH /api/notifications/status/:id', () => {
    
    test('should mark notification as read', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          action: 'mark_read'
        })
      };
      
      const mockParams = { id: 'notif123' };
      
      const mockNotification = {
        _id: 'notif123',
        status: 'DELIVERED'
      };
      
      notificationService.markNotificationAsRead.mockResolvedValue(mockNotification);
      
      const response = await statusPATCH(mockRequest, { params: mockParams });
      
      expect(notificationService.markNotificationAsRead).toHaveBeenCalledWith('notif123');
      expect(response.status).toBe(200);
      expect(response.json.success).toBe(true);
    });
    
    test('should retry failed notification', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          action: 'retry'
        })
      };
      
      const mockParams = { id: 'notif123' };
      
      notificationService.retryFailedNotification.mockResolvedValue({
        success: true
      });
      
      const response = await statusPATCH(mockRequest, { params: mockParams });
      
      expect(notificationService.retryFailedNotification).toHaveBeenCalledWith('notif123');
      expect(response.status).toBe(200);
    });
    
    test('should return 400 for unknown action', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          action: 'unknown_action'
        })
      };
      
      const mockParams = { id: 'notif123' };
      
      const response = await statusPATCH(mockRequest, { params: mockParams });
      
      expect(response.status).toBe(400);
      expect(response.json.error).toContain('Unknown action');
    });
  });
});
