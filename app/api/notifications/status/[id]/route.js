export const runtime = 'edge';

import { NextResponse } from 'next/server';
import notificationService from '../../../../services/notificationService.d1';
import smsService from '../../../../services/smsService';

/**
 * GET /api/notifications/status/:id
 * Get notification status by ID
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    // Get notification
    const notification = await notificationService.getNotificationById(id);
    
    // If SMS, try to get updated status from provider
    if (notification.type === 'SMS' && notification.provider.messageId) {
      try {
        const providerStatus = await smsService.getSMSStatus(notification.provider.messageId);
        
        // Update notification status if changed
        if (providerStatus.status === 'delivered' && notification.status !== 'DELIVERED') {
          await notificationService.updateNotificationStatus(notification.id, 'DELIVERED');
        }
      } catch (statusError) {
        console.warn('Could not fetch provider status:', statusError.message);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: notification.id,
        type: notification.type,
        category: notification.category,
        priority: notification.priority,
        status: notification.status,
        recipient: {
          name: notification.recipient.name,
          phone: notification.recipient.phone,
          email: notification.recipient.email
        },
        message: notification.message,
        delivery: {
          sentAt: notification.delivery.sentAt,
          deliveredAt: notification.delivery.deliveredAt,
          readAt: notification.delivery.readAt,
          failedAt: notification.delivery.failedAt,
          attempts: notification.delivery.attempts
        },
        provider: {
          name: notification.provider.name,
          messageId: notification.provider.messageId,
          cost: notification.provider.cost,
          currency: notification.provider.currency
        },
        error: notification.error,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        canRetry: notification.status === 'FAILED' && (notification.delivery?.attempts || 0) < 3
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in notification status API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get notification status',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications/status/:id
 * Update notification status (mark as read, retry, etc.)
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'mark_read':
        const userId = body.userId;
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required for mark_read action' },
            { status: 400 }
          );
        }
        result = await notificationService.markNotificationAsRead(id, userId);
        break;
        
      case 'retry':
        result = await notificationService.retryFailedNotification(id);
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed successfully`,
      data: result
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in notification status update API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update notification status',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/notifications/status/:id
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
