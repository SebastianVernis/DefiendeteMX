/**
 * SMS Service
 * Handles SMS sending through Twilio and other providers
 * Supports emergency alerts, custom messages, and batch sending
 */

import Notification from '../models/Notification';

/**
 * SMS Provider Configuration
 */
const SMS_PROVIDERS = {
  TWILIO: 'TWILIO',
  CUSTOM: 'CUSTOM'
};

/**
 * Message Templates
 */
const MESSAGE_TEMPLATES = {
  EMERGENCY_ALERT: {
    es: '🚨 ALERTA DE EMERGENCIA - {userName} necesita ayuda urgente. Ubicación: {location}. Situación: {situation}. Por favor contacta inmediatamente. DefiendeteMX',
    en: '🚨 EMERGENCY ALERT - {userName} needs urgent help. Location: {location}. Situation: {situation}. Please contact immediately. DefiendeteMX'
  },
  ISSUE_UPDATE: {
    es: '📋 Actualización de caso #{issueId}: {message}. DefiendeteMX',
    en: '📋 Case update #{issueId}: {message}. DefiendeteMX'
  },
  COURT_REMINDER: {
    es: '⚖️ Recordatorio: Audiencia el {date} a las {time} en {location}. DefiendeteMX',
    en: '⚖️ Reminder: Court hearing on {date} at {time} at {location}. DefiendeteMX'
  },
  SAFETY_CHECK: {
    es: '✅ Verificación de seguridad: ¿Estás bien? Responde SI o NO. DefiendeteMX',
    en: '✅ Safety check: Are you okay? Reply YES or NO. DefiendeteMX'
  },
  CUSTOM: {
    es: '{message}',
    en: '{message}'
  }
};

/**
 * Initialize Twilio Client
 * @returns {Object|null} Twilio client or null if not configured
 */
function initializeTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured. SMS sending will be simulated.');
    return null;
  }
  
  try {
    // Dynamic import to avoid errors if twilio is not installed
    // Check if twilio module exists
    try {
      const twilio = require('twilio');
      return twilio(accountSid, authToken);
    } catch (requireError) {
      console.warn('Twilio module not installed. SMS sending will be simulated.');
      return null;
    }
  } catch (error) {
    console.error('Error initializing Twilio client:', error);
    return null;
  }
}

/**
 * Format phone number to E.164 format
 * @param {string} phone - Phone number (10 digits)
 * @param {string} countryCode - Country code (default: +52 for Mexico)
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone, countryCode = '+52') {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Validate 10-digit phone number
  if (cleanPhone.length !== 10) {
    throw new Error('Phone number must be 10 digits');
  }
  
  // Return E.164 format
  return `${countryCode}${cleanPhone}`;
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function validatePhoneNumber(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Generate message from template
 * @param {string} templateKey - Template key
 * @param {Object} variables - Template variables
 * @param {string} language - Language (default: 'es')
 * @returns {string} Generated message
 */
