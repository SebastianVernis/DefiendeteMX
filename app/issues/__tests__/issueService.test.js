/**
 * Issue Service Unit Tests
 * Tests all CRUD operations and business logic
 */

import mongoose from 'mongoose';
import {
  createIssue,
  getIssueById,
  updateIssue,
  updateIssueStatus,
  getUserIssues,
  getHighPriorityIssues,
  addNoteToIssue,
  addEvidenceToIssue,
  searchIssues,
  getIssuesByCategory,
  deleteIssue,
  getUserIssueStats
} from '../services/issueService';
import Issue from '../../models/Issue';
import User from '../../models/User';

// Mock the database connection
jest.mock('../../config/database', () => ({
  connectDB: jest.fn().mockResolvedValue(true)
}));

describe('Issue Service', () => {
  let testUser;
  let testIssue;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/defiendete-mx-test');
    }
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Issue.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '5551234567'
    });

    // Create a test issue
    testIssue = await Issue.create({
      title: 'Test Issue',
      description: 'Test description',
      category: 'VIOLENCIA_DOMESTICA',
      user: testUser._id,
      incident: {
        date: new Date('2024-12-01')
      }
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await Issue.deleteMany({});
    await User.deleteMany({});
  });

  describe('createIssue', () => {
    it('should create a new issue with valid data', async () => {
      const issueData = {
        title: 'New Issue',
        description: 'New issue description',
        category: 'VIOLENCIA_FISICA',
        user: testUser._id.toString(),
        incident: {
          date: new Date('2024-12-05')
        }
      };

      const issue = await createIssue(issueData);

      expect(issue).toBeDefined();
      expect(issue.title).toBe('New Issue');
      expect(issue.category).toBe('VIOLENCIA_FISICA');
      expect(issue.status).toBe('NUEVO');
    });

    it('should throw error for missing required fields', async () => {
      const invalidData = {
        description: 'Missing title'
      };

      await expect(createIssue(invalidData)).rejects.toThrow();
    });

    it('should assess risk automatically', async () => {
      const issueData = {
        title: 'High Risk Issue',
        description: 'Dangerous situation',
        category: 'VIOLENCIA_DOMESTICA',
        user: testUser._id.toString(),
        incident: {
          date: new Date()
        },
        safetyAssessment: {
          immediateDanger: true,
          threatsMade: true,
          victimFearsForLife: true
        }
      };

      const issue = await createIssue(issueData);

      expect(issue.safetyAssessment.riskLevel).toBeDefined();
      expect(['ALTO', 'EXTREMO']).toContain(issue.safetyAssessment.riskLevel);
    });
  });

  describe('getIssueById', () => {
    it('should retrieve an issue by ID', async () => {
      const issue = await getIssueById(testIssue._id.toString(), testUser._id.toString());

      expect(issue).toBeDefined();
      expect(issue._id.toString()).toBe(testIssue._id.toString());
      expect(issue.title).toBe('Test Issue');
    });

    it('should throw error for non-existent issue', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(getIssueById(fakeId.toString(), testUser._id.toString())).rejects.toThrow('Issue not found');
    });

    it('should throw error for unauthorized access', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      await expect(getIssueById(testIssue._id.toString(), otherUser._id.toString())).rejects.toThrow('Unauthorized access');
    });
  });

  describe('updateIssue', () => {
    it('should update issue fields', async () => {
      const updateData = {
        title: 'Updated Title',
        priority: 'ALTO'
      };

      const updated = await updateIssue(testIssue._id.toString(), updateData, testUser._id.toString());

      expect(updated.title).toBe('Updated Title');
      expect(updated.priority).toBe('ALTO');
    });

    it('should throw error for unauthorized update', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      await expect(updateIssue(testIssue._id.toString(), { title: 'Hack' }, otherUser._id.toString()))
        .rejects.toThrow('Unauthorized to update this issue');
    });
  });

  describe('updateIssueStatus', () => {
    it('should update status with valid transition', async () => {
      const updated = await updateIssueStatus(
        testIssue._id.toString(),
        'EN_PROCESO',
        testUser._id.toString(),
        'Starting investigation'
      );

      expect(updated.status).toBe('EN_PROCESO');
      expect(updated.statusHistory.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid status transition', async () => {
      await expect(updateIssueStatus(
        testIssue._id.toString(),
        'ARCHIVADO',
        testUser._id.toString()
      )).rejects.toThrow();
    });
  });

  describe('getUserIssues', () => {
    it('should retrieve all issues for a user', async () => {
      const issues = await getUserIssues(testUser._id.toString());

      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].user._id.toString()).toBe(testUser._id.toString());
    });

    it('should filter issues by status', async () => {
      await updateIssueStatus(testIssue._id.toString(), 'EN_PROCESO', testUser._id.toString());

      const issues = await getUserIssues(testUser._id.toString(), { status: 'EN_PROCESO' });

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].status).toBe('EN_PROCESO');
    });

    it('should filter issues by category', async () => {
      const issues = await getUserIssues(testUser._id.toString(), { category: 'VIOLENCIA_DOMESTICA' });

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].category).toBe('VIOLENCIA_DOMESTICA');
    });
  });

  describe('getHighPriorityIssues', () => {
    it('should retrieve high priority issues', async () => {
      await updateIssue(testIssue._id.toString(), { priority: 'EMERGENCIA' }, testUser._id.toString());

      const issues = await getHighPriorityIssues();

      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBeGreaterThan(0);
      expect(['EMERGENCIA', 'CRITICO']).toContain(issues[0].priority);
    });
  });

  describe('addNoteToIssue', () => {
    it('should add a note to an issue', async () => {
      const updated = await addNoteToIssue(
        testIssue._id.toString(),
        'This is a test note',
        testUser._id.toString(),
        'GENERAL',
        false
      );

      expect(updated.notes.length).toBeGreaterThan(0);
      expect(updated.notes[updated.notes.length - 1].content).toBe('This is a test note');
    });
  });

  describe('addEvidenceToIssue', () => {
    it('should add evidence to an issue', async () => {
      const evidenceData = {
        url: 'https://example.com/evidence.jpg',
        fileType: 'IMAGE',
        description: 'Photo evidence',
        size: 1024000
      };

      const updated = await addEvidenceToIssue(
        testIssue._id.toString(),
        evidenceData,
        testUser._id.toString()
      );

      expect(updated.evidenceFiles.length).toBeGreaterThan(0);
      expect(updated.evidenceFiles[updated.evidenceFiles.length - 1].url).toBe('https://example.com/evidence.jpg');
    });

    it('should throw error for unauthorized evidence addition', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      await expect(addEvidenceToIssue(
        testIssue._id.toString(),
        { url: 'https://example.com/hack.jpg' },
        otherUser._id.toString()
      )).rejects.toThrow('Unauthorized to add evidence');
    });
  });

  describe('searchIssues', () => {
    it('should search issues by text query', async () => {
      // Note: Text search requires text index to be created
      const issues = await searchIssues('Test', testUser._id.toString());

      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('getIssuesByCategory', () => {
    it('should retrieve issues by category', async () => {
      const issues = await getIssuesByCategory('VIOLENCIA_DOMESTICA');

      expect(Array.isArray(issues)).toBe(true);
      if (issues.length > 0) {
        expect(issues[0].category).toBe('VIOLENCIA_DOMESTICA');
      }
    });
  });

  describe('deleteIssue', () => {
    it('should soft delete an issue', async () => {
      const deleted = await deleteIssue(testIssue._id.toString(), testUser._id.toString());

      expect(deleted.isDeleted).toBe(true);
      expect(deleted.deletedAt).toBeDefined();
      expect(deleted.deletedBy.toString()).toBe(testUser._id.toString());
    });

    it('should throw error for unauthorized deletion', async () => {
      const otherUser = await User.create({
        fullName: 'Other User',
        email: `other${Date.now()}@example.com`,
        password: 'password123',
        phone: '5559876543'
      });

      await expect(deleteIssue(testIssue._id.toString(), otherUser._id.toString()))
        .rejects.toThrow('Unauthorized to delete this issue');
    });
  });

  describe('getUserIssueStats', () => {
    it('should retrieve user statistics', async () => {
      const stats = await getUserIssueStats(testUser._id.toString());

      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.nuevo).toBeGreaterThanOrEqual(0);
      expect(stats.enProceso).toBeGreaterThanOrEqual(0);
      expect(stats.resuelto).toBeGreaterThanOrEqual(0);
      expect(stats.highPriority).toBeGreaterThanOrEqual(0);
    });
  });
});
