import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
import { validateEmail } from '../../../lib/auth/passwordValidator';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
export async function POST(request) {
  try {
    await connectDB();

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
    const user = await User.findOne({ email: email.toLowerCase() });

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
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

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
