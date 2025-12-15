import { NextResponse } from 'next/server';
import notificationService from '../../../services/notificationService';

/**
 * POST /api/notifications/emergency
 * Trigger emergency alert to all emergency contacts
 */
export async function POST(request) {
  try {
    
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    const { userId, location, situation, coordinates, issueId, additionalMessage } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Trigger emergency alert
    const result = await notificationService.triggerEmergencyAlert({
      userId,
      issueId: issueId || null,
      location: location || null,
      situation: situation || 'Emergencia',
      coordinates: coordinates || null,
      additionalMessage: additionalMessage || ''
    });
    
    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully',
      data: result
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in emergency alert API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send emergency alert',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/notifications/emergency
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
