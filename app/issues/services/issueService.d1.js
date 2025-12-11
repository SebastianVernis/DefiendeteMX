import { IssueDB } from '../../lib/db';
import { 
  validateCreateIssue, 
  validateUpdateIssue, 
  validateStatusTransition,
  sanitizeIssueData 
} from '../validators/issueValidator';

/**
 * Enhanced Issue Service for D1
 * Provides comprehensive CRUD operations and business logic for issues
 */

/**
 * Create a new issue with validation
 * @param {Object} issueData - Issue data
 * @param {Array} files - Optional evidence files
 * @returns {Promise<Object>} - Created issue
 */
export const createIssue = async (issueData, files = []) => {
  try {
    // Sanitize input data
    const sanitizedData = sanitizeIssueData(issueData);
    
    // Validate issue data
    const validation = validateCreateIssue(sanitizedData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
    }

    // Process evidence files if provided
    let evidenceFiles = [];
    if (files && files.length > 0) {
      evidenceFiles = files.map(file => ({
        url: file.url || file.path,
        filename: file.filename || file.name,
        fileType: file.fileType || determineFileType(file.mimetype),
        description: file.description || '',
        size: file.size,
        uploadedAt: new Date().toISOString()
      }));
    }

    // Assess risk level
    const riskLevel = assessRiskLevel(sanitizedData);

    // Create issue with D1
    const issue = await IssueDB.create({
      ...sanitizedData,
      evidenceFiles,
      safetyAssessment: {
        ...sanitizedData.safetyAssessment,
        riskLevel
      }
    });

    return issue;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
};

/**
 * Get issue by ID
 * @param {string} issueId - Issue ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} - Issue object
 */
export const getIssueById = async (issueId, userId) => {
  try {
    const issue = await IssueDB.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.userId !== userId) {
      throw new Error('Unauthorized access');
    }

    return issue;
  } catch (error) {
    console.error('Error getting issue:', error);
    throw error;
  }
};

/**
 * Update issue with validation
 * @param {string} issueId - Issue ID
 * @param {Object} updateData - Data to update
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} - Updated issue
 */
export const updateIssue = async (issueId, updateData, userId) => {
  try {
    // Sanitize input
    const sanitizedData = sanitizeIssueData(updateData);
    
    // Validate update data
    const validation = validateUpdateIssue(sanitizedData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
    }

    // Find issue
    const issue = await IssueDB.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.userId !== userId) {
      throw new Error('Unauthorized to update this issue');
    }

    // Re-assess risk if safety assessment changed
    if (sanitizedData.safetyAssessment) {
      sanitizedData.safetyAssessment.riskLevel = assessRiskLevel({
        ...issue,
        ...sanitizedData
      });
    }

    const updatedIssue = await IssueDB.update(issueId, sanitizedData);
    return updatedIssue;
  } catch (error) {
    console.error('Error updating issue:', error);
    throw error;
  }
};

/**
 * Update issue status with validation
 * @param {string} issueId - Issue ID
 * @param {string} newStatus - New status
 * @param {string} userId - User ID
 * @param {string} notes - Optional notes
 * @returns {Promise<Object>} - Updated issue
 */
export const updateIssueStatus = async (issueId, newStatus, userId, notes = '') => {
  try {
    const issue = await IssueDB.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Validate status transition
    const transitionValidation = validateStatusTransition(issue.status, newStatus);
    if (!transitionValidation.isValid) {
      throw new Error(transitionValidation.error);
    }

    // Update status using D1
    const updatedIssue = await IssueDB.updateStatus(issueId, newStatus, userId, notes);
    return updatedIssue;
  } catch (error) {
    console.error('Error updating issue status:', error);
    throw error;
  }
};

/**
 * Get all issues for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} - Array of issues
 */
export const getUserIssues = async (userId, filters = {}) => {
  try {
    const issues = await IssueDB.findByUser(userId, {
      status: filters.status,
      category: filters.category,
      priority: filters.priority,
      limit: filters.limit || 50,
      offset: filters.offset || 0
    });

    return issues;
  } catch (error) {
    console.error('Error getting user issues:', error);
    throw error;
  }
};

/**
 * Get high priority issues (for admin/moderator view)
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} - Array of high priority issues
 */
export const getHighPriorityIssues = async (filters = {}) => {
  try {
    // This would need a custom query in D1
    // For now, we'll get all and filter
    const { results } = await IssueDB.getDB().prepare(`
      SELECT * FROM issues 
      WHERE is_deleted = 0 
      AND priority IN ('EMERGENCIA', 'CRITICO')
      AND status NOT IN ('RESUELTO', 'CERRADO', 'ARCHIVADO')
      ORDER BY 
        CASE priority 
          WHEN 'CRITICO' THEN 1 
          WHEN 'EMERGENCIA' THEN 2 
          ELSE 3 
        END,
        created_at DESC
      LIMIT ?
    `).bind(filters.limit || 50).all();

    return results.map(transformIssue);
  } catch (error) {
    console.error('Error getting high priority issues:', error);
    throw error;
  }
};

/**
 * Add note to issue
 * @param {string} issueId - Issue ID
 * @param {string} content - Note content
 * @param {string} userId - User ID
 * @param {string} type - Note type
 * @param {boolean} isPrivate - Is note private
 * @returns {Promise<Object>} - Updated issue
 */
