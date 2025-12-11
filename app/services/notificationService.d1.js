/**
 * Notification Service for D1
 * High-level orchestration for all notification types
 * Integrates with SMS, Email, and Push notification services
 */

import { NotificationDB, UserDB, IssueDB, getDB } from '../lib/db';
import smsService from './smsService';

/**
 * Send notification based on type
 * @param {Object} params - Notification parameters
 * @returns {Promise<Object>} Notification result
 */
export async function sendNotification({
  type = 'SMS',
  category,
  priority = 'MEDIUM',
  recipient,
  message,
  relatedIssue = null,
  relatedUser = null,
  metadata = {}
}) {
  try {
    switch (type) {
      case 'SMS':
        return await smsService.sendSMS({
          to: recipient.phone,
          message: message.body,
          recipientName: recipient.name,
          userId: recipient.userId,
          issueId: relatedIssue,
          category,
          priority,
          metadata
        });
        
      case 'EMAIL':
        // TODO: Implement email service
        throw new Error('Email notifications not yet implemented');
        
      case 'PUSH':
        // TODO: Implement push notification service
        throw new Error('Push notifications not yet implemented');
        
      case 'IN_APP':
        // Create in-app notification
        const notification = await NotificationDB.create({
          type: 'IN_APP',
          category,
          priority,
          recipient,
          message,
          relatedIssue,
          relatedUser,
          status: 'DELIVERED',
          metadata,
          delivery: {
            sentAt: new Date().toISOString(),
            deliveredAt: new Date().toISOString()
          }
        });
        
        return {
          success: true,
          notification
        };
        
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

/**
 * Trigger emergency alert
 * Sends SMS to all emergency contacts and creates notifications
 * @param {Object} params - Emergency parameters
 * @returns {Promise<Object>} Alert results
 */
export async function triggerEmergencyAlert({
  userId,
  issueId = null,
  location = null,
  situation = 'Emergencia',
  coordinates = null,
  additionalMessage = ''
}) {
  try {
    // Get user with emergency contacts
    const user = await UserDB.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const results = {
      totalContacts: 0,
      successfulSends: 0,
      failedSends: 0,
      notifications: [],
      errors: []
    };

    // Prepare emergency message
    const locationText = location || 'ubicación desconocida';
    const coords = coordinates ? 
      `\nCoordenadas: ${coordinates.lat}, ${coordinates.lng}` : '';
    
    const emergencyMessage = `🚨 ALERTA DE EMERGENCIA 🚨\n\n${user.fullName} necesita ayuda urgente!\n\nSituación: ${situation}\nUbicación: ${locationText}${coords}\n\n${additionalMessage}\n\nPor favor, contacta inmediatamente o llama al 911.`;

    // Send to user's own phone first (if available)
    if (user.phone) {
      try {
        const selfNotification = await smsService.sendSMS({
          to: user.phone,
          message: emergencyMessage,
          recipientName: user.fullName,
          userId,
          issueId,
          category: 'EMERGENCY_ALERT',
          priority: 'CRITICAL',
          isEmergency: true,
          metadata: {
            location,
            coordinates,
            situation
          }
        });
        
        if (selfNotification.success) {
          results.successfulSends++;
        } else {
          results.failedSends++;
        }
        
        results.notifications.push(selfNotification.notification);
      } catch (error) {
        console.error('Error sending SMS to self:', error);
        results.failedSends++;
        results.errors.push(`Self: ${error.message}`);
      }
    }

    // Send to all emergency contacts
    if (user.emergencyContacts && user.emergencyContacts.length > 0) {
      results.totalContacts = user.emergencyContacts.length;

      for (const contact of user.emergencyContacts) {
        if (!contact.phone) continue;

        try {
          const contactMessage = `🚨 ALERTA DE EMERGENCIA 🚨\n\n${contact.name}, eres contacto de emergencia de ${user.fullName}.\n\n${user.fullName} necesita ayuda urgente!\n\nSituación: ${situation}\nUbicación: ${locationText}${coords}\n\n${additionalMessage}\n\nPor favor, contacta inmediatamente o llama al 911.`;

          const notification = await smsService.sendSMS({
            to: contact.phone,
            message: contactMessage,
            recipientName: contact.name,
            userId,
            issueId,
            category: 'EMERGENCY_ALERT',
            priority: 'CRITICAL',
            isEmergency: true,
            metadata: {
              relationship: contact.relationship || 'Contacto de emergencia',
              location,
              coordinates,
              situation,
              isEmergencyContact: true
            }
          });

          if (notification.success) {
            results.successfulSends++;
          } else {
            results.failedSends++;
          }

          results.notifications.push(notification.notification);
        } catch (error) {
          console.error(`Error sending SMS to ${contact.name}:`, error);
          results.failedSends++;
          results.errors.push(`${contact.name}: ${error.message}`);
        }
      }
    }

    return {
      success: results.successfulSends > 0,
      results,
      message: `Alerta enviada a ${results.successfulSends} de ${results.totalContacts + 1} contactos`
    };
  } catch (error) {
    console.error('Error triggering emergency alert:', error);
    throw error;
  }
}

/**
 * Send case update notification
 * @param {Object} params - Update parameters
 * @returns {Promise<Object>} Notification result
 */
export async function sendCaseUpdateNotification({
  issueId,
  updateType = 'STATUS_CHANGE',
  oldValue,
  newValue,
  notes = ''
}) {
  try {
    // Get issue with user info
    const issue = await IssueDB.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    const user = await UserDB.findById(issue.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Prepare message based on update type
    let message = '';
    switch (updateType) {
      case 'STATUS_CHANGE':
        message = `Tu caso "${issue.title}" ha cambiado de estado:\n\nAnterior: ${oldValue}\nNuevo: ${newValue}${notes ? `\n\nNotas: ${notes}` : ''}`;
        break;
      case 'NEW_NOTE':
        message = `Se ha agregado una nota a tu caso "${issue.title}":\n\n${notes}`;
        break;
      case 'EVIDENCE_ADDED':
        message = `Se ha agregado nueva evidencia a tu caso "${issue.title}"`;
        break;
      default:
        message = `Tu caso "${issue.title}" ha sido actualizado`;
    }

    // Send notification based on user preferences
    const notificationTypes = [];
    
    if (user.phone && user.privacySettings?.allowNotifications !== false) {
      notificationTypes.push('SMS');
    }
    
    // Always create in-app notification
    notificationTypes.push('IN_APP');

    const results = [];
    for (const type of notificationTypes) {
      try {
        const notification = await sendNotification({
          type,
          category: 'ISSUE_UPDATE',
          priority: updateType === 'STATUS_CHANGE' ? 'HIGH' : 'MEDIUM',
          recipient: {
            userId: user.id,
            name: user.fullName,
            phone: user.phone
          },
          message: {
            subject: 'Actualización de caso',
            body: message
          },
          relatedIssue: issueId,
          relatedUser: user.id,
          metadata: {
            updateType,
            oldValue,
            newValue
          }
        });
        
        results.push(notification);
      } catch (error) {
        console.error(`Error sending ${type} notification:`, error);
      }
    }

    return {
      success: results.length > 0,
      notifications: results
    };
  } catch (error) {
    console.error('Error sending case update notification:', error);
    throw error;
  }
}

/**
 * Send safety check notification
 * @param {Object} params - Safety check parameters
 * @returns {Promise<Object>} Notification result
 */
export async function sendSafetyCheckNotification({
  userId,
  issueId = null,
  checkType = 'ROUTINE'
}) {
  try {
    const user = await UserDB.findById(userId);
    
    if (!user || !user.phone) {
      throw new Error('User or phone not found');
    }

    const message = checkType === 'ROUTINE' ?
      `Hola ${user.fullName}, ¿cómo te encuentras? Este es un chequeo de seguridad de rutina. Responde "BIEN" si todo está en orden o "AYUDA" si necesitas asistencia.` :
      `${user.fullName}, no hemos sabido de ti. ¿Está todo bien? Responde "BIEN" o "AYUDA" según tu situación actual.`;

    return await smsService.sendSMS({
      to: user.phone,
      message,
      recipientName: user.fullName,
      userId,
      issueId,
      category: 'SAFETY_CHECK',
      priority: 'MEDIUM',
      metadata: {
        checkType,
        requiresResponse: true
      }
    });
  } catch (error) {
    console.error('Error sending safety check:', error);
    throw error;
  }
}

/**
 * Get notification by ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Notification object
 */
export async function getNotificationById(notificationId) {
  try {
    const notification = await NotificationDB.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  } catch (error) {
    console.error('Error getting notification:', error);
    throw error;
  }
}

/**
 * Update notification status
 * @param {string} notificationId - Notification ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional update data
 * @returns {Promise<Object>} Updated notification
 */
export async function updateNotificationStatus(notificationId, status, additionalData = {}) {
  try {
    const notification = await NotificationDB.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    const updates = { status, ...additionalData };
    
    // Update specific fields based on status
    switch (status) {
      case 'SENT':
        updates.delivery = {
          ...notification.delivery,
          sentAt: new Date().toISOString()
        };
        break;
      case 'DELIVERED':
        updates.delivery = {
          ...notification.delivery,
          deliveredAt: new Date().toISOString()
        };
        break;
      case 'FAILED':
        updates.delivery = {
          ...notification.delivery,
          failedAt: new Date().toISOString(),
          attempts: (notification.delivery?.attempts || 0) + 1
        };
        break;
    }

    return await NotificationDB.update(notificationId, updates);
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
}

/**
 * Get user notifications
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of notifications
 */
export async function getUserNotifications(userId, options = {}) {
  try {
    const notifications = await NotificationDB.findByUser(userId, {
      type: options.type,
      limit: options.limit || 50,
      offset: options.offset || 0
    });

    // Mark as read if requested
    if (options.markAsRead) {
      for (const notification of notifications) {
        if (!notification.userActions?.opened) {
          await NotificationDB.update(notification.id, {
            userActions: {
              ...notification.userActions,
              opened: true,
              openedAt: new Date().toISOString()
            }
          });
        }
      }
    }

    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID (for verification)
 * @returns {Promise<Object>} Updated notification
 */
export async function markNotificationAsRead(notificationId, userId) {
  try {
    const notification = await NotificationDB.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    // Verify user owns this notification
    if (notification.recipient?.userId !== userId && notification.relatedUser !== userId) {
      throw new Error('Unauthorized to mark this notification');
    }

    return await NotificationDB.update(notificationId, {
      userActions: {
        ...notification.userActions,
        opened: true,
        openedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Process SMS response (webhook handler)
 * @param {Object} webhookData - Webhook data from SMS provider
 * @returns {Promise<Object>} Processing result
 */
export async function processSMSResponse(webhookData) {
  try {
    const { messageId, status, error } = webhookData;

    const notification = await NotificationDB.findOne({
      'provider.messageId': messageId
    });

    if (!notification) {
      console.warn('No notification found for messageId:', messageId);
      return { success: false, message: 'Notification not found' };
    }

    let updateData = {};
    
    switch (status) {
      case 'delivered':
        updateData = {
          status: 'DELIVERED',
          delivery: {
            ...notification.delivery,
            deliveredAt: new Date().toISOString()
          }
        };
        break;
        
      case 'failed':
      case 'undelivered':
        updateData = {
          status: 'FAILED',
          error: {
            message: error?.message || 'Delivery failed',
            code: error?.code,
            occurredAt: new Date().toISOString()
          }
        };
        break;
        
      case 'sent':
        updateData = {
          status: 'SENT'
        };
        break;
    }

    await NotificationDB.update(notification.id, updateData);

    return {
      success: true,
      message: 'Notification status updated',
      notification
    };
  } catch (error) {
    console.error('Error processing SMS response:', error);
    throw error;
  }
}

/**
 * Batch send notifications
 * @param {Array} notifications - Array of notification configs
 * @param {Object} options - Batch options
 * @returns {Promise<Object>} Batch results
 */
export async function batchSendNotifications(notifications, options = {}) {
  const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const results = {
    batchId,
    total: notifications.length,
    successful: 0,
    failed: 0,
    notifications: []
  };

  for (let i = 0; i < notifications.length; i++) {
    try {
      const notification = await sendNotification({
        ...notifications[i],
        metadata: {
          ...notifications[i].metadata,
          batchId,
          batchSize: notifications.length,
          batchIndex: i
        }
      });

      results.successful++;
      results.notifications.push(notification);

      // Rate limiting
      if (options.rateLimit && i < notifications.length - 1) {
        await new Promise(resolve => setTimeout(resolve, options.rateLimit));
      }
    } catch (error) {
      console.error(`Batch notification ${i} failed:`, error);
      results.failed++;
      results.notifications.push({
        success: false,
        error: error.message,
        index: i
      });
    }
  }

  return results;
}

/**
 * Get notification history (alias for getUserNotifications)
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of notifications
 */
export async function getNotificationHistory(userId, options = {}) {
  return getUserNotifications(userId, {
    ...options,
    offset: options.skip || options.offset || 0
  });
}

/**
 * Get notification statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics object
 */
export async function getNotificationStats(userId) {
  try {
    const db = getDB();
    const results = await db.prepare(`
      SELECT 
        type,
        status,
        category,
        COUNT(*) as count
      FROM notifications 
      WHERE related_user_id = ? AND is_deleted = 0
      GROUP BY type, status, category
    `).bind(userId).all();

    const stats = {
      total: 0,
      byType: {},
      byStatus: {},
      byCategory: {},
      recentActivity: {
        last24h: 0,
        last7d: 0,
        last30d: 0
      }
    };

    // Process grouped results
    for (const row of results.results) {
      stats.total += row.count;
      
      if (!stats.byType[row.type]) stats.byType[row.type] = 0;
      stats.byType[row.type] += row.count;
      
      if (!stats.byStatus[row.status]) stats.byStatus[row.status] = 0;
      stats.byStatus[row.status] += row.count;
      
      if (!stats.byCategory[row.category]) stats.byCategory[row.category] = 0;
      stats.byCategory[row.category] += row.count;
    }

    // Get recent activity counts
    const now = new Date().toISOString();
    const day = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const month = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const recentResult = await db.prepare(`
      SELECT 
        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as last24h,
        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as last7d,
        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as last30d
      FROM notifications 
      WHERE related_user_id = ? AND is_deleted = 0
    `).bind(day, week, month, userId).first();

    if (recentResult) {
      stats.recentActivity.last24h = recentResult.last24h || 0;
      stats.recentActivity.last7d = recentResult.last7d || 0;
      stats.recentActivity.last30d = recentResult.last30d || 0;
    }

    return stats;
  } catch (error) {
    console.error('Error getting notification stats:', error);
    throw error;
  }
}

/**
 * Retry a failed notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Retry result
 */
export async function retryFailedNotification(notificationId) {
  try {
    const notification = await NotificationDB.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.status !== 'FAILED') {
      throw new Error('Can only retry failed notifications');
    }

    const maxAttempts = notification.delivery?.maxAttempts || 3;
    const attempts = notification.delivery?.attempts || 0;

    if (attempts >= maxAttempts) {
      throw new Error('Max retry attempts reached');
    }

    // Resend the notification
    const result = await sendNotification({
      type: notification.type,
      category: notification.category,
      priority: notification.priority,
      recipient: notification.recipient,
      message: notification.message,
      relatedIssue: notification.relatedIssue,
      relatedUser: notification.relatedUser,
      metadata: {
        ...notification.metadata,
        retryOf: notificationId,
        retryAttempt: attempts + 1
      }
    });

    // Update original notification
    await NotificationDB.update(notificationId, {
      delivery: {
        ...notification.delivery,
        lastRetryAt: new Date().toISOString(),
        retryNotificationId: result.notification.id
      }
    });

    return result;
  } catch (error) {
    console.error('Error retrying notification:', error);
    throw error;
  }
}

export default {
  sendNotification,
  triggerEmergencyAlert,
  sendCaseUpdateNotification,
  sendSafetyCheckNotification,
  getNotificationById,
  updateNotificationStatus,
  getUserNotifications,
  markNotificationAsRead,
  processSMSResponse,
  batchSendNotifications,
  getNotificationHistory,
  getNotificationStats,
  retryFailedNotification
};