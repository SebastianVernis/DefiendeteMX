import { NextResponse } from 'next/server';
import { updateIssueStatus } from '@/app/issues/services/issueService';

/**
 * PATCH /api/issues/[id]/status
 * Update issue status with workflow validation
 * Body: { status, userId, notes? }
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const issue = await updateIssueStatus(
      id,
      body.status,
      body.userId,
      body.notes || ''
    );

    return NextResponse.json({
      success: true,
      message: 'Issue status updated successfully',
      data: issue
    });
  } catch (error) {
    console.error(`PATCH /api/issues/${params.id}/status error:`, error);

    if (error.message === 'Issue not found') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Issue not found' 
        },
        { status: 404 }
      );
    }

    if (error.message.includes('Invalid status transition')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid status transition',
          message: error.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update issue status',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
