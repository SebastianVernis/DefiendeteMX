import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import governmentApiService from '@/app/services/governmentApiService';

/**
 * POST /api/government/reports/:id/submit
 * Submit a government report to authorities
 * Body: { userId, method, additionalData }
 */
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'userId is required' 
        },
        { status: 400 }
      );
    }

    const submissionData = {
      method: body.method || 'MANUAL',
      ...body.additionalData
    };

    const result = await governmentApiService.submitReport(id, body.userId, submissionData);

    if (!result.success) {
      const statusCode = result.error.includes('not found') ? 404 : 
                        result.error.includes('Unauthorized') ? 403 :
                        result.error.includes('Validation') ? 400 : 400;
      
      return NextResponse.json(
        { 
          success: false,
          error: result.error 
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('POST /api/government/reports/:id/submit error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit government report',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
