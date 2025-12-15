/**
 * Push Notifications Service
 * Web Push API implementation for browser notifications
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY';

/**
 * Request permission for push notifications
 * @returns {Promise<string>} Permission status
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }

  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Check if notifications are supported
 * @returns {boolean} Support status
 */
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Get current permission status
 * @returns {string} Permission status
 */
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Subscribe to push notifications
 * @returns {Promise<PushSubscription>} Subscription object
 */
export const subscribeToPushNotifications = async () => {
  if (!isNotificationSupported()) {
    throw new Error('Push notifications not supported');
  }

  const permission = await requestNotificationPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });

  return subscription;
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>} Success status
 */
export const unsubscribeFromPushNotifications = async () => {
  if (!isNotificationSupported()) {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
    return true;
  }

  return false;
};

/**
 * Get current push subscription
 * @returns {Promise<PushSubscription|null>} Subscription or null
 */
export const getPushSubscription = async () => {
  if (!isNotificationSupported()) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
};

/**
 * Send local notification (doesn't require server)
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Promise<Notification>} Notification object
 */
export const sendLocalNotification = async (title, options = {}) => {
  if (!isNotificationSupported()) {
    throw new Error('Notifications not supported');
  }

  const permission = await requestNotificationPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const defaultOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    ...options
  };

  return new Notification(title, defaultOptions);
};

/**
 * Save push subscription to server
 * @param {PushSubscription} subscription - Push subscription object
 * @returns {Promise<Response>} Server response
 */
export const savePushSubscription = async (subscription) => {
  const response = await fetch('/api/notifications/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription: subscription.toJSON()
    })
  });

  if (!response.ok) {
    throw new Error('Failed to save subscription');
  }

  return response.json();
};

/**
 * Delete push subscription from server
 * @param {string} endpoint - Subscription endpoint
 * @returns {Promise<Response>} Server response
 */
export const deletePushSubscription = async (endpoint) => {
  const response = await fetch('/api/notifications/push/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint })
  });

  if (!response.ok) {
    throw new Error('Failed to delete subscription');
  }

  return response.json();
};

/**
 * Helper: Convert VAPID key from base64 to Uint8Array
 * @param {string} base64String - Base64 encoded string
 * @returns {Uint8Array} Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Notification presets for common scenarios
 */
export const notificationPresets = {
  emergency: {
    title: '🚨 Alerta de Emergencia',
    body: 'Se ha activado una alerta de emergencia',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    tag: 'emergency',
    actions: [
      { action: 'view', title: 'Ver detalles' },
      { action: 'dismiss', title: 'Cerrar' }
    ]
  },
  caseUpdate: {
    title: '📋 Actualización de Caso',
    body: 'Tu caso ha sido actualizado',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'case-update'
  },
  reminder: {
    title: '🔔 Recordatorio',
    body: 'Tienes un recordatorio pendiente',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'reminder'
  },
  message: {
    title: '💬 Nuevo Mensaje',
    body: 'Tienes un nuevo mensaje',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'message'
  }
};

export default {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getPushSubscription,
  sendLocalNotification,
  savePushSubscription,
  deletePushSubscription,
  notificationPresets
};
