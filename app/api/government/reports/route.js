import { NextResponse } from 'next/server';
import governmentApiService from '@/app/services/governmentApiService';

/**
 * GET /api/government/reports
 * Get all government reports for a user with optional filters
 * Query params: userId, status, targetEntity, reportType
 */
export async function GET(request) {
  try {
    
    await dbConnect();
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

    // Build filters from query params
    const filters = {};
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status');
    }
    if (searchParams.get('targetEntity')) {
      filters.targetEntity = searchParams.get('targetEntity');
    }
    if (searchParams.get('reportType')) {
      filters.reportType = searchParams.get('reportType');
    }

    const reports = await governmentApiService.getUserReports(userId);
    
    // Filter results based on query params
    let filteredReports = reports;
    if (filters.status) {
      filteredReports = filteredReports.filter(r => r.status === filters.status);
    }
    if (filters.targetEntity) {
      filteredReports = filteredReports.filter(r => r.targetEntity === filters.targetEntity);
    }
    if (filters.reportType) {
      filteredReports = filteredReports.filter(r => r.reportType === filters.reportType);
    }

    return NextResponse.json({
      success: true,
      count: filteredReports.length,
      data: filteredReports
    });
  } catch (error) {
    console.error('GET /api/government/reports error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch government reports',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/government/reports
 * Create a new government report from an existing issue
 * Body: { issueId, userId, reportType, targetEntity, additionalData }
 */
export async function POST(request) {
  try {
    
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    if (!body.issueId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'issueId is required' 
        },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'userId is required' 
        },
        { status: 400 }
      );
    }

    if (!body.reportType) {
      return NextResponse.json(
        { 
          success: false,
          error: 'reportType is required' 
        },
        { status: 400 }
      );
    }

    if (!body.targetEntity) {
      return NextResponse.json(
        { 
          success: false,
          error: 'targetEntity is required' 
        },
        { status: 400 }
      );
    }

    // Create government report
    const report = await governmentApiService.createReportFromIssue(
      body.issueId,
      body.userId,
      body.reportType,
      body.targetEntity,
      body.additionalData || {}
    );

    return NextResponse.json({
      success: true,
      message: 'Government report created successfully',
      data: report
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/government/reports error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create government report',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
