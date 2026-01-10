/**
 * Database Abstraction Layer for Cloudflare D1
 * Provides a unified interface for database operations
 */

import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Get D1 database instance from Cloudflare context
 * @returns {D1Database} D1 database instance
 */
export function getDB() {
  try {
    const { env } = getRequestContext();
    if (!env?.DB) {
      console.warn('D1 database not available, using mock');
      return createMockDB();
    }
    return env.DB;
  } catch (error) {
    // During build or development without Cloudflare context
    console.warn('Cloudflare context not available:', error.message);
    return createMockDB();
  }
}

/**
 * Create a mock database for development/build
 */
function createMockDB() {
  return {
    prepare: () => ({
      bind: () => ({
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ success: true, meta: { changes: 0 } })
      }),
      first: async () => null,
      all: async () => ({ results: [] }),
      run: async () => ({ success: true, meta: { changes: 0 } })
    }),
    batch: async () => [],
    exec: async () => ({ success: true })
  };
}

/**
 * Generate a UUID v4
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Get current ISO timestamp
 */
export function now() {
  return new Date().toISOString();
}

/**
 * Parse JSON safely
 */
export function parseJSON(str, defaultValue = null) {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * Stringify JSON safely
 */
export function toJSON(obj) {
  if (obj === null || obj === undefined) return null;
  return JSON.stringify(obj);
}

// ============================================
// USER OPERATIONS
// ============================================

export const UserDB = {
  /**
   * Find user by ID
   */
  async findById(id) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM users WHERE id = ? AND is_deleted = 0'
    ).bind(id).first();
    return result ? transformUser(result) : null;
  },

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND is_deleted = 0'
    ).bind(email.toLowerCase()).first();
    return result ? transformUser(result) : null;
  },

  /**
   * Find user by email with password (for auth)
   */
  async findByCredentials(email) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND is_active = 1 AND is_deleted = 0'
    ).bind(email.toLowerCase()).first();
    return result ? transformUser(result, true) : null;
  },

  /**
   * Create new user
   */
  async create(userData) {
    const db = getDB();
    const id = generateId();
    const timestamp = now();
    
    await db.prepare(`
      INSERT INTO users (
        id, email, password, full_name, phone, date_of_birth, gender,
        address, emergency_contacts, role, privacy_settings,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userData.email.toLowerCase(),
      userData.password,
      userData.fullName,
      userData.phone || null,
      userData.dateOfBirth || null,
      userData.gender || null,
      toJSON(userData.address || {}),
      toJSON(userData.emergencyContacts || []),
      userData.role || 'USER',
      toJSON(userData.privacySettings || { shareLocation: false, allowNotifications: true, publicProfile: false }),
      timestamp,
      timestamp
    ).run();

    return this.findById(id);
  },

  /**
   * Update user
   */
  async update(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    const fieldMap = {
      fullName: 'full_name',
      phone: 'phone',
      dateOfBirth: 'date_of_birth',
      gender: 'gender',
      address: 'address',
      emergencyContacts: 'emergency_contacts',
      isActive: 'is_active',
      isVerified: 'is_verified',
      verificationToken: 'verification_token',
      verificationTokenExpires: 'verification_token_expires',
      resetPasswordToken: 'reset_password_token',
      resetPasswordExpires: 'reset_password_expires',
      refreshTokens: 'refresh_tokens',
      role: 'role',
      isPremium: 'is_premium',
      premiumExpiresAt: 'premium_expires_at',
      privacySettings: 'privacy_settings',
      lastLogin: 'last_login',
      loginAttempts: 'login_attempts',
      lockUntil: 'lock_until',
      password: 'password'
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (dbField) {
        fields.push(`${dbField} = ?`);
        // JSON fields
        if (['address', 'emergencyContacts', 'refreshTokens', 'privacySettings'].includes(key)) {
          values.push(toJSON(value));
        } else if (typeof value === 'boolean') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(now());
    values.push(id);

    await db.prepare(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return this.findById(id);
  },

  /**
   * Add refresh token
   */
  async addRefreshToken(id, token, expiresAt, userAgent, ipAddress) {
    const user = await this.findById(id);
    if (!user) return null;

    let tokens = user.refreshTokens || [];
    // Remove expired tokens
    tokens = tokens.filter(t => new Date(t.expiresAt) > new Date());
    // Limit to 5 tokens
    if (tokens.length >= 5) tokens.shift();
    
    tokens.push({
      token,
      expiresAt,
      userAgent,
      ipAddress,
      createdAt: now()
    });

    return this.update(id, { refreshTokens: tokens });
  },

  /**
   * Remove refresh token
   */
  async removeRefreshToken(id, token) {
    const user = await this.findById(id);
    if (!user) return null;

    const tokens = (user.refreshTokens || []).filter(t => t.token !== token);
    return this.update(id, { refreshTokens: tokens });
  },

  /**
   * Soft delete user
   */
  async softDelete(id) {
    const db = getDB();
    await db.prepare(
      'UPDATE users SET is_deleted = 1, deleted_at = ?, is_active = 0, updated_at = ? WHERE id = ?'
    ).bind(now(), now(), id).run();
    return true;
  }
};

function transformUser(row, includePassword = false) {
  if (!row) return null;
  const user = {
    id: row.id,
    _id: row.id, // Mongoose compatibility
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    address: parseJSON(row.address, {}),
    emergencyContacts: parseJSON(row.emergency_contacts, []),
    isActive: !!row.is_active,
    isVerified: !!row.is_verified,
    verificationToken: row.verification_token,
    verificationTokenExpires: row.verification_token_expires,
    resetPasswordToken: row.reset_password_token,
    resetPasswordExpires: row.reset_password_expires,
    refreshTokens: parseJSON(row.refresh_tokens, []),
    role: row.role,
    isPremium: !!row.is_premium,
    premiumExpiresAt: row.premium_expires_at,
    privacySettings: parseJSON(row.privacy_settings, {}),
    lastLogin: row.last_login,
    loginAttempts: row.login_attempts,
    lockUntil: row.lock_until,
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
  
  if (includePassword) {
    user.password = row.password;
  }
  
  // Virtual: isLocked
  user.isLocked = !!(user.lockUntil && new Date(user.lockUntil) > new Date());
  
  return user;
}

// ============================================
// ISSUE OPERATIONS
// ============================================

export const IssueDB = {
  /**
   * Find issue by ID
   */
  async findById(id) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM issues WHERE id = ? AND is_deleted = 0'
    ).bind(id).first();
    return result ? transformIssue(result) : null;
  },

  /**
   * Find issues by user
   */
  async findByUser(userId, options = {}) {
    const db = getDB();
    const { limit = 50, offset = 0, status, category, priority } = options;
    
    let query = 'SELECT * FROM issues WHERE user_id = ? AND is_deleted = 0';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(query).bind(...params).all();
    return results.map(transformIssue);
  },

  /**
   * Create new issue
   */
  async create(issueData) {
    const db = getDB();
    const id = generateId();
    const timestamp = now();

    await db.prepare(`
      INSERT INTO issues (
        id, user_id, title, description, status, priority, category, subcategory,
        incident, perpetrator, victim, safety_assessment, evidence_files,
        emergency_contacts, legal_case, support_services, status_history,
        notes, follow_up_actions, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      issueData.user || issueData.userId,
      issueData.title,
      issueData.description,
      issueData.status || 'NUEVO',
      issueData.priority || 'MEDIO',
      issueData.category,
      issueData.subcategory || null,
      toJSON(issueData.incident || {}),
      toJSON(issueData.perpetrator || {}),
      toJSON(issueData.victim || {}),
      toJSON(issueData.safetyAssessment || { riskLevel: 'MEDIO', immediateDanger: false }),
      toJSON(issueData.evidenceFiles || []),
      toJSON(issueData.emergencyContacts || []),
      toJSON(issueData.legalCase || {}),
      toJSON(issueData.supportServices || {}),
      toJSON([{ status: issueData.status || 'NUEVO', changedAt: timestamp, notes: 'Caso creado' }]),
      toJSON(issueData.notes || []),
      toJSON(issueData.followUpActions || []),
      toJSON(issueData.tags || []),
      timestamp,
      timestamp
    ).run();

    return this.findById(id);
  },

  /**
   * Update issue
   */
  async update(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    const fieldMap = {
      title: 'title',
      description: 'description',
      status: 'status',
      priority: 'priority',
      category: 'category',
      subcategory: 'subcategory',
      incident: 'incident',
      perpetrator: 'perpetrator',
      victim: 'victim',
      safetyAssessment: 'safety_assessment',
      evidenceFiles: 'evidence_files',
      emergencyContacts: 'emergency_contacts',
      legalCase: 'legal_case',
      supportServices: 'support_services',
      statusHistory: 'status_history',
      notes: 'notes',
      followUpActions: 'follow_up_actions',
      tags: 'tags'
    };

    const jsonFields = [
      'incident', 'perpetrator', 'victim', 'safetyAssessment', 'evidenceFiles',
      'emergencyContacts', 'legalCase', 'supportServices', 'statusHistory',
      'notes', 'followUpActions', 'tags'
    ];

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (dbField) {
        fields.push(`${dbField} = ?`);
        values.push(jsonFields.includes(key) ? toJSON(value) : value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(now());
    values.push(id);

    await db.prepare(
      `UPDATE issues SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return this.findById(id);
  },

  /**
   * Add note to issue
   */
  async addNote(id, note) {
    const issue = await this.findById(id);
    if (!issue) return null;

    const notes = issue.notes || [];
    notes.push({
      ...note,
      createdAt: now()
    });

    return this.update(id, { notes });
  },

  /**
   * Update status with history
   */
  async updateStatus(id, newStatus, userId, notes = '') {
    const issue = await this.findById(id);
    if (!issue) return null;

    const statusHistory = issue.statusHistory || [];
    statusHistory.push({
      status: newStatus,
      changedBy: userId,
      changedAt: now(),
      notes
    });

    return this.update(id, { status: newStatus, statusHistory });
  },

  /**
   * Search issues
   */
  async search(query, options = {}) {
    const db = getDB();
    const { userId, limit = 20, offset = 0 } = options;
    
    let sql = `
      SELECT * FROM issues 
      WHERE is_deleted = 0 
      AND (title LIKE ? OR description LIKE ?)
    `;
    const params = [`%${query}%`, `%${query}%`];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(sql).bind(...params).all();
    return results.map(transformIssue);
  },

  /**
   * Get statistics
   */
  async getStats(userId = null) {
    const db = getDB();
    let query = 'SELECT status, COUNT(*) as count FROM issues WHERE is_deleted = 0';
    const params = [];

    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY status';

    const { results } = await db.prepare(query).bind(...params).all();
    
    const stats = {
      total: 0,
      byStatus: {},
      nuevo: 0,
      enProceso: 0,
      resuelto: 0,
      cerrado: 0
    };

    for (const row of results) {
      stats.byStatus[row.status] = row.count;
      stats.total += row.count;
      
      if (row.status === 'NUEVO') stats.nuevo = row.count;
      if (row.status === 'EN_PROCESO') stats.enProceso = row.count;
      if (row.status === 'RESUELTO') stats.resuelto = row.count;
      if (row.status === 'CERRADO') stats.cerrado = row.count;
    }

    return stats;
  },

  /**
   * Soft delete
   */
  async softDelete(id) {
    const db = getDB();
    await db.prepare(
      'UPDATE issues SET is_deleted = 1, deleted_at = ?, updated_at = ? WHERE id = ?'
    ).bind(now(), now(), id).run();
    return true;
  }
};

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
    incident: parseJSON(row.incident, {}),
    perpetrator: parseJSON(row.perpetrator, {}),
    victim: parseJSON(row.victim, {}),
    safetyAssessment: parseJSON(row.safety_assessment, {}),
    evidenceFiles: parseJSON(row.evidence_files, []),
    emergencyContacts: parseJSON(row.emergency_contacts, []),
    legalCase: parseJSON(row.legal_case, {}),
    supportServices: parseJSON(row.support_services, {}),
    statusHistory: parseJSON(row.status_history, []),
    notes: parseJSON(row.notes, []),
    followUpActions: parseJSON(row.follow_up_actions, []),
    tags: parseJSON(row.tags, []),
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// ============================================
// CHAT OPERATIONS
// ============================================

export const ChatDB = {
  /**
   * Find chat by ID
   */
  async findById(id) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM chats WHERE id = ? AND is_deleted = 0'
    ).bind(id).first();
    return result ? transformChat(result) : null;
  },

  /**
   * Find chat by session ID
   */
  async findBySessionId(sessionId) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM chats WHERE session_id = ? AND is_deleted = 0'
    ).bind(sessionId).first();
    return result ? transformChat(result) : null;
  },

  /**
   * Find chats by user
   */
  async findByUser(userId, options = {}) {
    const db = getDB();
    const { limit = 50, offset = 0, status } = options;
    
    let query = 'SELECT * FROM chats WHERE user_id = ? AND is_deleted = 0';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY last_message_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(query).bind(...params).all();
    return results.map(transformChat);
  },

  /**
   * Create new chat session
   */
  async create(chatData) {
    const db = getDB();
    const id = generateId();
    const timestamp = now();

    await db.prepare(`
      INSERT INTO chats (
        id, user_id, session_id, title, messages, context, crisis_detection,
        status, language, device_info, analytics, related_issue_id,
        started_at, last_message_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      chatData.user || chatData.userId,
      chatData.sessionId,
      chatData.title || null,
      toJSON(chatData.messages || []),
      toJSON(chatData.context || { legalScenario: 'GENERAL', emotionalState: 'UNKNOWN', riskLevel: 'LOW' }),
      toJSON(chatData.crisisDetection || { detected: false, interventionTriggered: false }),
      chatData.status || 'ACTIVE',
      chatData.language || 'es',
      toJSON(chatData.deviceInfo || {}),
      toJSON(chatData.analytics || { totalMessages: 0, userMessages: 0, assistantMessages: 0 }),
      chatData.relatedIssue || null,
      timestamp,
      timestamp,
      timestamp,
      timestamp
    ).run();

    return this.findById(id);
  },

  /**
   * Add message to chat
   */
  async addMessage(id, role, content, metadata = {}) {
    const chat = await this.findById(id);
    if (!chat) return null;

    const messages = chat.messages || [];
    messages.push({
      role,
      content,
      timestamp: now(),
      sentiment: metadata.sentiment || 'NEUTRAL',
      metadata: {
        tokens: metadata.tokens,
        processingTime: metadata.processingTime,
        confidence: metadata.confidence,
        detectedIntent: metadata.detectedIntent,
        suggestedActions: metadata.suggestedActions || []
      }
    });

    const analytics = chat.analytics || {};
    analytics.totalMessages = messages.length;
    if (role === 'user') analytics.userMessages = (analytics.userMessages || 0) + 1;
    if (role === 'assistant') analytics.assistantMessages = (analytics.assistantMessages || 0) + 1;

    // Auto-generate title from first user message
    let title = chat.title;
    if (!title && role === 'user' && messages.length <= 2) {
      title = content.substring(0, 100) + (content.length > 100 ? '...' : '');
    }

    const db = getDB();
    await db.prepare(`
      UPDATE chats SET 
        messages = ?, analytics = ?, title = ?, last_message_at = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      toJSON(messages),
      toJSON(analytics),
      title,
      now(),
      now(),
      id
    ).run();

    return this.findById(id);
  },

  /**
   * Update chat
   */
  async update(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    const fieldMap = {
      title: 'title',
      messages: 'messages',
      context: 'context',
      crisisDetection: 'crisis_detection',
      status: 'status',
      feedback: 'feedback',
      overallSatisfaction: 'overall_satisfaction',
      language: 'language',
      deviceInfo: 'device_info',
      analytics: 'analytics',
      relatedIssue: 'related_issue_id',
      endedAt: 'ended_at'
    };

    const jsonFields = ['messages', 'context', 'crisisDetection', 'feedback', 'deviceInfo', 'analytics'];

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (dbField) {
        fields.push(`${dbField} = ?`);
        values.push(jsonFields.includes(key) ? toJSON(value) : value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(now());
    values.push(id);

    await db.prepare(
      `UPDATE chats SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return this.findById(id);
  },

  /**
   * End chat session
   */
  async endSession(id) {
    const chat = await this.findById(id);
    if (!chat) return null;

    const endedAt = now();
    const sessionDuration = Math.floor(
      (new Date(endedAt) - new Date(chat.startedAt)) / 1000
    );

    const analytics = chat.analytics || {};
    analytics.sessionDuration = sessionDuration;

    return this.update(id, {
      status: 'ENDED',
      endedAt,
      analytics
    });
  },

  /**
   * Get analytics
   */
  async getAnalytics(userId = null, dateRange = {}) {
    const db = getDB();
    let query = 'SELECT COUNT(*) as total, status FROM chats WHERE is_deleted = 0';
    const params = [];

    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY status';

    const { results } = await db.prepare(query).bind(...params).all();
    
    return {
      totalSessions: results.reduce((sum, r) => sum + r.total, 0),
      byStatus: Object.fromEntries(results.map(r => [r.status, r.total]))
    };
  }
};

function transformChat(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    userId: row.user_id,
    sessionId: row.session_id,
    title: row.title,
    messages: parseJSON(row.messages, []),
    context: parseJSON(row.context, {}),
    crisisDetection: parseJSON(row.crisis_detection, {}),
    status: row.status,
    feedback: parseJSON(row.feedback, null),
    overallSatisfaction: row.overall_satisfaction,
    language: row.language,
    deviceInfo: parseJSON(row.device_info, {}),
    analytics: parseJSON(row.analytics, {}),
    relatedIssue: row.related_issue_id,
    startedAt: row.started_at,
    lastMessageAt: row.last_message_at,
    endedAt: row.ended_at,
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export const NotificationDB = {
  async findById(id) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM notifications WHERE id = ? AND is_deleted = 0'
    ).bind(id).first();
    return result ? transformNotification(result) : null;
  },

  async create(data) {
    const db = getDB();
    const id = generateId();
    const timestamp = now();

    await db.prepare(`
      INSERT INTO notifications (
        id, type, category, priority, recipient, sender, message,
        related_issue_id, related_user_id, status, delivery, provider,
        metadata, scheduled_for, batch_id, batch_size, batch_index,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.type,
      data.category,
      data.priority || 'MEDIUM',
      toJSON(data.recipient),
      toJSON(data.sender || {}),
      toJSON(data.message),
      data.relatedIssue || null,
      data.relatedUser || null,
      data.status || 'PENDING',
      toJSON(data.delivery || { attempts: 0, maxAttempts: 3 }),
      toJSON(data.provider || {}),
      toJSON(data.metadata || {}),
      data.scheduledFor || null,
      data.batchId || null,
      data.batchSize || null,
      data.batchIndex || null,
      timestamp,
      timestamp
    ).run();

    return this.findById(id);
  },

  async update(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    const fieldMap = {
      status: 'status',
      delivery: 'delivery',
      provider: 'provider',
      error: 'error',
      userActions: 'user_actions'
    };

    const jsonFields = ['delivery', 'provider', 'error', 'userActions'];

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (dbField) {
        fields.push(`${dbField} = ?`);
        values.push(jsonFields.includes(key) ? toJSON(value) : value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(now());
    values.push(id);

    await db.prepare(
      `UPDATE notifications SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return this.findById(id);
  },

  async markAsSent(id, providerResponse = {}) {
    const notification = await this.findById(id);
    if (!notification) return null;

    const delivery = notification.delivery || {};
    delivery.sentAt = now();

    const provider = notification.provider || {};
    if (providerResponse.messageId) provider.messageId = providerResponse.messageId;
    if (providerResponse.cost) provider.cost = providerResponse.cost;

    return this.update(id, {
      status: 'SENT',
      delivery,
      provider
    });
  },

  async markAsFailed(id, errorData) {
    const notification = await this.findById(id);
    if (!notification) return null;

    const delivery = notification.delivery || {};
    delivery.failedAt = now();
    delivery.attempts = (delivery.attempts || 0) + 1;

    return this.update(id, {
      status: 'FAILED',
      delivery,
      error: {
        ...errorData,
        occurredAt: now()
      }
    });
  },

  async findByUser(userId, options = {}) {
    const db = getDB();
    const { limit = 50, offset = 0, type } = options;
    
    let query = 'SELECT * FROM notifications WHERE related_user_id = ? AND is_deleted = 0';
    const params = [userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(query).bind(...params).all();
    return results.map(transformNotification);
  }
};

function transformNotification(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    type: row.type,
    category: row.category,
    priority: row.priority,
    recipient: parseJSON(row.recipient, {}),
    sender: parseJSON(row.sender, {}),
    message: parseJSON(row.message, {}),
    relatedIssue: row.related_issue_id,
    relatedUser: row.related_user_id,
    status: row.status,
    delivery: parseJSON(row.delivery, {}),
    provider: parseJSON(row.provider, {}),
    error: parseJSON(row.error, null),
    metadata: parseJSON(row.metadata, {}),
    scheduledFor: row.scheduled_for,
    expiresAt: row.expires_at,
    batchId: row.batch_id,
    batchSize: row.batch_size,
    batchIndex: row.batch_index,
    userActions: parseJSON(row.user_actions, {}),
    isDeleted: !!row.is_deleted,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// ============================================
// GOVERNMENT REPORT OPERATIONS
// ============================================

export const GovernmentReportDB = {
  async findById(id) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM government_reports WHERE id = ? AND is_deleted = 0'
    ).bind(id).first();
    return result ? transformGovernmentReport(result) : null;
  },

  async findByReportNumber(reportNumber) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM government_reports WHERE report_number = ? AND is_deleted = 0'
    ).bind(reportNumber).first();
    return result ? transformGovernmentReport(result) : null;
  },

  async create(data) {
    const db = getDB();
    const id = generateId();
    const timestamp = now();
    const reportNumber = data.reportNumber || `REP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await db.prepare(`
      INSERT INTO government_reports (
        id, report_number, report_type, target_entity, issue_id, user_id,
        status, report_data, submission, government_response, follow_up,
        exports, audit_log, is_confidential, priority, tags, notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      reportNumber,
      data.reportType,
      data.targetEntity,
      data.issue || data.issueId,
      data.user || data.userId,
      data.status || 'BORRADOR',
      toJSON(data.reportData || {}),
      toJSON(data.submission || {}),
      toJSON(data.governmentResponse || {}),
      toJSON(data.followUp || {}),
      toJSON(data.exports || []),
      toJSON([{ action: 'CREATED', performedBy: data.user || data.userId, performedAt: timestamp }]),
      data.isConfidential !== false ? 1 : 0,
      data.priority || 'MEDIO',
      toJSON(data.tags || []),
      toJSON(data.notes || []),
      timestamp,
      timestamp
    ).run();

    return this.findById(id);
  },

  async update(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    const fieldMap = {
      status: 'status',
      reportData: 'report_data',
      submission: 'submission',
      governmentResponse: 'government_response',
      followUp: 'follow_up',
      exports: 'exports',
      auditLog: 'audit_log',
      priority: 'priority',
      tags: 'tags',
      notes: 'notes'
    };

    const jsonFields = ['reportData', 'submission', 'governmentResponse', 'followUp', 'exports', 'auditLog', 'tags', 'notes'];

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (dbField) {
        fields.push(`${dbField} = ?`);
        values.push(jsonFields.includes(key) ? toJSON(value) : value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(now());
    values.push(id);

    await db.prepare(
      `UPDATE government_reports SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return this.findById(id);
  },

  async findByUser(userId, options = {}) {
    const db = getDB();
    const { limit = 50, offset = 0, status } = options;
    
    let query = 'SELECT * FROM government_reports WHERE user_id = ? AND is_deleted = 0';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(query).bind(...params).all();
    return results.map(transformGovernmentReport);
  },

  async getStats(userId = null) {
    const db = getDB();
    let query = 'SELECT status, COUNT(*) as count FROM government_reports WHERE is_deleted = 0';
    const params = [];

    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY status';

    const { results } = await db.prepare(query).bind(...params).all();
    
    return {
      total: results.reduce((sum, r) => sum + r.count, 0),
      byStatus: Object.fromEntries(results.map(r => [r.status, r.count]))
    };
  }
};

function transformGovernmentReport(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    reportNumber: row.report_number,
    reportType: row.report_type,
    targetEntity: row.target_entity,
    issue: row.issue_id,
    issueId: row.issue_id,
    user: row.user_id,
    userId: row.user_id,
    status: row.status,
    reportData: parseJSON(row.report_data, {}),
    submission: parseJSON(row.submission, {}),
    governmentResponse: parseJSON(row.government_response, {}),
    followUp: parseJSON(row.follow_up, {}),
    exports: parseJSON(row.exports, []),
    auditLog: parseJSON(row.audit_log, []),
    isConfidential: !!row.is_confidential,
    encryptionStatus: row.encryption_status,
    priority: row.priority,
    tags: parseJSON(row.tags, []),
    notes: parseJSON(row.notes, []),
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// ============================================
// VOICE RECORDING OPERATIONS
// ============================================

export const VoiceRecordingDB = {
  async findById(id) {
    const db = getDB();
    const result = await db.prepare(
      'SELECT * FROM voice_recordings WHERE id = ? AND is_deleted = 0'
    ).bind(id).first();
    return result ? transformVoiceRecording(result) : null;
  },

  async create(data) {
    const db = getDB();
    const id = generateId();
    const timestamp = now();

    await db.prepare(`
      INSERT INTO voice_recordings (
        id, user_id, issue_id, filename, duration, file_size, mime_type,
        storage_url, storage_provider, recorded_at, location,
        transcription, emotion_analysis, analysis_status, is_emergency,
        emergency_keywords, tags, notes, auto_delete_after_days,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.user || data.userId,
      data.issue || data.issueId || null,
      data.filename,
      data.duration,
      data.fileSize,
      data.mimeType || 'audio/webm',
      data.storageUrl,
      data.storageProvider || 'LOCAL',
      data.recordedAt || timestamp,
      toJSON(data.location || {}),
      toJSON(data.transcription || {}),
      toJSON(data.emotionAnalysis || {}),
      data.analysisStatus || 'PENDING',
      data.isEmergency ? 1 : 0,
      toJSON(data.emergencyKeywords || []),
      toJSON(data.tags || []),
      data.notes || null,
      data.autoDeleteAfterDays || 30,
      timestamp,
      timestamp
    ).run();

    return this.findById(id);
  },

  async update(id, updates) {
    const db = getDB();
    const fields = [];
    const values = [];

    const fieldMap = {
      issueId: 'issue_id',
      transcription: 'transcription',
      emotionAnalysis: 'emotion_analysis',
      analysisStatus: 'analysis_status',
      analysisError: 'analysis_error',
      isEmergency: 'is_emergency',
      emergencyKeywords: 'emergency_keywords',
      tags: 'tags',
      notes: 'notes'
    };

    const jsonFields = ['transcription', 'emotionAnalysis', 'emergencyKeywords', 'tags'];

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (dbField) {
        fields.push(`${dbField} = ?`);
        if (jsonFields.includes(key)) {
          values.push(toJSON(value));
        } else if (typeof value === 'boolean') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(now());
    values.push(id);

    await db.prepare(
      `UPDATE voice_recordings SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return this.findById(id);
  },

  async findByUser(userId, options = {}) {
    const db = getDB();
    const { limit = 50, offset = 0, isEmergency } = options;
    
    let query = 'SELECT * FROM voice_recordings WHERE user_id = ? AND is_deleted = 0';
    const params = [userId];

    if (isEmergency !== undefined) {
      query += ' AND is_emergency = ?';
      params.push(isEmergency ? 1 : 0);
    }

    query += ' ORDER BY recorded_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(query).bind(...params).all();
    return results.map(transformVoiceRecording);
  }
};

function transformVoiceRecording(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    userId: row.user_id,
    issue: row.issue_id,
    issueId: row.issue_id,
    filename: row.filename,
    duration: row.duration,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    storageUrl: row.storage_url,
    storageProvider: row.storage_provider,
    recordedAt: row.recorded_at,
    location: parseJSON(row.location, {}),
    transcription: parseJSON(row.transcription, {}),
    emotionAnalysis: parseJSON(row.emotion_analysis, {}),
    analysisStatus: row.analysis_status,
    analysisError: row.analysis_error,
    isEmergency: !!row.is_emergency,
    emergencyKeywords: parseJSON(row.emergency_keywords, []),
    isEncrypted: !!row.is_encrypted,
    expiresAt: row.expires_at,
    autoDeleteAfterDays: row.auto_delete_after_days,
    tags: parseJSON(row.tags, []),
    notes: row.notes,
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// ============================================
// EXPORTS
// ============================================

export default {
  getDB,
  generateId,
  now,
  parseJSON,
  toJSON,
  UserDB,
  IssueDB,
  ChatDB,
  NotificationDB,
  GovernmentReportDB,
  VoiceRecordingDB
};
