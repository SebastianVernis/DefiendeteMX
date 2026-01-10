/**
 * Government API Service for D1
 * Handles integration with Mexican government authorities (FGR, Policía, etc.)
 * 
 * Note: As of 2025, no public APIs exist for direct government reporting.
 * This service provides:
 * 1. Standardized report formatting
 * 2. Export functionality for manual submission
 * 3. Future-ready structure for official API partnerships
 */

import { GovernmentReportDB, IssueDB, UserDB } from '../lib/db';

class GovernmentApiService {
  /**
   * Create a government report from an existing issue
   */
  async createReportFromIssue(issueId, userId, reportType, targetEntity, additionalData = {}) {
    try {
      // Fetch the issue with user
      const issue = await IssueDB.findById(issueId);
      
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      // Verify user has access to this issue
      if (issue.userId !== userId) {
        throw new Error('Unauthorized access to issue');
      }
      
      // Fetch user data
      const user = await UserDB.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Map issue data to government report format
      const reportData = this.mapIssueToReportData(issue, user, additionalData);
      
      // Determine priority based on issue
      const priority = this.determinePriority(issue);
      
      // Create the government report
      const report = await GovernmentReportDB.create({
        reportType,
        targetEntity,
        issueId,
        userId,
        status: 'BORRADOR',
        priority,
        reportData,
        isConfidential: true
      });
      
      return report;
    } catch (error) {
      console.error('Error creating government report:', error);
      throw error;
    }
  }

  /**
   * Map issue data to government report format
   */
  mapIssueToReportData(issue, user, additionalData = {}) {
    const baseReport = {
      // Complainant information
      complainant: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || {}
      },
      
      // Incident information
      incident: {
        date: issue.incident?.date || issue.createdAt,
        time: issue.incident?.time || '',
        location: issue.incident?.location || '',
        description: issue.description,
        category: this.translateCategory(issue.category),
        subcategory: issue.subcategory || '',
        witnesses: issue.incident?.witnesses || [],
        evidenceDescription: issue.incident?.evidenceDescription || ''
      },
      
      // Perpetrator information (if available)
      perpetrator: issue.perpetrator || {
        name: 'Desconocido',
        relationship: 'Desconocido',
        description: '',
        knownAddress: false
      },
      
      // Victim information (if different from complainant)
      victim: issue.victim || {
        isComplainant: true,
        name: user.fullName,
        relationship: 'Mismo que denunciante'
      },
      
      // Supporting evidence
      evidence: {
        files: issue.evidenceFiles || [],
        totalFiles: (issue.evidenceFiles || []).length,
        hasPhysicalEvidence: false,
        physicalEvidenceDescription: ''
      },
      
      // Legal information
      legal: {
        hasPreviousReports: issue.legalCase?.hasPreviousReports || false,
        previousReportNumbers: issue.legalCase?.previousReportNumbers || [],
        hasLegalRepresentation: issue.legalCase?.hasLegalRepresentation || false,
        lawyerInfo: issue.legalCase?.lawyerInfo || {}
      },
      
      // Additional information from issue
      additionalInfo: {
        safetyAssessment: issue.safetyAssessment || {},
        emergencyContacts: user.emergencyContacts || [],
        supportServicesRequested: issue.supportServices?.requested || [],
        specialConsiderations: issue.notes?.filter(n => n.isImportant) || []
      }
    };
    
