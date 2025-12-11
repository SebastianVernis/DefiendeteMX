import { NextResponse } from 'next/server';

/**
 * Email Notification API
 * Send email notifications using Nodemailer/SendGrid/Resend
 *
 * Setup Instructions:
 * 1. Install email service: npm install nodemailer
 * 2. Set environment variables:
 *    - SMTP_HOST=smtp.gmail.com
 *    - SMTP_PORT=587
 *    - SMTP_USER=your-email@gmail.com
 *    - SMTP_PASS=your-app-password
 *    - SMTP_FROM=Defiéndete MX <noreply@defiendete-mx.com>
 */

// Email templates
const emailTemplates = {
  welcome: {
    subject: 'Bienvenido a Defiéndete MX',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Bienvenido a Defiéndete MX!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hola ${data.name},</p>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            Gracias por unirte a Defiéndete MX. Ahora tienes acceso a herramientas legales
            verificadas para proteger tus derechos en México.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Iniciar Sesión
            </a>
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
            Defiéndete MX - Conoce tus derechos
          </p>
        </div>
      </div>
    `
  },

  caseUpdate: {
    subject: 'Actualización de tu Caso',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3b82f6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📋 Actualización de Caso</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hola ${data.name},</p>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            Tu caso <strong>${data.caseTitle}</strong> ha sido actualizado.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280;"><strong>Estado:</strong> ${data.status}</p>
            <p style="margin: 10px 0 0 0; color: #6b7280;"><strong>Actualización:</strong> ${data.update}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.caseUrl}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Ver Caso Completo
            </a>
          </div>
        </div>
      </div>
    `
  },

  emergency: {
    subject: '🚨 ALERTA DE EMERGENCIA',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚨 EMERGENCIA</h1>
        </div>
        <div style="padding: 30px; background: #fef2f2; border: 2px solid #dc2626;">
          <p style="font-size: 16px; color: #991b1b; font-weight: bold;">
            Se ha activado una alerta de emergencia
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280;"><strong>Usuario:</strong> ${data.name}</p>
            <p style="margin: 10px 0 0 0; color: #6b7280;"><strong>Hora:</strong> ${data.timestamp}</p>
            ${data.location ? `<p style="margin: 10px 0 0 0; color: #6b7280;"><strong>Ubicación:</strong> <a href="${data.location}">${data.location}</a></p>` : ''}
          </div>
          <p style="font-size: 14px; color: #991b1b;">
            Por favor, contacta inmediatamente a: ${data.phone || '911'}
          </p>
        </div>
      </div>
    `
  },

  reminder: {
    subject: 'Recordatorio de Defiéndete MX',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8b5cf6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Recordatorio</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hola ${data.name},</p>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            ${data.message}
          </p>
          ${data.actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.actionUrl}" style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                ${data.actionText || 'Ver Detalles'}
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }
};

// Mock email sending function (replace with actual service)
async function sendEmailViaSMTP(to, subject, html) {
  // In production, use a real email service like:
  // - Nodemailer with Gmail/SMTP
  // - SendGrid
  // - Resend
  // - AWS SES
  // - Mailgun

  console.log('📧 Email would be sent:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html.substring(0, 200) + '...');

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // For now, just return success
  return {
    success: true,
    messageId: `mock-${Date.now()}`,
    message: 'Email would be sent in production'
  };
}

/**
 * POST /api/notifications/email
 * Send an email notification
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { to, type, data } = body;

    if (!to || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type' },
        { status: 400 }
      );
    }

    // Get template
    const template = emailTemplates[type];

    if (!template) {
      return NextResponse.json(
        { error: 'Invalid email template type' },
        { status: 400 }
      );
    }

    // Generate email content
    const subject = template.subject;
    const html = template.html(data);

    // Send email
    const result = await sendEmailViaSMTP(to, subject, html);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/email/templates
 * Get available email templates
 */
export async function GET() {
  return NextResponse.json({
    templates: Object.keys(emailTemplates)
  });
}
