import { NextResponse } from 'next/server';
import notificationService from '../../../services/notificationService';

/**
 * GET /api/notifications/history
 * Get notification history for a user
 * Query params: userId, type, category, status, limit, skip
 */
export async function GET(request) {
  try {
    
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Get notification history
    const notifications = await notificationService.getNotificationHistory(userId, {
      type,
      category,
      status,
      limit,
      skip
    });
    
    // Get statistics
    const stats = await notificationService.getNotificationStats(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        notifications,
        stats,
        pagination: {
          limit,
          skip,
          total: notifications.length
        }
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in notification history API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get notification history',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/notifications/history
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
