/**
 * Chat API Integration Tests
 * Tests for all chat-related API endpoints
 */

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300
    })
  }
}));

// Mock database connection
jest.mock('../../../lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true)
}));

// Mock Chat model
const mockChat = {
  sessionId: 'test_session_123',
  user: 'test_user_123',
  status: 'ACTIVE',
  messages: [],
  context: {
    legalScenario: 'GENERAL',
    emotionalState: 'UNKNOWN',
    riskLevel: 'LOW'
  },
  addMessage: jest.fn().mockResolvedValue(true),
  detectCrisis: jest.fn().mockResolvedValue(true),
  updateContext: jest.fn().mockResolvedValue(true),
  endSession: jest.fn().mockResolvedValue(true),
  addFeedback: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(true)
};

jest.mock('../../../models/Chat', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    createSession: jest.fn(),
    getActiveSessions: jest.fn(),
    getChatHistory: jest.fn(),
    getUserAnalytics: jest.fn(),
    countDocuments: jest.fn()
  }
}));

import Chat from '../../../models/Chat';

describe('Chat API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/chat/session - Create Session', () => {
    test('should create new chat session successfully', async () => {
      Chat.createSession.mockResolvedValue({
        ...mockChat,
        addMessage: jest.fn().mockResolvedValue(true)
      });

      const { POST } = require('../session/route');
      const request = {
        json: async () => ({
          userId: 'test_user_123',
          legalScenario: 'DETENCION_POLICIAL',
          language: 'es'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.sessionId).toBeDefined();
      expect(Chat.createSession).toHaveBeenCalledWith(
        'test_user_123',
        expect.any(String),
        expect.objectContaining({
          legalScenario: 'DETENCION_POLICIAL',
          language: 'es'
        })
      );
    });

    test('should return error if userId is missing', async () => {
      const { POST } = require('../session/route');
      const request = {
        json: async () => ({})
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('userId');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/chat/session - Get Active Sessions', () => {
    test('should return active sessions for user', async () => {
      Chat.getActiveSessions.mockResolvedValue([mockChat]);

      const { GET } = require('../session/route');
      const request = {
        url: 'http://localhost:3000/api/chat/session?userId=test_user_123'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.count).toBe(1);
      expect(Array.isArray(data.data)).toBe(true);
      expect(Chat.getActiveSessions).toHaveBeenCalledWith('test_user_123');
    });

    test('should return error if userId is missing', async () => {
      const { GET } = require('../session/route');
      const request = {
        url: 'http://localhost:3000/api/chat/session'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('userId');
    });
  });

  describe('POST /api/chat/message - Send Message', () => {
    test('should send message and get AI response', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { POST } = require('../message/route');
      const request = {
        json: async () => ({
          sessionId: 'test_session_123',
          userId: 'test_user_123',
          message: '¿Cuáles son mis derechos?'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.message).toBeDefined();
      expect(data.data.message.role).toBe('assistant');
      expect(data.data.message.content).toBeDefined();
      expect(mockChat.addMessage).toHaveBeenCalledTimes(2); // User + Assistant
    });

    test('should detect crisis and update context', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { POST } = require('../message/route');
      const request = {
        json: async () => ({
          sessionId: 'test_session_123',
          userId: 'test_user_123',
          message: 'Quiero suicidarme'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.crisisDetected).toBe(true);
      expect(mockChat.detectCrisis).toHaveBeenCalled();
      expect(mockChat.updateContext).toHaveBeenCalled();
    });

    test('should return error if session not found', async () => {
      Chat.findOne.mockResolvedValue(null);

      const { POST } = require('../message/route');
      const request = {
        json: async () => ({
          sessionId: 'invalid_session',
          userId: 'test_user_123',
          message: 'Test message'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('not found');
      expect(response.status).toBe(404);
    });

    test('should validate message length', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { POST } = require('../message/route');
      const request = {
        json: async () => ({
          sessionId: 'test_session_123',
          userId: 'test_user_123',
          message: 'a'.repeat(5001)
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('too long');
    });
  });

  describe('GET /api/chat/history - Get Chat History', () => {
    test('should return chat history for user', async () => {
      Chat.getChatHistory.mockResolvedValue([mockChat]);
      Chat.countDocuments.mockResolvedValue(1);

      const { GET } = require('../history/route');
      const request = {
        url: 'http://localhost:3000/api/chat/history?userId=test_user_123&limit=20'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.count).toBe(1);
      expect(data.total).toBe(1);
      expect(Chat.getChatHistory).toHaveBeenCalledWith(
        'test_user_123',
        expect.objectContaining({ limit: 20 })
      );
    });

    test('should support pagination', async () => {
      Chat.getChatHistory.mockResolvedValue([mockChat]);
      Chat.countDocuments.mockResolvedValue(50);

      const { GET } = require('../history/route');
      const request = {
        url: 'http://localhost:3000/api/chat/history?userId=test_user_123&limit=20&skip=20'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.hasMore).toBe(true);
      expect(Chat.getChatHistory).toHaveBeenCalledWith(
        'test_user_123',
        expect.objectContaining({ limit: 20, skip: 20 })
      );
    });

    test('should filter by status', async () => {
      Chat.getChatHistory.mockResolvedValue([mockChat]);
      Chat.countDocuments.mockResolvedValue(1);

      const { GET } = require('../history/route');
      const request = {
        url: 'http://localhost:3000/api/chat/history?userId=test_user_123&status=ACTIVE'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(Chat.getChatHistory).toHaveBeenCalledWith(
        'test_user_123',
        expect.objectContaining({ status: 'ACTIVE' })
      );
    });
  });

  describe('POST /api/chat/feedback - Add Feedback', () => {
    test('should add feedback successfully', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { POST } = require('../feedback/route');
      const request = {
        json: async () => ({
          sessionId: 'test_session_123',
          userId: 'test_user_123',
          rating: 5,
          comment: 'Very helpful!',
          helpful: true
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(mockChat.addFeedback).toHaveBeenCalledWith(5, 'Very helpful!', true);
    });

    test('should validate rating range', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { POST } = require('../feedback/route');
      const request = {
        json: async () => ({
          sessionId: 'test_session_123',
          userId: 'test_user_123',
          rating: 6
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('rating');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/chat/analytics - Get Analytics', () => {
    test('should return user analytics', async () => {
      const mockAnalytics = {
        totalSessions: 10,
        activeSessions: 2,
        totalMessages: 150,
        averageSatisfaction: 4.5,
        crisisDetections: 1,
        topScenarios: [
          { scenario: 'DETENCION_POLICIAL', count: 5 }
        ],
        totalDuration: 3600
      };

      Chat.getUserAnalytics.mockResolvedValue(mockAnalytics);

      const { GET } = require('../analytics/route');
      const request = {
        url: 'http://localhost:3000/api/chat/analytics?userId=test_user_123'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockAnalytics);
      expect(Chat.getUserAnalytics).toHaveBeenCalledWith('test_user_123');
    });
  });

  describe('GET /api/chat/quick-actions - Get Quick Actions', () => {
    test('should return all quick actions', async () => {
      const { GET } = require('../quick-actions/route');
      const request = {};

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });
  });

  describe('POST /api/chat/quick-actions - Get Quick Action Content', () => {
    test('should return specific quick action content', async () => {
      const { POST } = require('../quick-actions/route');
      const request = {
        json: async () => ({
          actionKey: 'EMERGENCY_NUMBERS'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.title).toBeDefined();
      expect(data.data.content).toBeDefined();
    });

    test('should return error for invalid action key', async () => {
      const { POST } = require('../quick-actions/route');
      const request = {
        json: async () => ({
          actionKey: 'INVALID_KEY'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/chat/session/:id - Update Session', () => {
    test('should end session successfully', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { PATCH } = require('../session/[id]/route');
      const request = {
        json: async () => ({
          userId: 'test_user_123',
          action: 'end'
        })
      };
      const params = { id: 'test_session_123' };

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(mockChat.endSession).toHaveBeenCalled();
    });

    test('should update context successfully', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { PATCH } = require('../session/[id]/route');
      const request = {
        json: async () => ({
          userId: 'test_user_123',
          action: 'update_context',
          context: { legalScenario: 'VIOLENCIA_DOMESTICA' }
        })
      };
      const params = { id: 'test_session_123' };

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(mockChat.updateContext).toHaveBeenCalledWith({
        legalScenario: 'VIOLENCIA_DOMESTICA'
      });
    });
  });

  describe('DELETE /api/chat/session/:id - Delete Session', () => {
    test('should soft delete session successfully', async () => {
      Chat.findOne.mockResolvedValue(mockChat);

      const { DELETE } = require('../session/[id]/route');
      const request = {
        url: 'http://localhost:3000/api/chat/session/test_session_123?userId=test_user_123'
      };
      const params = { id: 'test_session_123' };

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(mockChat.save).toHaveBeenCalled();
    });
  });
});