    // Merge with any additional data provided
    return { ...baseReport, ...additionalData };
  }

  /**
   * Determine report priority based on issue data
   */
  determinePriority(issue) {
    // Critical priority conditions
    if (issue.priority === 'EMERGENCIA' || issue.priority === 'CRITICO') {
      return 'CRITICO';
    }
    
    if (issue.safetyAssessment?.immediateDanger) {
      return 'CRITICO';
    }
    
    // High priority conditions
    const highPriorityCategories = [
      'VIOLENCIA_FISICA', 
      'VIOLENCIA_SEXUAL', 
      'ABUSO_SEXUAL',
      'AMENAZAS'
    ];
    
    if (highPriorityCategories.includes(issue.category)) {
      return 'ALTO';
    }
    
    if (issue.safetyAssessment?.riskLevel === 'ALTO' || issue.safetyAssessment?.riskLevel === 'CRITICO') {
      return 'ALTO';
    }
    
    // Default to medium
    return 'MEDIO';
  }

  /**
   * Translate issue category to government terminology
   */
  translateCategory(category) {
    const translations = {
      'VIOLENCIA_DOMESTICA': 'Violencia Familiar',
      'VIOLENCIA_FISICA': 'Lesiones',
      'VIOLENCIA_PSICOLOGICA': 'Violencia Psicológica',
      'VIOLENCIA_SEXUAL': 'Delitos Sexuales',
      'VIOLENCIA_ECONOMICA': 'Violencia Económica o Patrimonial',
      'ACOSO': 'Acoso',
      'ACOSO_LABORAL': 'Acoso Laboral',
      'ACOSO_ESCOLAR': 'Acoso Escolar',
      'ABUSO_SEXUAL': 'Abuso Sexual',
      'DISCRIMINACION': 'Discriminación',
      'AMENAZAS': 'Amenazas',
      'OTRO': 'Otros Delitos'
    };
    
    return translations[category] || category;
  }

  /**
   * Find reports with filters
   */
  async findReports(filters = {}) {
    try {
      const { userId, status, reportType, targetEntity, dateFrom, dateTo, limit = 20, skip = 0 } = filters;

      // For now, use the basic findByUser method
      // In a real implementation, we'd need more complex queries
      if (userId) {
        return await GovernmentReportDB.findByUser(userId, {
          status,
          limit,
          offset: skip
        });
      }

      throw new Error('userId is required for now');
    } catch (error) {
      console.error('Error finding reports:', error);
      throw error;
    }
  }

  /**
   * Update report data
   */
  async updateReport(reportId, updates, userId) {
    try {
      const report = await GovernmentReportDB.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Verify user owns this report
      if (report.userId !== userId) {
        throw new Error('Unauthorized to update this report');
      }
      
      // Merge updates with existing report data
      if (updates.reportData) {
        updates.reportData = {
          ...report.reportData,
          ...updates.reportData
        };
      }
      
      // Add audit log entry
      const auditEntry = {
        action: 'UPDATED',
        performedBy: userId,
        performedAt: new Date().toISOString(),
        changes: Object.keys(updates)
      };
      
      updates.auditLog = [...(report.auditLog || []), auditEntry];
      
      return await GovernmentReportDB.update(reportId, updates);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  /**
   * Generate PDF report
   */
  async generatePDF(reportId, userId) {
    try {
      const report = await GovernmentReportDB.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      if (report.userId !== userId) {
        throw new Error('Unauthorized to access this report');
      }

      // Get issue details if linked
      let issue = null;
      if (report.issueId) {
        issue = await IssueDB.findById(report.issueId);
      }
      
      // TODO: Implement actual PDF generation
      // For now, return a mock structure
      const pdfData = {
        reportNumber: report.reportNumber,
        generatedAt: new Date().toISOString(),
        format: 'PDF',
        content: {
          ...report.reportData,
          reportNumber: report.reportNumber,
          status: report.status,
          createdAt: report.createdAt
        }
      };
      
      // Log export
      const exportEntry = {
        format: 'PDF',
        exportedAt: new Date().toISOString(),
        exportedBy: userId
      };
      
      await GovernmentReportDB.update(reportId, {
        exports: [...(report.exports || []), exportEntry]
      });
      
      return pdfData;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Export report in multiple formats
   */
  async exportReport(reportId, format, userId) {
    try {
      const report = await GovernmentReportDB.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      if (report.userId !== userId) {
        throw new Error('Unauthorized to export this report');
      }
      
      let exportData;
      
      switch (format.toUpperCase()) {
        case 'JSON':
          exportData = this.formatForJSON(report);
          break;
        case 'XML':
          exportData = this.formatForXML(report);
          break;
        case 'PDF':
          exportData = await this.generatePDF(reportId, userId);
          break;
        case 'WORD':
        case 'DOCX':
          exportData = this.formatForWord(report);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      return exportData;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  /**
   * Format report for JSON export
   */
  formatForJSON(report) {
    return {
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'JSON',
        version: '1.0'
      },
      report: {
        reportNumber: report.reportNumber,
        reportType: report.reportType,
        targetEntity: report.targetEntity,
        status: report.status,
        priority: report.priority,
        data: report.reportData,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      }
    };
  }

  /**
   * Format report for XML export
   */
  formatForXML(report) {
    // Simple XML formatting - in production, use a proper XML library
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<GovernmentReport>
  <Metadata>
    <ExportedAt>${new Date().toISOString()}</ExportedAt>
    <Format>XML</Format>
    <Version>1.0</Version>
  </Metadata>
  <Report>
    <ReportNumber>${report.reportNumber}</ReportNumber>
    <ReportType>${report.reportType}</ReportType>
    <TargetEntity>${report.targetEntity}</TargetEntity>
    <Status>${report.status}</Status>
    <Priority>${report.priority}</Priority>
    <CreatedAt>${report.createdAt}</CreatedAt>
    <UpdatedAt>${report.updatedAt}</UpdatedAt>
  </Report>
</GovernmentReport>`;
    
    return xml;
  }

  /**
   * Format report for Word export
   */
  formatForWord(report) {
    // Return structured data that can be used to generate a Word document
    return {
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'DOCX',
        template: 'government_report_v1'
      },
      sections: [
        {
          type: 'header',
          content: {
            title: `Reporte ${report.reportNumber}`,
            entity: report.targetEntity,
            date: new Date().toLocaleDateString('es-MX')
          }
        },
        {
          type: 'complainant',
          content: report.reportData.complainant
        },
        {
          type: 'incident',
          content: report.reportData.incident
        },
        {
          type: 'evidence',
          content: report.reportData.evidence
        }
      ]
    };
  }

  /**
   * Submit report (mock - no real API exists)
   */
  async submitReport(reportId, userId) {
    try {
      const report = await GovernmentReportDB.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      if (report.userId !== userId) {
        throw new Error('Unauthorized to submit this report');
      }
      
      if (report.status !== 'PENDIENTE') {
        throw new Error('Report must be in PENDIENTE status to submit');
      }
      
      // Mock submission
      const submission = {
        submittedAt: new Date().toISOString(),
        submittedBy: userId,
        method: 'MANUAL',
        confirmationNumber: `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        notes: 'Reporte preparado para envío manual. Descargue el PDF y preséntelo en la oficina correspondiente.'
      };
      
      const auditEntry = {
        action: 'SUBMITTED',
        performedBy: userId,
        performedAt: new Date().toISOString(),
        details: submission
      };
      
      await GovernmentReportDB.update(reportId, {
        status: 'ENVIADO',
        submission,
        auditLog: [...(report.auditLog || []), auditEntry]
      });
      
      return {
        success: true,
        confirmationNumber: submission.confirmationNumber,
        message: submission.notes
      };
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }

  /**
   * Cancel report
   */
  async cancelReport(reportId, userId, reason) {
    try {
      const report = await GovernmentReportDB.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      if (report.userId !== userId) {
        throw new Error('Unauthorized to cancel this report');
      }
      
      if (['ENVIADO', 'RECIBIDO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'].includes(report.status)) {
        throw new Error('Cannot cancel report in current status');
      }
      
      const auditEntry = {
        action: 'CANCELLED',
        performedBy: userId,
        performedAt: new Date().toISOString(),
        reason
      };
      
      await GovernmentReportDB.update(reportId, {
        status: 'RECHAZADO',
        auditLog: [...(report.auditLog || []), auditEntry],
        notes: [...(report.notes || []), {
          content: `Reporte cancelado: ${reason}`,
          createdAt: new Date().toISOString(),
          createdBy: userId
        }]
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cancelling report:', error);
      throw error;
    }
  }

  /**
   * Get government report statistics for a user
   */
  async getStats(userId = null) {
    try {
      return await GovernmentReportDB.getStats(userId);
    } catch (error) {
      console.error('Error getting report stats:', error);
      throw error;
    }
  }

  /**
   * Get all reports for a user
   */
  async getUserReports(userId) {
    try {
      return await GovernmentReportDB.findByUser(userId);
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw error;
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId) {
    try {
      const report = await GovernmentReportDB.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      return report;
    } catch (error) {
      console.error('Error getting report:', error);
      throw error;
    }
  }

  /**
   * Check if report exists by report number
   */
  async reportExists(reportNumber) {
    try {
      const report = await GovernmentReportDB.findByReportNumber(reportNumber);
      return !!report;
    } catch (error) {
      console.error('Error checking report existence:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const governmentApiService = new GovernmentApiService();
export default governmentApiService;