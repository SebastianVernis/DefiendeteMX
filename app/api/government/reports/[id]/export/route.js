import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import governmentApiService from '@/app/services/governmentApiService';

/**
 * GET /api/government/reports/:id/export
 * Export a government report in specified format
 * Query params: userId, format (JSON, PDF, XML), purpose
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'JSON';
    const purpose = searchParams.get('purpose') || '';

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'userId is required' 
        },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['JSON', 'PDF', 'XML'];
    if (!validFormats.includes(format.toUpperCase())) {
      return NextResponse.json(
        { 
          success: false,
          error: `Invalid format. Must be one of: ${validFormats.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const result = await governmentApiService.exportReport(id, userId, format, purpose);

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

    // Set appropriate content type based on format
    const contentTypes = {
      'JSON': 'application/json',
      'PDF': 'text/plain', // Will be 'application/pdf' when using actual PDF library
      'XML': 'application/xml'
    };

    const response = NextResponse.json({
      success: true,
      format: result.format,
      data: result.data
    });

    // Add content-type header
    response.headers.set('Content-Type', contentTypes[result.format] || 'application/json');

    return response;
  } catch (error) {
    console.error('GET /api/government/reports/:id/export error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to export government report',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
