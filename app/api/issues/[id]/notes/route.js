import { NextResponse } from 'next/server';
import { addNoteToIssue } from '@/app/issues/services/issueService.d1';

/**
 * POST /api/issues/[id]/notes
 * Add a note to an issue
 * Body: { content, userId, type?, isPrivate? }
 */
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!body.content) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const issue = await addNoteToIssue(
      id,
      body.content,
      body.userId,
      body.type || 'GENERAL',
      body.isPrivate || false
    );

    return NextResponse.json({
      success: true,
      message: 'Note added successfully',
      data: issue
    }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/issues/${params.id}/notes error:`, error);

    if (error.message === 'Issue not found') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Issue not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add note',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
