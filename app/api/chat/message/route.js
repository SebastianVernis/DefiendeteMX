import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Chat from '../../../models/Chat';
import AIChatService from '../../../services/aiChatService';

/**
 * POST /api/chat/message
 * Send a message and get AI response
 * 
 * Request Body:
 * {
 *   sessionId: string (required),
 *   userId: string (required),
 *   message: string (required),
 *   context?: object
 * }
 */
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { sessionId, userId, message, context = {} } = body;

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

    // Validate message
    const validation = AIChatService.validateMessage(message);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Find or create chat session
    let chat = await Chat.findOne({ sessionId, user: userId });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat session not found. Create a session first.' },
        { status: 404 }
      );
    }

    // Check if session is active
    if (chat.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Chat session is not active' },
        { status: 400 }
      );
    }

    // Add user message
    await chat.addMessage('user', validation.message);

    // Generate AI response
    const aiResponse = await AIChatService.generateResponse(
      validation.message,
      {
        ...context,
        legalScenario: chat.context.legalScenario,
        emotionalState: chat.context.emotionalState,
        conversationHistory: chat.messages.slice(-5) // Last 5 messages for context
      }
    );

    // Add assistant message
    await chat.addMessage('assistant', aiResponse.content, {
      sentiment: aiResponse.sentiment,
      ...aiResponse.metadata
    });

    // Handle crisis detection
    if (aiResponse.crisisDetected) {
      await chat.detectCrisis(aiResponse.crisisKeywords);
      
      // Update context
      await chat.updateContext({
        emotionalState: 'CRISIS',
        riskLevel: 'CRITICAL',
        needsEmergencyHelp: true
      });
    }

    // Update emotional state based on sentiment
    if (aiResponse.sentiment === 'DISTRESSED' && chat.context.emotionalState !== 'CRISIS') {
      await chat.updateContext({
        emotionalState: 'DISTRESSED',
        riskLevel: chat.context.riskLevel === 'LOW' ? 'MEDIUM' : chat.context.riskLevel
      });
    }

    // Reload chat to get updated data
    await chat.save();

    return NextResponse.json({
      success: true,
      data: {
        message: {
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          sentiment: aiResponse.sentiment
        },
        crisisDetected: aiResponse.crisisDetected,
        suggestedActions: aiResponse.metadata.suggestedActions,
        context: {
          emotionalState: chat.context.emotionalState,
          riskLevel: chat.context.riskLevel,
          needsEmergencyHelp: chat.context.needsEmergencyHelp
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in chat message API:', error);
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
