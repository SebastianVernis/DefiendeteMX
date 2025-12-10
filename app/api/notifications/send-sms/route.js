import { NextResponse } from 'next/server';
import smsService from '../../../services/smsService';
import connectDB from '../../../config/database';

/**
 * POST /api/notifications/send-sms
 * Send custom SMS notification
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const { 
      to, 
      message, 
      recipientName, 
      userId, 
      issueId, 
      category, 
      priority 
    } = body;
    
    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Recipient phone number (to) is required' },
        { status: 400 }
      );
    }
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }
    
    if (!recipientName) {
      return NextResponse.json(
        { success: false, error: 'Recipient name is required' },
        { status: 400 }
      );
    }
    
    // Validate phone number format
    if (!smsService.validatePhoneNumber(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format. Must be 10 digits.' },
        { status: 400 }
      );
    }
    
    // Send SMS
    const result = await smsService.sendSMS({
      to,
      message,
      recipientName,
      userId: userId || null,
      issueId: issueId || null,
      category: category || 'CUSTOM',
      priority: priority || 'MEDIUM',
      metadata: {
        source: 'api',
        timestamp: new Date().toISOString()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      data: {
        notificationId: result.notification._id,
        status: result.notification.status,
        recipient: {
          name: result.notification.recipient.name,
          phone: result.notification.recipient.phone
        },
        sentAt: result.notification.delivery.sentAt,
        simulated: result.result.simulated || false
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in send SMS API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send SMS',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/notifications/send-sms
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
