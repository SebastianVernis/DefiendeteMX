import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Chat from '../../../../models/Chat';

/**
 * GET /api/chat/session/:id?userId=xxx
 * Get a specific chat session with full message history
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const chat = await Chat.findOne({
      sessionId: id,
      user: userId,
      isDeleted: false
    });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: chat.sessionId,
        title: chat.title,
        status: chat.status,
        messages: chat.messages,
        context: chat.context,
        crisisDetection: chat.crisisDetection,
        analytics: chat.analytics,
        startedAt: chat.startedAt,
        lastMessageAt: chat.lastMessageAt,
        endedAt: chat.endedAt,
        feedback: chat.feedback
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting chat session:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/chat/session/:id
 * Update chat session (end session, update context)
 * 
 * Request Body:
 * {
 *   userId: string (required),
 *   action: 'end' | 'update_context',
 *   context?: object
 * }
 */
export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { userId, action, context } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const chat = await Chat.findOne({
      sessionId: id,
      user: userId,
      isDeleted: false
    });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat session not found' },
        { status: 404 }
      );
    }

    if (action === 'end') {
      await chat.endSession();
      
      return NextResponse.json({
        success: true,
        message: 'Chat session ended successfully',
        data: {
          sessionId: chat.sessionId,
          status: chat.status,
          endedAt: chat.endedAt,
          duration: chat.analytics.sessionDuration
        }
      }, { status: 200 });
    }

    if (action === 'update_context' && context) {
      await chat.updateContext(context);
      
      return NextResponse.json({
        success: true,
        message: 'Context updated successfully',
        data: {
          sessionId: chat.sessionId,
          context: chat.context
        }
      }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat/session/:id?userId=xxx
 * Delete (soft delete) a chat session
 */
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const chat = await Chat.findOne({
      sessionId: id,
      user: userId,
      isDeleted: false
    });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat session not found' },
        { status: 404 }
      );
    }

    // Soft delete
    chat.isDeleted = true;
    chat.deletedAt = new Date();
    chat.status = 'ARCHIVED';
    await chat.save();

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully',
      data: {
        sessionId: chat.sessionId,
        deletedAt: chat.deletedAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}
