import { NextResponse } from 'next/server';
import AIChatService, { QUICK_ACTIONS } from '../../../services/aiChatService';

/**
 * GET /api/chat/quick-actions
 * Get all available quick actions
 */
export async function GET(request) {
  try {
    const quickActions = AIChatService.getQuickActions();

    return NextResponse.json({
      success: true,
      count: quickActions.length,
      data: quickActions
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting quick actions:', error);
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
 * POST /api/chat/quick-actions
 * Get content for a specific quick action
 * 
 * Request Body:
 * {
 *   actionKey: string (required)
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { actionKey } = body;

    if (!actionKey) {
      return NextResponse.json(
        { success: false, error: 'actionKey is required' },
        { status: 400 }
      );
    }

    const action = AIChatService.getQuickAction(actionKey);

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Quick action not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: action
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting quick action:', error);
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
