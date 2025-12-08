/**
 * Unit tests for Government API Service
 */

import governmentApiService from '../governmentApiService';
import GovernmentReport from '../../models/GovernmentReport';
import Issue from '../../models/Issue';

// Mock the models
jest.mock('../../models/GovernmentReport');
jest.mock('../../models/Issue');

describe('GovernmentApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mapIssueToReportData', () => {
    it('should correctly map issue data to report format', () => {
      const mockIssue = {
        user: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '5551234567'
        },
        description: 'Test incident description',
        category: 'VIOLENCIA_DOMESTICA',
        priority: 'ALTO',
        incident: {
          date: new Date('2024-12-01'),
          time: '20:30',
          location: {
            address: 'Calle Principal 123',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '01000',
            coordinates: {
              latitude: 19.4326,
              longitude: -99.1332
            },
            description: 'En la cocina'
          },
          witnesses: [
            {
              name: 'Witness 1',
              contact: '5559876543',
              relationship: 'Vecino',
              statement: 'Vi el incidente'
            }
          ]
        },
        perpetrator: {
          name: 'Perpetrator Name',
          age: 35,
          gender: 'MASCULINO',
          relationship: 'PAREJA_ACTUAL',
          description: 'Description',
          hasWeapons: true,
          weaponDescription: 'Knife'
        },
        evidenceFiles: [
          {
            filename: 'evidence.jpg',
            fileType: 'IMAGE',
            description: 'Photo evidence',
            url: 'https://example.com/evidence.jpg'
          }
        ]
      };

      const reportData = governmentApiService.mapIssueToReportData(mockIssue);

      expect(reportData.victim.fullName).toBe('Test User');
      expect(reportData.incident.description).toBe('Test incident description');
      expect(reportData.incident.category).toBe('VIOLENCIA_DOMESTICA');
      expect(reportData.perpetrator.name).toBe('Perpetrator Name');
      expect(reportData.witnesses).toHaveLength(1);
      expect(reportData.evidenceFiles).toHaveLength(1);
    });
  });

  describe('determinePriority', () => {
    it('should correctly map issue priority to report priority', () => {
      const testCases = [
        { issuePriority: 'CRITICO', expected: 'CRITICO' },
        { issuePriority: 'EMERGENCIA', expected: 'EMERGENCIA' },
        { issuePriority: 'ALTO', expected: 'ALTO' },
        { issuePriority: 'MEDIO', expected: 'MEDIO' },
        { issuePriority: 'BAJO', expected: 'BAJO' }
      ];

      testCases.forEach(({ issuePriority, expected }) => {
        const mockIssue = { priority: issuePriority };
        const result = governmentApiService.determinePriority(mockIssue);
        expect(result).toBe(expected);
      });
    });

    it('should default to MEDIO for unknown priority', () => {
      const mockIssue = { priority: 'UNKNOWN' };
      const result = governmentApiService.determinePriority(mockIssue);
      expect(result).toBe('MEDIO');
    });
  });

  describe('mapPriorityToUrgency', () => {
    it('should correctly map priority to urgency level', () => {
      expect(governmentApiService.mapPriorityToUrgency('CRITICO')).toBe('CRITICO');
      expect(governmentApiService.mapPriorityToUrgency('EMERGENCIA')).toBe('CRITICO');
      expect(governmentApiService.mapPriorityToUrgency('ALTO')).toBe('ALTO');
      expect(governmentApiService.mapPriorityToUrgency('MEDIO')).toBe('MEDIO');
      expect(governmentApiService.mapPriorityToUrgency('BAJO')).toBe('BAJO');
    });
  });

  describe('validateReportForSubmission', () => {
    it('should pass validation for complete report', () => {
      const validReport = {
        reportData: {
          incident: {
            date: new Date(),
            description: 'Test description',
            location: {
              city: 'Ciudad de México'
            }
          }
        }
      };

      expect(() => {
        governmentApiService.validateReportForSubmission(validReport);
      }).not.toThrow();
    });

    it('should throw error for missing incident date', () => {
      const invalidReport = {
        reportData: {
          incident: {
            description: 'Test description',
            location: {
              city: 'Ciudad de México'
            }
          }
        }
      };

      expect(() => {
        governmentApiService.validateReportForSubmission(invalidReport);
      }).toThrow('Incident date is required');
    });

    it('should throw error for missing incident description', () => {
      const invalidReport = {
        reportData: {
          incident: {
            date: new Date(),
            location: {
              city: 'Ciudad de México'
            }
          }
        }
      };

      expect(() => {
        governmentApiService.validateReportForSubmission(invalidReport);
      }).toThrow('Incident description is required');
    });

    it('should throw error for missing location city', () => {
      const invalidReport = {
        reportData: {
          incident: {
            date: new Date(),
            description: 'Test description',
            location: {}
          }
        }
      };

      expect(() => {
        governmentApiService.validateReportForSubmission(invalidReport);
      }).toThrow('Incident location (city) is required');
    });
  });

  describe('generateConfirmationNumber', () => {
    it('should generate confirmation number with correct format', () => {
      const mockReport = {
        targetEntity: 'FGR'
      };

      const confirmationNumber = governmentApiService.generateConfirmationNumber(mockReport);

      expect(confirmationNumber).toMatch(/^CONF-FGR-\d+-\d{4}$/);
    });

    it('should generate unique confirmation numbers', () => {
      const mockReport = {
        targetEntity: 'POLICIA_FEDERAL'
      };

      const num1 = governmentApiService.generateConfirmationNumber(mockReport);
      const num2 = governmentApiService.generateConfirmationNumber(mockReport);

      expect(num1).not.toBe(num2);
    });
  });

  describe('getManualSubmissionInstructions', () => {
    it('should return instructions for FGR', () => {
      const instructions = governmentApiService.getManualSubmissionInstructions('FGR');

      expect(instructions.method).toBe('Web Form or Phone');
      expect(instructions.url).toBe('https://www.fgr.org.mx/denuncia');
      expect(instructions.phone).toBe('800-00-85-400');
      expect(instructions.steps).toBeInstanceOf(Array);
      expect(instructions.steps.length).toBeGreaterThan(0);
    });

    it('should return instructions for EMERGENCIAS_911', () => {
      const instructions = governmentApiService.getManualSubmissionInstructions('EMERGENCIAS_911');

      expect(instructions.method).toBe('Emergency Phone');
      expect(instructions.phone).toBe('911');
      expect(instructions.steps).toBeInstanceOf(Array);
    });

    it('should return default instructions for unknown entity', () => {
      const instructions = governmentApiService.getManualSubmissionInstructions('UNKNOWN');

      expect(instructions.method).toBe('Contact local authorities');
      expect(instructions.steps).toBeInstanceOf(Array);
    });
  });

  describe('exportAsJSON', () => {
    it('should export report in JSON format', () => {
      const mockReport = {
        reportNumber: 'RPT-FGR-123456',
        reportType: 'FGR_DENUNCIA',
        targetEntity: 'FGR',
        status: 'ENVIADO',
        priority: 'ALTO',
        createdAt: new Date('2024-12-01'),
        submission: {
          submittedAt: new Date('2024-12-02'),
          confirmationNumber: 'CONF-123'
        },
        reportData: {
          victim: { fullName: 'Test User' },
          incident: { description: 'Test' },
          perpetrator: { name: 'Perpetrator' },
          witnesses: [],
          evidenceFiles: []
        },
        governmentResponse: {},
        isConfidential: true
      };

      const jsonData = governmentApiService.exportAsJSON(mockReport);

      expect(jsonData.reportNumber).toBe('RPT-FGR-123456');
      expect(jsonData.reportType).toBe('FGR_DENUNCIA');
      expect(jsonData.targetEntity).toBe('FGR');
      expect(jsonData.status).toBe('ENVIADO');
      expect(jsonData.victim.fullName).toBe('Test User');
      expect(jsonData.metadata.isConfidential).toBe(true);
    });
  });

  describe('exportAsXML', () => {
    it('should export report in XML format', () => {
      const mockReport = {
        reportNumber: 'RPT-FGR-123456',
        reportType: 'FGR_DENUNCIA',
        targetEntity: 'FGR',
        status: 'ENVIADO',
        priority: 'ALTO',
        createdAt: new Date('2024-12-01'),
        reportData: {
          victim: { fullName: 'Test User', age: 30 },
          incident: { 
            date: new Date('2024-12-01'),
            description: 'Test incident',
            location: { city: 'CDMX' }
          },
          perpetrator: { name: 'Perpetrator', hasWeapons: true }
        },
        submission: {}
      };

      const xmlData = governmentApiService.exportAsXML(mockReport);

      expect(xmlData).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xmlData).toContain('<GovernmentReport>');
      expect(xmlData).toContain('<ReportNumber>RPT-FGR-123456</ReportNumber>');
      expect(xmlData).toContain('<TargetEntity>FGR</TargetEntity>');
      expect(xmlData).toContain('</GovernmentReport>');
    });
  });

  describe('getApiConfig', () => {
    it('should return disabled config when no API key is set', () => {
      const config = governmentApiService.getApiConfig('FGR');
      expect(config.enabled).toBe(false);
    });

    it('should return config for known entities', () => {
      const entities = ['FGR', 'POLICIA_FEDERAL', 'EMERGENCIAS_911'];
      
      entities.forEach(entity => {
        const config = governmentApiService.getApiConfig(entity);
        expect(config).toHaveProperty('enabled');
      });
    });

    it('should return disabled config for unknown entity', () => {
      const config = governmentApiService.getApiConfig('UNKNOWN_ENTITY');
      expect(config.enabled).toBe(false);
    });
  });
});
