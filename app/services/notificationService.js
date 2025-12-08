/**
 * Notification Service
 * High-level orchestration for all notification types
 * Integrates with SMS, Email, and Push notification services
 */

import Notification from '../models/Notification';
import User from '../models/User';
import Issue from '../models/Issue';
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
        const notification = new Notification({
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
            sentAt: new Date(),
            deliveredAt: new Date()
          }
        });
        
        await notification.save();
        
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
    const user = await User.findById(userId).select('fullName phone emergencyContacts');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      throw new Error('No emergency contacts configured');
    }
    
    // Prepare location string
    let locationStr = location || 'Ubicación no disponible';
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      locationStr = `${locationStr} (${coordinates.latitude}, ${coordinates.longitude})`;
    }
    
    // Prepare situation string
    let situationStr = situation;
    if (additionalMessage) {
      situationStr += ` - ${additionalMessage}`;
    }
    
    // Send emergency SMS to all contacts
    const smsResults = await smsService.sendEmergencyAlert({
      userId,
      emergencyContacts: user.emergencyContacts,
      userName: user.fullName,
      location: locationStr,
      situation: situationStr,
      issueId,
      coordinates
    });
    
    // Update issue if provided
    if (issueId) {
      const issue = await Issue.findById(issueId);
      if (issue) {
        // Mark emergency contacts as notified
        issue.emergencyContacts.forEach(contact => {
          contact.hasBeenNotified = true;
          contact.notifiedAt = new Date();
        });
        
        // Add note to issue
        await issue.addNote(
          `Alerta de emergencia enviada a ${user.emergencyContacts.length} contactos`,
          userId,
          'SAFETY'
        );
        
        await issue.save();
      }
    }
    
    return {
      success: true,
      message: 'Emergency alert triggered successfully',
      contactsNotified: user.emergencyContacts.length,
      smsResults
    };
  } catch (error) {
    console.error('Error triggering emergency alert:', error);
    throw error;
  }
}

/**
 * Send issue status update notification
 * @param {Object} params - Update parameters
 * @returns {Promise<Object>} Notification result
 */
export async function notifyIssueStatusChange({
  issueId,
  newStatus,
  userId,
  notes = ''
}) {
  try {
    const issue = await Issue.findById(issueId).populate('user', 'fullName phone email');
    
    if (!issue) {
      throw new Error('Issue not found');
    }
    
    const user = issue.user;
    const message = `Tu caso #${issueId} ha cambiado a estado: ${newStatus}. ${notes}`;
    
    // Send SMS notification
    if (user.phone) {
      await smsService.sendIssueUpdateNotification({
        issueId,
        userId: user._id,
        recipientPhone: user.phone,
        recipientName: user.fullName,
        updateMessage: `Estado actualizado a ${newStatus}`,
        priority: 'MEDIUM'
      });
    }
    
    // Create in-app notification
    await sendNotification({
      type: 'IN_APP',
      category: 'STATUS_CHANGE',
      priority: 'MEDIUM',
      recipient: {
        userId: user._id,
        name: user.fullName,
        phone: user.phone,
        email: user.email
      },
      message: {
        subject: 'Actualización de caso',
        body: message
      },
      relatedIssue: issueId,
      relatedUser: userId
    });
    
    return {
      success: true,
      message: 'Status change notification sent'
    };
  } catch (error) {
    console.error('Error notifying issue status change:', error);
    throw error;
  }
}

/**
 * Send court date reminder
 * @param {Object} params - Reminder parameters
 * @returns {Promise<Object>} Notification result
 */
export async function sendCourtDateReminder({
  issueId,
  userId,
  courtDate,
  courtTime,
  courtLocation
}) {
  try {
    const user = await User.findById(userId).select('fullName phone email');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.phone) {
      throw new Error('User phone number not available');
    }
    
    // Format date
    const dateStr = new Date(courtDate).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Send SMS reminder
    await smsService.sendCourtReminder({
      userId,
      recipientPhone: user.phone,
      recipientName: user.fullName,
      date: dateStr,
      time: courtTime,
      location: courtLocation,
      issueId
    });
    
    return {
      success: true,
      message: 'Court reminder sent'
    };
  } catch (error) {
    console.error('Error sending court reminder:', error);
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
  issueId = null
}) {
  try {
    const user = await User.findById(userId).select('fullName phone email');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.phone) {
      throw new Error('User phone number not available');
    }
    
    // Send SMS safety check
    await smsService.sendSafetyCheck({
      userId,
      recipientPhone: user.phone,
      recipientName: user.fullName,
      issueId
    });
    
    return {
      success: true,
      message: 'Safety check sent'
    };
  } catch (error) {
    console.error('Error sending safety check:', error);
    throw error;
  }
}

/**
 * Notify high-risk issue detected
 * Automatically sends alerts when issue risk level is high
 * @param {string} issueId - Issue ID
 * @returns {Promise<Object>} Notification result
 */