export function generateMessage(templateKey, variables = {}, language = 'es') {
  const template = MESSAGE_TEMPLATES[templateKey];
  
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`);
  }
  
  let message = template[language] || template.es;
  
  // Replace variables in template
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    message = message.replace(new RegExp(placeholder, 'g'), variables[key] || '');
  });
  
  return message;
}

/**
 * Send SMS via Twilio
 * @param {string} to - Recipient phone number (E.164 format)
 * @param {string} message - Message content
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Send result
 */
async function sendViaTwilio(to, message, options = {}) {
  const client = initializeTwilioClient();
  const from = process.env.TWILIO_PHONE_NUMBER;
  
  if (!client) {
    // Simulate sending for development/testing
    console.log('📱 [SIMULATED SMS]');
    console.log(`To: ${to}`);
    console.log(`From: ${from || 'Not configured'}`);
    console.log(`Message: ${message}`);
    
    return {
      success: true,
      simulated: true,
      messageId: `sim_${Date.now()}`,
      to,
      from: from || 'SIMULATED',
      status: 'sent',
      cost: 0
    };
  }
  
  if (!from) {
    throw new Error('TWILIO_PHONE_NUMBER not configured');
  }
  
  try {
    const result = await client.messages.create({
      body: message,
      from: from,
      to: to,
      statusCallback: options.statusCallback || process.env.TWILIO_STATUS_CALLBACK_URL
    });
    
    return {
      success: true,
      simulated: false,
      messageId: result.sid,
      to: result.to,
      from: result.from,
      status: result.status,
      cost: parseFloat(result.price) || 0,
      currency: result.priceUnit || 'USD',
      dateCreated: result.dateCreated,
      dateSent: result.dateSent,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage
    };
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    throw {
      success: false,
      error: {
        code: error.code || 'TWILIO_ERROR',
        message: error.message,
        details: error
      }
    };
  }
}

/**
 * Send single SMS
 * @param {Object} params - SMS parameters
 * @param {string} params.to - Recipient phone number (10 digits)
 * @param {string} params.message - Message content
 * @param {string} params.recipientName - Recipient name
 * @param {string} params.userId - User ID (optional)
 * @param {string} params.issueId - Related issue ID (optional)
 * @param {string} params.category - Notification category
 * @param {string} params.priority - Priority level
 * @returns {Promise<Object>} Notification object
 */
export async function sendSMS({
  to,
  message,
  recipientName,
  userId = null,
  issueId = null,
  category = 'CUSTOM',
  priority = 'MEDIUM',
  metadata = {}
}) {
  try {
    // Validate phone number
    if (!validatePhoneNumber(to)) {
      throw new Error('Invalid phone number format');
    }
    
    // Format phone number to E.164
    const formattedPhone = formatPhoneNumber(to);
    
    // Create notification record
    const notification = new Notification({
      type: 'SMS',
      category,
      priority,
      recipient: {
        userId,
        name: recipientName,
        phone: to
      },
      message: {
        body: message
      },
      relatedIssue: issueId,
      relatedUser: userId,
      status: 'PENDING',
      provider: {
        name: SMS_PROVIDERS.TWILIO
      },
      metadata,
      createdAt: new Date()
    });
    
    await notification.save();
    
    // Send SMS
    try {
      const result = await sendViaTwilio(formattedPhone, message);
      
      // Update notification with result
      await notification.markAsSent({
        messageId: result.messageId,
        cost: result.cost,
        currency: result.currency,
        status: result.status,
        simulated: result.simulated
      });
      
      return {
        success: true,
        notification,
        result
      };
    } catch (sendError) {
      // Mark as failed
      await notification.markAsFailed({
        code: sendError.error?.code || 'SEND_ERROR',
        message: sendError.error?.message || 'Failed to send SMS',
        details: sendError.error?.details
      });
      
      throw sendError;
    }
  } catch (error) {
    console.error('Error in sendSMS:', error);
    throw error;
  }
}

/**
 * Send SMS to multiple recipients (batch)
 * @param {Array} recipients - Array of recipient objects
 * @param {string} message - Message content
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Batch send results
 */
export async function sendBatchSMS(recipients, message, options = {}) {
  const batchId = `batch_${Date.now()}`;
  const results = {
    batchId,
    total: recipients.length,
    successful: 0,
    failed: 0,
    notifications: []
  };
  
  // Send to each recipient
  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    
    try {
      const notification = await sendSMS({
        to: recipient.phone,
        message,
        recipientName: recipient.name,
        userId: recipient.userId,
        issueId: options.issueId,
        category: options.category || 'CUSTOM',
        priority: options.priority || 'MEDIUM',
        metadata: {
          ...options.metadata,
          batchId,
          batchSize: recipients.length,
          batchIndex: i
        }
      });
      
      // Update notification with batch info
      notification.notification.batchId = batchId;
      notification.notification.batchSize = recipients.length;
      notification.notification.batchIndex = i;
      await notification.notification.save();
      
      results.successful++;
      results.notifications.push({
        recipient: recipient.name,
        phone: recipient.phone,
        status: 'sent',
        notificationId: notification.notification._id
      });
      
      // Rate limiting: wait 100ms between sends to avoid throttling
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      results.failed++;
      results.notifications.push({
        recipient: recipient.name,
        phone: recipient.phone,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Send emergency alert to all emergency contacts
 * @param {Object} params - Emergency alert parameters
 * @param {string} params.userId - User ID
 * @param {Array} params.emergencyContacts - Array of emergency contacts
 * @param {string} params.userName - User name
 * @param {string} params.location - Location description
 * @param {string} params.situation - Situation description
 * @param {string} params.issueId - Related issue ID (optional)
 * @returns {Promise<Object>} Batch send results
 */
export async function sendEmergencyAlert({
  userId,
  emergencyContacts,
  userName,
  location = 'Ubicación no disponible',
  situation = 'Emergencia',
  issueId = null,
  coordinates = null
}) {
  try {
    // Generate emergency message
    const message = generateMessage('EMERGENCY_ALERT', {
      userName,
      location,
      situation
    });
    
    // Add coordinates if available
    let fullMessage = message;
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      fullMessage += ` Coordenadas: https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
    }
    
    // Prepare recipients (prioritize primary contacts)
    const recipients = emergencyContacts
      .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      .map(contact => ({
        name: contact.name,
        phone: contact.phone,
        userId: null, // Emergency contacts may not be users
        isPrimary: contact.isPrimary
      }));
    
    // Send batch SMS
    const results = await sendBatchSMS(recipients, fullMessage, {
      issueId,
      category: 'EMERGENCY_ALERT',
      priority: 'CRITICAL',
      metadata: {
        userId,
        userName,
        location,
        situation,
        coordinates,
        isEmergency: true
      }
    });
    
    return {
      success: true,
      message: 'Emergency alerts sent',
      results
    };
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    throw error;
  }
}

