import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import governmentApiService from '@/app/services/governmentApiService';

/**
 * GET /api/government/reports/stats
 * Get statistics for user's government reports
 * Query params: userId
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'userId is required' 
        },
        { status: 400 }
      );
    }

    const result = await governmentApiService.getReportStatistics(userId);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('GET /api/government/reports/stats error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch report statistics',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
