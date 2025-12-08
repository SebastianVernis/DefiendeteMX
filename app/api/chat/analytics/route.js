import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chat from '../../../models/Chat';

/**
 * GET /api/chat/analytics?userId=xxx
 * Get chat analytics for a user
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const analytics = await Chat.getUserAnalytics(userId);

    return NextResponse.json({
      success: true,
      data: analytics
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}