export const addNoteToIssue = async (issueId, content, userId, type = 'GENERAL', isPrivate = false) => {
  try {
    const issue = await IssueDB.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const note = {
      content,
      createdBy: userId,
      type,
      isPrivate
    };

    const updatedIssue = await IssueDB.addNote(issueId, note);
    return updatedIssue;
  } catch (error) {
    console.error('Error adding note to issue:', error);
    throw error;
  }
};

/**
 * Add evidence to issue
 * @param {string} issueId - Issue ID
 * @param {Object} evidenceData - Evidence data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated issue
 */
export const addEvidenceToIssue = async (issueId, evidenceData, userId) => {
  try {
    const issue = await IssueDB.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.userId !== userId) {
      throw new Error('Unauthorized to add evidence');
    }

    const evidenceFiles = issue.evidenceFiles || [];
    evidenceFiles.push({
      ...evidenceData,
      uploadedAt: new Date().toISOString()
    });

    const updatedIssue = await IssueDB.update(issueId, { evidenceFiles });
    return updatedIssue;
  } catch (error) {
    console.error('Error adding evidence to issue:', error);
    throw error;
  }
};

/**
 * Search issues
 * @param {string} query - Search query
 * @param {string} userId - User ID (optional, for filtering)
 * @returns {Promise<Array>} - Array of matching issues
 */
export const searchIssues = async (query, userId = null) => {
  try {
    const issues = await IssueDB.search(query, { userId, limit: 20 });
    return issues;
  } catch (error) {
    console.error('Error searching issues:', error);
    throw error;
  }
};

/**
 * Get issues by category
 * @param {string} category - Category
 * @param {Object} options - Options (limit, skip, etc.)
 * @returns {Promise<Array>} - Array of issues
 */
export const getIssuesByCategory = async (category, options = {}) => {
  try {
    const issues = await IssueDB.findByUser(null, {
      category,
      limit: options.limit || 20,
      offset: options.skip || 0
    });

    return issues;
  } catch (error) {
    console.error('Error getting issues by category:', error);
    throw error;
  }
};

/**
 * Soft delete issue
 * @param {string} issueId - Issue ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deleted issue
 */
export const deleteIssue = async (issueId, userId) => {
  try {
    const issue = await IssueDB.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.userId !== userId) {
      throw new Error('Unauthorized to delete this issue');
    }

    await IssueDB.softDelete(issueId);
    return { ...issue, isDeleted: true };
  } catch (error) {
    console.error('Error deleting issue:', error);
    throw error;
  }
};

/**
 * Get issue statistics for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Statistics object
 */
export const getUserIssueStats = async (userId) => {
  try {
    const stats = await IssueDB.getStats(userId);
    return stats;
  } catch (error) {
    console.error('Error getting user issue stats:', error);
    throw error;
  }
};

// Helper function to determine file type from mimetype
function determineFileType(mimetype) {
  if (!mimetype) return 'OTHER';
  
  if (mimetype.startsWith('image/')) return 'IMAGE';
  if (mimetype.startsWith('video/')) return 'VIDEO';
  if (mimetype.startsWith('audio/')) return 'AUDIO';
  if (mimetype.includes('pdf') || mimetype.includes('document')) return 'DOCUMENT';
  
  return 'OTHER';
}

// Helper function to assess risk level
function assessRiskLevel(issueData) {
  const safetyAssessment = issueData.safetyAssessment || {};
  
  // High risk indicators
  if (safetyAssessment.immediateDanger) return 'CRITICO';
  if (safetyAssessment.hasWeapons) return 'CRITICO';
  if (safetyAssessment.recentViolence) return 'ALTO';
  if (safetyAssessment.threatsToKill) return 'CRITICO';
  
  // Category-based risk
  const highRiskCategories = ['VIOLENCIA_FISICA', 'VIOLENCIA_SEXUAL', 'ABUSO_SEXUAL', 'AMENAZAS'];
  if (highRiskCategories.includes(issueData.category)) {
    return 'ALTO';
  }
  
  // Priority-based
  if (issueData.priority === 'EMERGENCIA' || issueData.priority === 'CRITICO') {
    return 'ALTO';
  }
  
  return safetyAssessment.riskLevel || 'MEDIO';
}

// Transform function for raw D1 results
function transformIssue(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    subcategory: row.subcategory,
    incident: JSON.parse(row.incident || '{}'),
    perpetrator: JSON.parse(row.perpetrator || '{}'),
    victim: JSON.parse(row.victim || '{}'),
    safetyAssessment: JSON.parse(row.safety_assessment || '{}'),
    evidenceFiles: JSON.parse(row.evidence_files || '[]'),
    emergencyContacts: JSON.parse(row.emergency_contacts || '[]'),
    legalCase: JSON.parse(row.legal_case || '{}'),
    supportServices: JSON.parse(row.support_services || '{}'),
    statusHistory: JSON.parse(row.status_history || '[]'),
    notes: JSON.parse(row.notes || '[]'),
    followUpActions: JSON.parse(row.follow_up_actions || '[]'),
    tags: JSON.parse(row.tags || '[]'),
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export default {
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
};
