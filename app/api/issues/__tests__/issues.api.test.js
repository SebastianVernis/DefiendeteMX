/**
 * API Integration Tests for Issues Endpoints
 * Tests API route handlers directly
 */

import mongoose from 'mongoose';
import { GET as getIssues, POST as createIssueAPI } from '../route';
import { 
  GET as getIssue, 
  PUT as updateIssueAPI, 
  DELETE as deleteIssueAPI 
} from '../[id]/route';
import { PATCH as updateStatus } from '../[id]/status/route';
import { POST as addNote } from '../[id]/notes/route';
import { POST as addEvidence } from '../[id]/evidence/route';
import { GET as searchIssuesAPI } from '../search/route';
import { GET as getStats } from '../stats/route';
import Issue from '@/app/models/Issue';
import User from '@/app/models/User';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, options = {}) => ({
      json: async () => data,
      status: options.status || 200,
      ok: (options.status || 200) >= 200 && (options.status || 200) < 300
    })
  }
}));

describe('Issues API Integration Tests', () => {
  let testUser;
  let testIssue;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/defiendete-mx-test');
    }
  });

  afterAll(async () => {
    await Issue.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    testUser = await User.create({
      fullName: 'API Test User',
      email: `apitest${Date.now()}@example.com`,
      password: 'password123',
      phone: '5551234567'
    });

    testIssue = await Issue.create({
      title: 'API Test Issue',
      description: 'Test description for API',
      category: 'VIOLENCIA_DOMESTICA',
      user: testUser._id,
      incident: {
        date: new Date('2024-12-01')
      }
    });
  });

  afterEach(async () => {
    await Issue.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/issues', () => {
    it('should create a new issue', async () => {
      const request = {
        json: async () => ({
          title: 'New API Issue',
          description: 'Created via API',
          category: 'VIOLENCIA_FISICA',
          user: testUser._id.toString(),
          incident: {
            date: new Date('2024-12-05')
          }
        })
      };

      const response = await createIssueAPI(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('New API Issue');
    });

    it('should return 400 for missing user', async () => {
      const request = {
        json: async () => ({
          title: 'Invalid Issue',
          description: 'Missing user'
        })
      };

      const response = await createIssueAPI(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('GET /api/issues', () => {
    it('should retrieve user issues', async () => {
      const request = {
        url: `http://localhost:3000/api/issues?userId=${testUser._id.toString()}`
      };

      const response = await getIssues(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });

    it('should return 400 for missing userId', async () => {
      const request = {
        url: 'http://localhost:3000/api/issues'
      };

      const response = await getIssues(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId is required');
    });

    it('should filter issues by status', async () => {
      const request = {
        url: `http://localhost:3000/api/issues?userId=${testUser._id.toString()}&status=NUEVO`
      };

      const response = await getIssues(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('GET /api/issues/[id]', () => {
    it('should retrieve a single issue', async () => {
      const request = {
        url: `http://localhost:3000/api/issues/${testIssue._id}?userId=${testUser._id.toString()}`
      };
      const params = { id: testIssue._id.toString() };

      const response = await getIssue(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data._id.toString()).toBe(testIssue._id.toString());
    });

    it('should return 404 for non-existent issue', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const request = {
        url: `http://localhost:3000/api/issues/${fakeId}?userId=${testUser._id.toString()}`
      };
      const params = { id: fakeId.toString() };

      const response = await getIssue(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it('should return 403 for unauthorized access', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      const request = {
        url: `http://localhost:3000/api/issues/${testIssue._id}?userId=${otherUser._id.toString()}`
      };
      const params = { id: testIssue._id.toString() };

      const response = await getIssue(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe('PUT /api/issues/[id]', () => {
    it('should update an issue', async () => {
      const request = {
        json: async () => ({
          title: 'Updated API Title',
          priority: 'ALTO',
          userId: testUser._id.toString()
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await updateIssueAPI(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Updated API Title');
      expect(data.data.priority).toBe('ALTO');
    });

    it('should return 403 for unauthorized update', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      const request = {
        json: async () => ({
          title: 'Hacked Title',
          userId: otherUser._id.toString()
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await updateIssueAPI(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe('PATCH /api/issues/[id]/status', () => {
    it('should update issue status', async () => {
      const request = {
        json: async () => ({
          status: 'EN_PROCESO',
          userId: testUser._id.toString(),
          notes: 'Starting investigation'
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await updateStatus(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('EN_PROCESO');
    });

    it('should return 400 for invalid status transition', async () => {
      const request = {
        json: async () => ({
          status: 'ARCHIVADO',
          userId: testUser._id.toString()
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await updateStatus(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('POST /api/issues/[id]/notes', () => {
    it('should add a note to an issue', async () => {
      const request = {
        json: async () => ({
          content: 'This is a test note from API',
          userId: testUser._id.toString(),
          type: 'GENERAL'
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await addNote(request, { params });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    it('should return 400 for missing content', async () => {
      const request = {
        json: async () => ({
          userId: testUser._id.toString()
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await addNote(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('content is required');
    });
  });

  describe('POST /api/issues/[id]/evidence', () => {
    it('should add evidence to an issue', async () => {
      const request = {
        json: async () => ({
          url: 'https://example.com/evidence.jpg',
          fileType: 'IMAGE',
          description: 'Test evidence',
          userId: testUser._id.toString()
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await addEvidence(request, { params });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    it('should return 400 for missing url', async () => {
      const request = {
        json: async () => ({
          userId: testUser._id.toString()
        })
      };
      const params = { id: testIssue._id.toString() };

      const response = await addEvidence(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('url is required');
    });
  });

  describe('GET /api/issues/search', () => {
    it('should search issues', async () => {
      const request = {
        url: `http://localhost:3000/api/issues/search?q=API&userId=${testUser._id.toString()}`
      };

      const response = await searchIssuesAPI(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return 400 for missing query', async () => {
      const request = {
        url: 'http://localhost:3000/api/issues/search'
      };

      const response = await searchIssuesAPI(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('q (query) parameter is required');
    });
  });

  describe('GET /api/issues/stats', () => {
    it('should retrieve user statistics', async () => {
      const request = {
        url: `http://localhost:3000/api/issues/stats?userId=${testUser._id.toString()}`
      };

      const response = await getStats(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.total).toBeGreaterThanOrEqual(0);
    });

    it('should return 400 for missing userId', async () => {
      const request = {
        url: 'http://localhost:3000/api/issues/stats'
      };

      const response = await getStats(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId is required');
    });
  });

  describe('DELETE /api/issues/[id]', () => {
    it('should soft delete an issue', async () => {
      const request = {
        url: `http://localhost:3000/api/issues/${testIssue._id}?userId=${testUser._id.toString()}`
      };
      const params = { id: testIssue._id.toString() };

      const response = await deleteIssueAPI(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.isDeleted).toBe(true);
    });

    it('should return 403 for unauthorized deletion', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      const request = {
        url: `http://localhost:3000/api/issues/${testIssue._id}?userId=${otherUser._id.toString()}`
      };
      const params = { id: testIssue._id.toString() };

      const response = await deleteIssueAPI(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });
});
