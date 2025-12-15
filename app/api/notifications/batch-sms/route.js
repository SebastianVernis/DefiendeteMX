import { NextResponse } from 'next/server';
import smsService from '../../../services/smsService';

/**
 * POST /api/notifications/batch-sms
 * Send SMS to multiple recipients
 */
export async function POST(request) {
  try {
    
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    const { recipients, message, issueId, category, priority } = body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Recipients array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Validate recipients format
    for (const recipient of recipients) {
      if (!recipient.phone || !recipient.name) {
        return NextResponse.json(
          { success: false, error: 'Each recipient must have phone and name' },
          { status: 400 }
        );
      }
      
      if (!smsService.validatePhoneNumber(recipient.phone)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Invalid phone number format for ${recipient.name}: ${recipient.phone}` 
          },
          { status: 400 }
        );
      }
    }
    
    // Limit batch size
    if (recipients.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Maximum 100 recipients per batch' },
        { status: 400 }
      );
    }
    
    // Send batch SMS
    const result = await smsService.sendBatchSMS(recipients, message, {
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
      message: 'Batch SMS sent',
      data: {
        batchId: result.batchId,
        total: result.total,
        successful: result.successful,
        failed: result.failed,
        notifications: result.notifications
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in batch SMS API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send batch SMS',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/notifications/batch-sms
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
