import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chat from '../../../models/Chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/chat/session
 * Create a new chat session
 * 
 * Request Body:
 * {
 *   userId: string (required),
 *   legalScenario?: string,
 *   language?: string,
 *   deviceInfo?: object
 * }
 */
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, legalScenario, language = 'es', deviceInfo = {} } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // Generate unique session ID
    const sessionId = `chat_${uuidv4()}`;

    // Create new chat session
    const chat = await Chat.createSession(userId, sessionId, {
      legalScenario: legalScenario || 'GENERAL',
      language,
      deviceInfo
    });

    // Add welcome message
    const welcomeMessage = language === 'en' 
      ? 'Hello! I\'m your legal assistant. How can I help you today?'
      : '¡Hola! Soy tu asistente legal especializado. ¿En qué puedo ayudarte hoy?';

    await chat.addMessage('assistant', welcomeMessage, {
      sentiment: 'POSITIVE',
      detectedIntent: 'GREETING'
    });

    return NextResponse.json({
      success: true,
      message: 'Chat session created successfully',
      data: {
        sessionId: chat.sessionId,
        status: chat.status,
        language: chat.language,
        context: chat.context,
        welcomeMessage: {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating chat session:', error);
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
 * GET /api/chat/session?userId=xxx
 * Get active sessions for a user
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const sessions = await Chat.getActiveSessions(userId);

    return NextResponse.json({
      success: true,
      count: sessions.length,
      data: sessions.map(session => ({
        sessionId: session.sessionId,
        title: session.title,
        status: session.status,
        messageCount: session.messages.length,
        lastMessageAt: session.lastMessageAt,
        context: session.context,
        startedAt: session.startedAt
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting active sessions:', error);
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
