export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createIssue, getUserIssues } from '@/app/issues/services/issueService';

/**
 * GET /api/issues
 * Get all issues for a user with optional filters
 * Query params: userId, status, category, priority, riskLevel
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

    // Build filters from query params
    const filters = {};
    if (searchParams.get('status')) filters.status = searchParams.get('status');
    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('priority')) filters.priority = searchParams.get('priority');
    if (searchParams.get('riskLevel')) filters.riskLevel = searchParams.get('riskLevel');

    const issues = await getUserIssues(userId, filters);

    return NextResponse.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('GET /api/issues error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch issues',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/issues
 * Create a new issue
 * Body: { title, description, category, user, incident, ... }
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.user) {
      return NextResponse.json(
        { error: 'user is required' },
        { status: 400 }
      );
    }

    // Create issue
    const issue = await createIssue(body);

    return NextResponse.json({
      success: true,
      message: 'Issue created successfully',
      data: issue
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/issues error:', error);
    
    // Handle validation errors
    if (error.message.includes('Validation failed')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation error',
          message: error.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create issue',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