/**
 * Send issue update notification
 * @param {Object} params - Update notification parameters
 * @returns {Promise<Object>} Send result
 */
export async function sendIssueUpdateNotification({
  issueId,
  userId,
  recipientPhone,
  recipientName,
  updateMessage,
  priority = 'MEDIUM'
}) {
  try {
    const message = generateMessage('ISSUE_UPDATE', {
      issueId,
      message: updateMessage
    });
    
    return await sendSMS({
      to: recipientPhone,
      message,
      recipientName,
      userId,
      issueId,
      category: 'ISSUE_UPDATE',
      priority
    });
  } catch (error) {
    console.error('Error sending issue update notification:', error);
    throw error;
  }
}

/**
 * Send court reminder
 * @param {Object} params - Court reminder parameters
 * @returns {Promise<Object>} Send result
 */
export async function sendCourtReminder({
  userId,
  recipientPhone,
  recipientName,
  date,
  time,
  location,
  issueId = null
}) {
  try {
    const message = generateMessage('COURT_REMINDER', {
      date,
      time,
      location
    });
    
    return await sendSMS({
      to: recipientPhone,
      message,
      recipientName,
      userId,
      issueId,
      category: 'COURT_REMINDER',
      priority: 'HIGH'
    });
  } catch (error) {
    console.error('Error sending court reminder:', error);
    throw error;
  }
}

/**
 * Send safety check
 * @param {Object} params - Safety check parameters
 * @returns {Promise<Object>} Send result
 */
export async function sendSafetyCheck({
  userId,
  recipientPhone,
  recipientName,
  issueId = null
}) {
  try {
    const message = generateMessage('SAFETY_CHECK', {});
    
    return await sendSMS({
      to: recipientPhone,
      message,
      recipientName,
      userId,
      issueId,
      category: 'SAFETY_CHECK',
      priority: 'HIGH'
    });
  } catch (error) {
    console.error('Error sending safety check:', error);
    throw error;
  }
}

/**
 * Get SMS delivery status from Twilio
 * @param {string} messageId - Twilio message SID
 * @returns {Promise<Object>} Delivery status
 */
export async function getSMSStatus(messageId) {
  const client = initializeTwilioClient();
  
  if (!client) {
    return {
      simulated: true,
      status: 'delivered',
      message: 'Simulated SMS - status check not available'
    };
  }
  
  try {
    const message = await client.messages(messageId).fetch();
    
    return {
      messageId: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
      price: message.price,
      priceUnit: message.priceUnit
    };
  } catch (error) {
    console.error('Error fetching SMS status:', error);
    throw error;
  }
}

/**
 * Calculate SMS cost estimate
 * @param {number} messageCount - Number of messages
 * @param {string} country - Country code (default: MX)
 * @returns {Object} Cost estimate
 */
export function estimateSMSCost(messageCount, country = 'MX') {
  // Approximate costs (in USD)
  const costPerSMS = {
    MX: 0.0075, // Mexico
    US: 0.0075, // United States
    DEFAULT: 0.01
  };
  
  const cost = (costPerSMS[country] || costPerSMS.DEFAULT) * messageCount;
  
  return {
    messageCount,
    costPerSMS: costPerSMS[country] || costPerSMS.DEFAULT,
    totalCost: cost,
    currency: 'USD',
    country
  };
}

export default {
  sendSMS,
  sendBatchSMS,
  sendEmergencyAlert,
  sendIssueUpdateNotification,
  sendCourtReminder,
  sendSafetyCheck,
  getSMSStatus,
  formatPhoneNumber,
  validatePhoneNumber,
  generateMessage,
  estimateSMSCost,
  MESSAGE_TEMPLATES
};
