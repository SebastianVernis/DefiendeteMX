import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import { addEvidenceToIssue } from '@/app/issues/services/issueService';

/**
 * POST /api/issues/[id]/evidence
 * Add evidence to an issue
 * Body: { url, filename?, fileType?, description?, size?, userId }
 */
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json(
        { error: 'url is required' },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userId = body.userId;
    const evidenceData = {
      url: body.url,
      filename: body.filename,
      fileType: body.fileType || 'OTHER',
      description: body.description,
      size: body.size
    };

    const issue = await addEvidenceToIssue(id, evidenceData, userId);

    return NextResponse.json({
      success: true,
      message: 'Evidence added successfully',
      data: issue
    }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/issues/${params.id}/evidence error:`, error);

    if (error.message === 'Issue not found') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Issue not found' 
        },
        { status: 404 }
      );
    }

    if (error.message === 'Unauthorized to add evidence') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized to add evidence' 
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add evidence',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
