import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import governmentApiService from '@/app/services/governmentApiService';

/**
 * GET /api/government/reports/:id
 * Get a specific government report by ID
 * Query params: userId
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
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

    const result = await governmentApiService.getReportById(id, userId);

    if (!result.success) {
      const statusCode = result.error.includes('not found') ? 404 : 
                        result.error.includes('Unauthorized') ? 403 : 400;
      
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
      data: result.data
    });
  } catch (error) {
    console.error('GET /api/government/reports/:id error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch government report',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/government/reports/:id
 * Update a government report
 * Body: { userId, reportData, priority, notes }
 */
export async function PUT(request, { params }) {
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

    const result = await governmentApiService.updateReport(id, body.userId, body);

    if (!result.success) {
      const statusCode = result.error.includes('not found') ? 404 : 
                        result.error.includes('Unauthorized') ? 403 : 400;
      
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
      message: 'Government report updated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('PUT /api/government/reports/:id error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update government report',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/government/reports/:id
 * Delete a government report (soft delete)
 * Query params: userId
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
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

    const result = await governmentApiService.deleteReport(id, userId);

    if (!result.success) {
      const statusCode = result.error.includes('not found') ? 404 : 
                        result.error.includes('Unauthorized') ? 403 : 400;
      
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
      message: result.message
    });
  } catch (error) {
    console.error('DELETE /api/government/reports/:id error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete government report',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
