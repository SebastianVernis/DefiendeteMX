import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chat from '../../../models/Chat';

/**
 * POST /api/chat/feedback
 * Add feedback to a chat session
 * 
 * Request Body:
 * {
 *   sessionId: string (required),
 *   userId: string (required),
 *   rating: number (1-5, required),
 *   comment?: string,
 *   helpful?: boolean
 * }
 */
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { sessionId, userId, rating, comment = '', helpful = null } = body;

    // Validation
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find chat session
    const chat = await Chat.findOne({
      sessionId,
      user: userId,
      isDeleted: false
    });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat session not found' },
        { status: 404 }
      );
    }

    // Add feedback
    await chat.addFeedback(rating, comment, helpful);

    return NextResponse.json({
      success: true,
      message: 'Feedback added successfully',
      data: {
        sessionId: chat.sessionId,
        feedback: chat.feedback,
        overallSatisfaction: chat.overallSatisfaction
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error adding feedback:', error);
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