export async function notifyHighRiskIssue(issueId) {
  try {
    const issue = await Issue.findById(issueId).populate('user', 'fullName phone email emergencyContacts');
    
    if (!issue) {
      throw new Error('Issue not found');
    }
    
    const user = issue.user;
    const riskLevel = issue.safetyAssessment?.riskLevel;
    
    // Only notify for HIGH or EXTREMO risk levels
    if (!['ALTO', 'EXTREMO'].includes(riskLevel)) {
      return {
        success: false,
        message: 'Risk level does not require notification'
      };
    }
    
    // Notify user
    if (user.phone) {
      await smsService.sendSMS({
        to: user.phone,
        message: `⚠️ ALERTA: Tu caso #${issueId} ha sido clasificado como riesgo ${riskLevel}. Te recomendamos contactar a las autoridades y tus contactos de emergencia. DefiendeteMX`,
        recipientName: user.fullName,
        userId: user._id,
        issueId,
        category: 'SYSTEM_NOTIFICATION',
        priority: 'HIGH'
      });
    }
    
    // If EXTREMO risk, also notify emergency contacts
    if (riskLevel === 'EXTREMO' && user.emergencyContacts && user.emergencyContacts.length > 0) {
      await triggerEmergencyAlert({
        userId: user._id,
        issueId,
        situation: `Caso de riesgo extremo detectado`,
        additionalMessage: 'Por favor contacta inmediatamente'
      });
    }
    
    return {
      success: true,
      message: 'High risk notification sent',
      riskLevel
    };
  } catch (error) {
    console.error('Error notifying high risk issue:', error);
    throw error;
  }
}

/**
 * Get notification history for user
 * @param {string} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Notifications
 */
export async function getNotificationHistory(userId, filters = {}) {
  try {
    const notifications = await Notification.findByUser(userId, {
      type: filters.type,
      category: filters.category,
      status: filters.status,
      limit: filters.limit || 50,
      skip: filters.skip || 0
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting notification history:', error);
    throw error;
  }
}

/**
 * Get notification by ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Notification
 */
export async function getNotificationById(notificationId) {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      isDeleted: false
    })
    .populate('recipient.userId', 'fullName email')
    .populate('sender.userId', 'fullName')
    .populate('relatedIssue', 'title status')
    .populate('relatedUser', 'fullName');
    
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
 * Get notification statistics
 * @param {string} userId - User ID (optional)
 * @param {Object} dateRange - Date range filter
 * @returns {Promise<Object>} Statistics
 */
export async function getNotificationStats(userId = null, dateRange = {}) {
  try {
    const stats = await Notification.getStats(userId, dateRange);
    return stats[0] || {
      total: 0,
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
      totalCost: 0,
      avgDeliveryTime: 0
    };
  } catch (error) {
    console.error('Error getting notification stats:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    await notification.markAsRead();
    
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Retry failed notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Retry result
 */
export async function retryFailedNotification(notificationId) {
  try {
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    if (!notification.canRetry) {
      throw new Error('Cannot retry this notification');
    }
    
    // Reset status to pending
    await notification.retry();
    
    // Resend based on type
    if (notification.type === 'SMS') {
      const result = await smsService.sendSMS({
        to: notification.recipient.phone,
        message: notification.message.body,
        recipientName: notification.recipient.name,
        userId: notification.recipient.userId,
        issueId: notification.relatedIssue,
        category: notification.category,
        priority: notification.priority,
        metadata: notification.metadata
      });
      
      return result;
    }
    
    throw new Error(`Retry not implemented for type: ${notification.type}`);
  } catch (error) {
    console.error('Error retrying notification:', error);
    throw error;
  }
}

/**
 * Process pending notifications
 * Background job to send queued notifications
 * @returns {Promise<Object>} Processing results
 */
export async function processPendingNotifications() {
  try {
    const pendingNotifications = await Notification.findPending();
    
    const results = {
      total: pendingNotifications.length,
      processed: 0,
      failed: 0
    };
    
    for (const notification of pendingNotifications) {
      try {
        if (notification.type === 'SMS') {
          await smsService.sendSMS({
            to: notification.recipient.phone,
            message: notification.message.body,
            recipientName: notification.recipient.name,
            userId: notification.recipient.userId,
            issueId: notification.relatedIssue,
            category: notification.category,
            priority: notification.priority,
            metadata: notification.metadata
          });
          
          results.processed++;
        }
      } catch (error) {
        console.error(`Error processing notification ${notification._id}:`, error);
        results.failed++;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error processing pending notifications:', error);
    throw error;
  }
}

/**
 * Process retry queue
 * Background job to retry failed notifications
 * @returns {Promise<Object>} Processing results
 */
export async function processRetryQueue() {
  try {
    const retryNotifications = await Notification.findReadyForRetry();
    
    const results = {
      total: retryNotifications.length,
      retried: 0,
      failed: 0
    };
    
    for (const notification of retryNotifications) {
      try {
        await retryFailedNotification(notification._id.toString());
        results.retried++;
      } catch (error) {
        console.error(`Error retrying notification ${notification._id}:`, error);
        results.failed++;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error processing retry queue:', error);
    throw error;
  }
}

export default {
  sendNotification,
  triggerEmergencyAlert,
  notifyIssueStatusChange,
  sendCourtDateReminder,
  sendSafetyCheckNotification,
  notifyHighRiskIssue,
  getNotificationHistory,
  getNotificationById,
  getNotificationStats,
  markNotificationAsRead,
  retryFailedNotification,
  processPendingNotifications,
  processRetryQueue
};
