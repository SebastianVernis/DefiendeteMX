/**
 * Government API Service
 * Handles integration with Mexican government authorities (FGR, Policía, etc.)
 * 
 * Note: As of 2025, no public APIs exist for direct government reporting.
 * This service provides:
 * 1. Standardized report formatting
 * 2. Export functionality for manual submission
 * 3. Future-ready structure for official API partnerships
 */

import GovernmentReport from '../models/GovernmentReport';
import Issue from '../models/Issue';

class GovernmentApiService {
  /**
   * Create a government report from an existing issue
   */
  async createReportFromIssue(issueId, userId, reportType, targetEntity, additionalData = {}) {
    try {
      // Fetch the issue
      const issue = await Issue.findById(issueId).populate('user');
      
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      // Verify user has access to this issue
      if (issue.user._id.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to issue');
      }
      
      // Map issue data to government report format
      const reportData = this.mapIssueToReportData(issue, additionalData);
      
      // Determine priority based on issue
      const priority = this.determinePriority(issue);
      
      // Create the government report
      const report = new GovernmentReport({
        reportType,
        targetEntity,
        issue: issueId,
        user: userId,
        status: 'BORRADOR',
        priority,
        reportData,
        isConfidential: true
      });
      
      // Add audit log entry
      report.auditLog.push({
        action: 'CREATED',
        performedBy: userId,
        performedAt: new Date(),
        details: `Report created from issue ${issueId}`
      });
      
      await report.save();
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Map Issue data to Government Report format
   */
  mapIssueToReportData(issue, additionalData = {}) {
    const reportData = {
      victim: {
        fullName: issue.user?.fullName || additionalData.victimName,
        age: additionalData.victimAge,
        gender: additionalData.victimGender,
        phone: issue.user?.phone || additionalData.victimPhone,
        email: issue.user?.email,
        address: {
          street: issue.incident?.location?.address,
          city: issue.incident?.location?.city,
          state: issue.incident?.location?.state,
          zipCode: issue.incident?.location?.zipCode
        }
      },
      
      incident: {
        date: issue.incident?.date,
        time: issue.incident?.time,
        location: {
          address: issue.incident?.location?.address,
          city: issue.incident?.location?.city,
          state: issue.incident?.location?.state,
          coordinates: issue.incident?.location?.coordinates,
          description: issue.incident?.location?.description
        },
        description: issue.description,
        category: issue.category,
        severity: issue.priority
      },
      
      perpetrator: {
        name: issue.perpetrator?.name,
        age: issue.perpetrator?.age,
        gender: issue.perpetrator?.gender,
        relationship: issue.perpetrator?.relationship,
        description: issue.perpetrator?.description,
        knownAddress: additionalData.perpetratorAddress,
        hasWeapons: issue.perpetrator?.hasWeapons,
        weaponDescription: issue.perpetrator?.weaponDescription
      },
      
      witnesses: issue.incident?.witnesses?.map(w => ({
        name: w.name,
        contact: w.contact,
        relationship: w.relationship,
        statement: w.statement
      })) || [],
      
      evidenceFiles: issue.evidenceFiles?.map(e => ({
        filename: e.filename,
        fileType: e.fileType,
        description: e.description,
        url: e.url
      })) || [],
      
      additionalInfo: additionalData.additionalInfo || '',
      urgencyLevel: this.mapPriorityToUrgency(issue.priority)
    };
    
    return reportData;
  }
  
  /**
   * Determine report priority based on issue
   */
  determinePriority(issue) {
    // Map issue priority to report priority
    const priorityMap = {
      'CRITICO': 'CRITICO',
      'EMERGENCIA': 'EMERGENCIA',
      'ALTO': 'ALTO',
      'MEDIO': 'MEDIO',
      'BAJO': 'BAJO'
    };
    
    return priorityMap[issue.priority] || 'MEDIO';
  }
  
  /**
   * Map priority to urgency level
   */
  mapPriorityToUrgency(priority) {
    const urgencyMap = {
      'CRITICO': 'CRITICO',
      'EMERGENCIA': 'CRITICO',
      'ALTO': 'ALTO',
      'MEDIO': 'MEDIO',
      'BAJO': 'BAJO'
    };
    
    return urgencyMap[priority] || 'MEDIO';
  }
  
  /**
   * Get all reports for a user
   */
  async getReportsByUser(userId, filters = {}) {
    try {
      const query = { user: userId, isDeleted: false };
      
      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.targetEntity) {
        query.targetEntity = filters.targetEntity;
      }
      
      if (filters.reportType) {
        query.reportType = filters.reportType;
      }
      
      const reports = await GovernmentReport.find(query)
        .populate('issue')
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 });
      
      return {
        success: true,
        count: reports.length,
        data: reports
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get a specific report by ID
   */
  async getReportById(reportId, userId) {
    try {
      const report = await GovernmentReport.findById(reportId)
        .populate('issue')
        .populate('user', 'fullName email phone');
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Verify user has access
      if (report.user._id.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to report');
      }
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Update report data
   */
  async updateReport(reportId, userId, updateData) {
    try {
      const report = await GovernmentReport.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Verify user has access
      if (report.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to report');
      }
      
      // Don't allow updates to submitted reports
      if (report.status !== 'BORRADOR' && report.status !== 'PENDIENTE') {
        throw new Error('Cannot update report that has been submitted');
      }
      
      // Update allowed fields
      if (updateData.reportData) {
        report.reportData = { ...report.reportData, ...updateData.reportData };
      }
      
      if (updateData.priority) {
        report.priority = updateData.priority;
      }
      
      if (updateData.notes) {
        report.notes.push(updateData.notes);
      }
      
      // Add audit log
      report.auditLog.push({
        action: 'UPDATED',
        performedBy: userId,
        performedAt: new Date(),
        details: 'Report data updated'
      });
      
      await report.save();
      
      return {
        success: true,
        data: report
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Submit report to government authority
   * Note: Currently simulates submission. Will integrate with real APIs when available.
   */
  async submitReport(reportId, userId, submissionData = {}) {
    try {
      const report = await GovernmentReport.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Verify user has access
      if (report.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to report');
      }
      
      // Validate report is ready for submission
      if (report.status === 'ENVIADO' || report.status === 'RECIBIDO') {
        throw new Error('Report has already been submitted');
      }
      
      // Validate required data
      this.validateReportForSubmission(report);
      
      // Generate confirmation number
      const confirmationNumber = this.generateConfirmationNumber(report);
      
      // Submit report (currently simulated)
      const submissionResult = await this.performSubmission(report, submissionData);
      
      // Update report with submission details
      await report.submit(
        userId,
        submissionData.method || 'MANUAL',
        confirmationNumber
      );
      
      // If API submission was successful, update with API details
      if (submissionResult.success && submissionResult.apiResponse) {
        report.submission.apiResponse = submissionResult.apiResponse;
        report.submission.apiRequestId = submissionResult.requestId;
        await report.save();
      }
      
      return {
        success: true,
        message: 'Report submitted successfully',
        data: {
          reportId: report._id,
          reportNumber: report.reportNumber,
          confirmationNumber,
          submittedAt: report.submission.submittedAt,
          status: report.status
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validate report has required data for submission
   */
  validateReportForSubmission(report) {
    const errors = [];
    
    if (!report.reportData.incident?.date) {
      errors.push('Incident date is required');
    }
    
    if (!report.reportData.incident?.description) {
      errors.push('Incident description is required');
    }
    
    if (!report.reportData.incident?.location?.city) {
      errors.push('Incident location (city) is required');
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return true;
  }
  
  /**
   * Generate confirmation number
   */
  generateConfirmationNumber(report) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const entityCode = report.targetEntity.substring(0, 3).toUpperCase();
    
    return `CONF-${entityCode}-${timestamp}-${random}`;
  }
  
  /**
   * Perform actual submission to government API
   * Note: Currently simulated. Will integrate with real APIs when available.
   */
  async performSubmission(report, submissionData) {
    // Check if API credentials are configured
    const apiConfig = this.getApiConfig(report.targetEntity);
    
    if (!apiConfig.enabled) {
      // Manual submission - return success with instructions
      return {
        success: true,
        method: 'MANUAL',
        message: 'Report prepared for manual submission',
        instructions: this.getManualSubmissionInstructions(report.targetEntity)
      };
    }
    
    // Future: Implement actual API calls here
    // For now, simulate API response
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful API response
      return {
        success: true,
        method: 'API',
        apiResponse: {
          status: 'received',
          caseNumber: `CASE-${Date.now()}`,
          message: 'Report received by authority'
        },
        requestId: `REQ-${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get API configuration for government entity
   */
  getApiConfig(entity) {
    // Check environment variables for API credentials
    const configs = {
      'FGR': {
        enabled: !!process.env.FGR_API_KEY,
        endpoint: process.env.FGR_API_ENDPOINT,
        apiKey: process.env.FGR_API_KEY
      },
      'POLICIA_FEDERAL': {
        enabled: !!process.env.POLICIA_API_KEY,
        endpoint: process.env.POLICIA_API_ENDPOINT,
        apiKey: process.env.POLICIA_API_KEY
      },
      'EMERGENCIAS_911': {
        enabled: !!process.env.EMERGENCIAS_911_API_KEY,
        endpoint: process.env.EMERGENCIAS_911_API_ENDPOINT,
        apiKey: process.env.EMERGENCIAS_911_API_KEY
      }
    };
    
    return configs[entity] || { enabled: false };
  }
  
  /**
   * Get manual submission instructions
   */
  getManualSubmissionInstructions(entity) {
    const instructions = {
      'FGR': {
        method: 'Web Form or Phone',
        url: 'https://www.fgr.org.mx/denuncia',
        phone: '800-00-85-400',
        steps: [
          'Visit the FGR website or call the hotline',
          'Provide the incident details from this report',
          'Request a case number for tracking',
          'Update this report with the case number received'
        ]
      },
      'POLICIA_FEDERAL': {
        method: 'Phone or In-Person',
        phone: '088',
        steps: [
          'Call the Federal Police hotline',
          'Provide incident details',
          'Request a report number',
          'Visit local police station if required'
        ]
      },
      'EMERGENCIAS_911': {
        method: 'Emergency Phone',
        phone: '911',
        steps: [
          'Call 911 for immediate emergencies',
          'Provide location and incident details',
          'Follow dispatcher instructions',
          'Request incident number for records'
        ]
      },
      'DENUNCIA_ANONIMA': {
        method: 'Anonymous Hotline',
        phone: '089',
        steps: [
          'Call 089 for anonymous reporting',
          'Provide incident details anonymously',
          'No personal information required'
        ]
      }
    };
    
    return instructions[entity] || {
      method: 'Contact local authorities',
      steps: ['Visit or call your local police station']
    };
  }
  
  /**
   * Export report in specified format
   */
  async exportReport(reportId, userId, format = 'JSON', purpose = '') {
    try {
      const report = await GovernmentReport.findById(reportId)
        .populate('issue')
        .populate('user', 'fullName email phone');
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Verify user has access
      if (report.user._id.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to report');
      }
      
      let exportData;
      
      switch (format.toUpperCase()) {
        case 'JSON':
          exportData = this.exportAsJSON(report);
          break;
        case 'PDF':
          exportData = await this.exportAsPDF(report);
          break;
        case 'XML':
          exportData = this.exportAsXML(report);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      // Add export record
      await report.addExport(format.toUpperCase(), userId, null, purpose);
      
      return {
        success: true,
        format: format.toUpperCase(),
        data: exportData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Export report as JSON
   */
  exportAsJSON(report) {
    return {
      reportNumber: report.reportNumber,
      reportType: report.reportType,
      targetEntity: report.targetEntity,
      status: report.status,
      priority: report.priority,
      createdAt: report.createdAt,
      submittedAt: report.submission?.submittedAt,
      confirmationNumber: report.submission?.confirmationNumber,
      
      victim: report.reportData.victim,
      incident: report.reportData.incident,
      perpetrator: report.reportData.perpetrator,
      witnesses: report.reportData.witnesses,
      evidence: report.reportData.evidenceFiles,
      
      governmentResponse: report.governmentResponse,
      
      metadata: {
        isConfidential: report.isConfidential,
        exportedAt: new Date().toISOString()
      }
    };
  }
  
  /**
   * Export report as PDF (formatted text for now)
   */
  async exportAsPDF(report) {
    // For now, return formatted text that can be converted to PDF
    // In production, use a PDF library like pdfkit or puppeteer
    
    const pdfContent = `
REPORTE GUBERNAMENTAL
=====================

Número de Reporte: ${report.reportNumber}
Tipo: ${report.reportType}
Entidad: ${report.targetEntity}
Estado: ${report.status}
Prioridad: ${report.priority}
Fecha de Creación: ${report.createdAt.toLocaleDateString('es-MX')}

INFORMACIÓN DE LA VÍCTIMA
--------------------------
Nombre: ${report.reportData.victim?.fullName || 'No especificado'}
Edad: ${report.reportData.victim?.age || 'No especificado'}
Teléfono: ${report.reportData.victim?.phone || 'No especificado'}
Email: ${report.reportData.victim?.email || 'No especificado'}

DETALLES DEL INCIDENTE
-----------------------
Fecha: ${report.reportData.incident?.date ? new Date(report.reportData.incident.date).toLocaleDateString('es-MX') : 'No especificado'}
Hora: ${report.reportData.incident?.time || 'No especificado'}
Ubicación: ${report.reportData.incident?.location?.address || 'No especificado'}
Ciudad: ${report.reportData.incident?.location?.city || 'No especificado'}
Estado: ${report.reportData.incident?.location?.state || 'No especificado'}

Descripción:
${report.reportData.incident?.description || 'No especificado'}

INFORMACIÓN DEL AGRESOR
------------------------
Nombre: ${report.reportData.perpetrator?.name || 'No especificado'}
Relación: ${report.reportData.perpetrator?.relationship || 'No especificado'}
Descripción: ${report.reportData.perpetrator?.description || 'No especificado'}
Tiene armas: ${report.reportData.perpetrator?.hasWeapons ? 'Sí' : 'No'}

EVIDENCIA
---------
Archivos adjuntos: ${report.reportData.evidenceFiles?.length || 0}

${report.reportData.evidenceFiles?.map((e, i) => 
  `${i + 1}. ${e.filename} (${e.fileType}) - ${e.description || 'Sin descripción'}`
).join('\n') || 'No hay evidencia adjunta'}

INFORMACIÓN DE ENVÍO
--------------------
${report.submission?.submittedAt ? `
Fecha de envío: ${report.submission.submittedAt.toLocaleDateString('es-MX')}
Método: ${report.submission.submissionMethod}
Número de confirmación: ${report.submission.confirmationNumber || 'Pendiente'}
` : 'Reporte no enviado aún'}

${report.governmentResponse?.caseNumber ? `
RESPUESTA GUBERNAMENTAL
-----------------------
Número de caso: ${report.governmentResponse.caseNumber}
Oficial asignado: ${report.governmentResponse.assignedOfficer || 'No asignado'}
Fecha de respuesta: ${report.governmentResponse.responseDate ? new Date(report.governmentResponse.responseDate).toLocaleDateString('es-MX') : 'Pendiente'}
` : ''}

---
Documento generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}
Este documento es confidencial y debe ser manejado de acuerdo con las leyes de protección de datos de México.
`;
    
    return pdfContent;
  }
  
  /**
   * Export report as XML
   */
  exportAsXML(report) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<GovernmentReport>
  <ReportNumber>${report.reportNumber}</ReportNumber>
  <ReportType>${report.reportType}</ReportType>
  <TargetEntity>${report.targetEntity}</TargetEntity>
  <Status>${report.status}</Status>
  <Priority>${report.priority}</Priority>
  <CreatedAt>${report.createdAt.toISOString()}</CreatedAt>
  
  <Victim>
    <FullName>${report.reportData.victim?.fullName || ''}</FullName>
    <Age>${report.reportData.victim?.age || ''}</Age>
    <Phone>${report.reportData.victim?.phone || ''}</Phone>
    <Email>${report.reportData.victim?.email || ''}</Email>
  </Victim>
  
  <Incident>
    <Date>${report.reportData.incident?.date || ''}</Date>
    <Time>${report.reportData.incident?.time || ''}</Time>
    <Location>
      <Address>${report.reportData.incident?.location?.address || ''}</Address>
      <City>${report.reportData.incident?.location?.city || ''}</City>
      <State>${report.reportData.incident?.location?.state || ''}</State>
    </Location>
    <Description><![CDATA[${report.reportData.incident?.description || ''}]]></Description>
  </Incident>
  
  <Perpetrator>
    <Name>${report.reportData.perpetrator?.name || ''}</Name>
    <Relationship>${report.reportData.perpetrator?.relationship || ''}</Relationship>
    <HasWeapons>${report.reportData.perpetrator?.hasWeapons || false}</HasWeapons>
  </Perpetrator>
  
  <Submission>
    <SubmittedAt>${report.submission?.submittedAt || ''}</SubmittedAt>
    <ConfirmationNumber>${report.submission?.confirmationNumber || ''}</ConfirmationNumber>
  </Submission>
</GovernmentReport>`;
  }
  
  /**
   * Delete report (soft delete)
   */
  async deleteReport(reportId, userId) {
    try {
      const report = await GovernmentReport.findById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Verify user has access
      if (report.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to report');
      }
      
      // Don't allow deletion of submitted reports
      if (report.status !== 'BORRADOR' && report.status !== 'PENDIENTE') {
        throw new Error('Cannot delete report that has been submitted');
      }
      
      await report.softDelete(userId);
      
      return {
        success: true,
        message: 'Report deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get statistics for user's reports
   */
  async getReportStatistics(userId) {
    try {
      const reports = await GovernmentReport.find({ user: userId, isDeleted: false });
      
      const stats = {
        total: reports.length,
        byStatus: {},
        byEntity: {},
        byType: {},
        submitted: 0,
        pending: 0,
        resolved: 0
      };
      
      reports.forEach(report => {
        // Count by status
        stats.byStatus[report.status] = (stats.byStatus[report.status] || 0) + 1;
        
        // Count by entity
        stats.byEntity[report.targetEntity] = (stats.byEntity[report.targetEntity] || 0) + 1;
        
        // Count by type
        stats.byType[report.reportType] = (stats.byType[report.reportType] || 0) + 1;
        
        // Count submitted, pending, resolved
        if (report.status === 'ENVIADO' || report.status === 'RECIBIDO' || report.status === 'EN_PROCESO') {
          stats.submitted++;
        }
        if (report.status === 'BORRADOR' || report.status === 'PENDIENTE') {
          stats.pending++;
        }
        if (report.status === 'RESUELTO' || report.status === 'CERRADO') {
          stats.resolved++;
        }
      });
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const governmentApiService = new GovernmentApiService();
export default governmentApiService;
