import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chat from '../../../models/Chat';

/**
 * GET /api/chat/history?userId=xxx&limit=20&skip=0&status=ACTIVE&legalScenario=VIOLENCIA_DOMESTICA
 * Get chat history for a user with filters
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const status = searchParams.get('status');
    const legalScenario = searchParams.get('legalScenario');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get chat history
    const chats = await Chat.getChatHistory(userId, {
      limit,
      skip,
      status,
      legalScenario
    });

    // Get total count for pagination
    const query = {
      user: userId,
      isDeleted: false
    };
    if (status) query.status = status;
    if (legalScenario) query['context.legalScenario'] = legalScenario;
    
    const totalCount = await Chat.countDocuments(query);

    return NextResponse.json({
      success: true,
      count: chats.length,
      total: totalCount,
      hasMore: skip + chats.length < totalCount,
      data: chats
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting chat history:', error);
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
