import { NextResponse } from 'next/server';
import { getUserIssueStats } from '@/app/issues/services/issueService';

/**
 * GET /api/issues/stats
 * Get issue statistics for a user
 * Query params: userId
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const stats = await getUserIssueStats(userId);

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('GET /api/issues/stats error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
