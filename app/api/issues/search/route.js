import { NextResponse } from 'next/server';
import { searchIssues } from '@/app/issues/services/issueService';

/**
 * GET /api/issues/search
 * Search issues by text query
 * Query params: q (query), userId (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const userId = searchParams.get('userId');

    if (!query) {
      return NextResponse.json(
        { error: 'q (query) parameter is required' },
        { status: 400 }
      );
    }

    const issues = await searchIssues(query, userId);

    return NextResponse.json({
      success: true,
      count: issues.length,
      query: query,
      data: issues
    });
  } catch (error) {
    console.error('GET /api/issues/search error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to search issues',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
