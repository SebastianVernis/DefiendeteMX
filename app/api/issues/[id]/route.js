import { NextResponse } from 'next/server';
import { getIssueById, updateIssue, deleteIssue } from '@/app/issues/services/issueService';

/**
 * GET /api/issues/[id]
 * Get a single issue by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required for authorization' },
        { status: 400 }
      );
    }

    const issue = await getIssueById(id, userId);

    return NextResponse.json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error(`GET /api/issues/${params.id} error:`, error);

    if (error.message === 'Issue not found') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Issue not found' 
        },
        { status: 404 }
      );
    }

    if (error.message === 'Unauthorized access') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized access to this issue' 
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch issue',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/issues/[id]
 * Update an issue
 * Body: { title?, description?, status?, priority?, ... }
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required for authorization' },
        { status: 400 }
      );
    }

    const userId = body.userId;
    delete body.userId; // Remove userId from update data

    const issue = await updateIssue(id, body, userId);

    return NextResponse.json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    console.error(`PUT /api/issues/${params.id} error:`, error);

    if (error.message === 'Issue not found') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Issue not found' 
        },
        { status: 404 }
      );
    }

    if (error.message === 'Unauthorized to update this issue') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized to update this issue' 
        },
        { status: 403 }
      );
    }

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
        error: 'Failed to update issue',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/issues/[id]
 * Soft delete an issue
 * Query params: userId
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required for authorization' },
        { status: 400 }
      );
    }

    const issue = await deleteIssue(id, userId);

    return NextResponse.json({
      success: true,
      message: 'Issue deleted successfully',
      data: issue
    });
  } catch (error) {
    console.error(`DELETE /api/issues/${params.id} error:`, error);

    if (error.message === 'Issue not found') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Issue not found' 
        },
        { status: 404 }
      );
    }

    if (error.message === 'Unauthorized to delete this issue') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized to delete this issue' 
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete issue',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
