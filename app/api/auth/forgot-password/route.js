export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { UserDB } from '../../../lib/db';
import crypto from 'crypto';
import { validateEmail } from '../../../lib/auth/passwordValidator';

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email es requerido'
        },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email inválido'
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserDB.findByEmail(email.toLowerCase());

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set reset token and expiration (1 hour)
    await UserDB.update(user.id, {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });

    // In production, send email with reset link
    // For now, we'll just log it (in development)
    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    console.log('Password reset URL:', resetUrl);
    console.log('Reset token:', resetToken);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json(
      {
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
        // Only include in development
        ...(process.env.NODE_ENV === 'development' && { resetUrl, resetToken })
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar solicitud'
      },
      { status: 500 }
    );
  }
}
