import Issue from '../../models/Issue';
import { 
  validateCreateIssue, 
  validateUpdateIssue, 
  validateStatusTransition,
  sanitizeIssueData 
} from '../validators/issueValidator';

/**
 * Enhanced Issue Service
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
      // Note: uploadToCloudStorage should be implemented separately
      // For now, we'll structure the evidence data
      evidenceFiles = files.map(file => ({
        url: file.url || file.path,
        filename: file.filename || file.name,
        fileType: file.fileType || determineFileType(file.mimetype),
        description: file.description || '',
        size: file.size,
        uploadedAt: new Date()
      }));
    }

    // Create issue with evidence
    const issue = new Issue({
      ...sanitizedData,
      evidenceFiles,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Assess risk automatically
    await issue.assessRisk();

    // Save to database
    const savedIssue = await issue.save();
    
    // Populate user reference
    await savedIssue.populate('user', 'fullName email phone');

    return savedIssue;
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
    const issue = await Issue.findOne({ 
      _id: issueId, 
      isDeleted: false 
    })
    .populate('user', 'fullName email phone')
    .populate('statusHistory.changedBy', 'fullName')
    .populate('notes.createdBy', 'fullName')
    .populate('sharedWith.user', 'fullName email');

    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.user._id.toString() !== userId && !issue.sharedWith.some(s => s.user._id.toString() === userId)) {
      throw new Error('Unauthorized access');
    }

    // Update last viewed timestamp
    issue.lastViewedAt = new Date();
    await issue.save();

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
    const issue = await Issue.findOne({ _id: issueId, isDeleted: false });
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.user.toString() !== userId) {
      throw new Error('Unauthorized to update this issue');
    }

    // Update fields
    Object.keys(sanitizedData).forEach(key => {
      issue[key] = sanitizedData[key];
    });

    issue.updatedAt = new Date();

    // Re-assess risk if safety assessment changed
    if (sanitizedData.safetyAssessment) {
      await issue.assessRisk();
    }

    const updatedIssue = await issue.save();
    await updatedIssue.populate('user', 'fullName email phone');

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
    const issue = await Issue.findOne({ _id: issueId, isDeleted: false });
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Validate status transition
    const transitionValidation = validateStatusTransition(issue.status, newStatus);
    if (!transitionValidation.isValid) {
      throw new Error(transitionValidation.error);
    }

    // Update status using instance method
    await issue.updateStatus(newStatus, userId, notes);
    await issue.populate('user', 'fullName email phone');

    return issue;
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
    const query = { 
      user: userId, 
      isDeleted: false 
    };

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }
    if (filters.riskLevel) {
      query['safetyAssessment.riskLevel'] = filters.riskLevel;
    }

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email')
      .select('-notes -statusHistory'); // Exclude detailed fields for list view

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
    const query = {
      isDeleted: false,
      priority: { $in: ['EMERGENCIA', 'CRITICO'] },
      status: { $nin: ['RESUELTO', 'CERRADO', 'ARCHIVADO'] }
    };

    if (filters.category) {
      query.category = filters.category;
    }

    const issues = await Issue.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate('user', 'fullName email phone')
      .limit(filters.limit || 50);

    return issues;
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
    const issue = await Issue.findOne({ _id: issueId, isDeleted: false });
    if (!issue) {
      throw new Error('Issue not found');
    }

    await issue.addNote(content, userId, type, isPrivate);
    return issue;
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
    const issue = await Issue.findOne({ _id: issueId, isDeleted: false });
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.user.toString() !== userId) {
      throw new Error('Unauthorized to add evidence');
    }

    await issue.addEvidence(evidenceData);
    return issue;
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
    let searchQuery = {
      $text: { $search: query },
      isDeleted: false
    };

    if (userId) {
      searchQuery.user = userId;
    }

    const issues = await Issue.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .populate('user', 'fullName email')
      .limit(20);

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
    const query = { 
      category, 
      isDeleted: false 
    };

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 20)
      .skip(options.skip || 0)
      .populate('user', 'fullName email');

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
    const issue = await Issue.findOne({ _id: issueId, isDeleted: false });
    if (!issue) {
      throw new Error('Issue not found');
    }

    // Check authorization
    if (issue.user.toString() !== userId) {
      throw new Error('Unauthorized to delete this issue');
    }

    await issue.softDelete(userId);
    return issue;
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
    const stats = await Issue.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          nuevo: { $sum: { $cond: [{ $eq: ['$status', 'NUEVO'] }, 1, 0] } },
          enProceso: { $sum: { $cond: [{ $eq: ['$status', 'EN_PROCESO'] }, 1, 0] } },
          resuelto: { $sum: { $cond: [{ $eq: ['$status', 'RESUELTO'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $in: ['$priority', ['EMERGENCIA', 'CRITICO']] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || { total: 0, nuevo: 0, enProceso: 0, resuelto: 0, highPriority: 0 };
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