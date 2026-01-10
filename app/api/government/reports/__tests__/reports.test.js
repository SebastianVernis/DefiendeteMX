/**
 * Integration tests for Government Reports API endpoints
 */

import { GET, POST } from '../route';
import { connectDB } from '@/app/config/database';
import governmentApiService from '@/app/services/governmentApiService';

// Mock dependencies
jest.mock('@/app/config/database');
jest.mock('@/app/services/governmentApiService');

describe('Government Reports API - /api/government/reports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    connectDB.mockResolvedValue(true);
  });

  describe('GET /api/government/reports', () => {
    it('should return 400 if userId is missing', async () => {
      const request = {
        url: 'http://localhost:3000/api/government/reports'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('userId is required');
    });

    it('should return reports for valid userId', async () => {
      const mockReports = [
        {
          _id: 'report1',
          reportNumber: 'RPT-FGR-123',
          status: 'ENVIADO'
        }
      ];

      governmentApiService.getReportsByUser.mockResolvedValue({
        success: true,
        count: 1,
        data: mockReports
      });

      const request = {
        url: 'http://localhost:3000/api/government/reports?userId=user123'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.count).toBe(1);
      expect(data.data).toEqual(mockReports);
      expect(governmentApiService.getReportsByUser).toHaveBeenCalledWith('user123', {});
    });

    it('should apply filters from query params', async () => {
      governmentApiService.getReportsByUser.mockResolvedValue({
        success: true,
        count: 0,
        data: []
      });

      const request = {
        url: 'http://localhost:3000/api/government/reports?userId=user123&status=ENVIADO&targetEntity=FGR'
      };

      await GET(request);

      expect(governmentApiService.getReportsByUser).toHaveBeenCalledWith('user123', {
        status: 'ENVIADO',
        targetEntity: 'FGR'
      });
    });

    it('should handle service errors', async () => {
      governmentApiService.getReportsByUser.mockResolvedValue({
        success: false,
        error: 'Database error'
      });

      const request = {
        url: 'http://localhost:3000/api/government/reports?userId=user123'
      };

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Database error');
    });
  });

  describe('POST /api/government/reports', () => {
    it('should return 400 if issueId is missing', async () => {
      const request = {
        json: async () => ({
          userId: 'user123',
          reportType: 'FGR_DENUNCIA',
          targetEntity: 'FGR'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('issueId is required');
    });

    it('should return 400 if userId is missing', async () => {
      const request = {
        json: async () => ({
          issueId: 'issue123',
          reportType: 'FGR_DENUNCIA',
          targetEntity: 'FGR'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('userId is required');
    });

    it('should return 400 if reportType is missing', async () => {
      const request = {
        json: async () => ({
          issueId: 'issue123',
          userId: 'user123',
          targetEntity: 'FGR'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('reportType is required');
    });

    it('should return 400 if targetEntity is missing', async () => {
      const request = {
        json: async () => ({
          issueId: 'issue123',
          userId: 'user123',
          reportType: 'FGR_DENUNCIA'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('targetEntity is required');
    });

    it('should create report successfully with valid data', async () => {
      const mockReport = {
        _id: 'report123',
        reportNumber: 'RPT-FGR-123456',
        status: 'BORRADOR'
      };

      governmentApiService.createReportFromIssue.mockResolvedValue({
        success: true,
        data: mockReport
      });

      const request = {
        json: async () => ({
          issueId: 'issue123',
          userId: 'user123',
          reportType: 'FGR_DENUNCIA',
          targetEntity: 'FGR',
          additionalData: {
            victimAge: 30
          }
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Government report created successfully');
      expect(data.data).toEqual(mockReport);
      expect(governmentApiService.createReportFromIssue).toHaveBeenCalledWith(
        'issue123',
        'user123',
        'FGR_DENUNCIA',
        'FGR',
        { victimAge: 30 }
      );
    });

    it('should handle service errors', async () => {
      governmentApiService.createReportFromIssue.mockResolvedValue({
        success: false,
        error: 'Issue not found'
      });

      const request = {
        json: async () => ({
          issueId: 'issue123',
          userId: 'user123',
          reportType: 'FGR_DENUNCIA',
          targetEntity: 'FGR'
        })
      };

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Issue not found');
    });
  });
});
