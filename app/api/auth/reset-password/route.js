import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
import { validatePassword } from '../../../lib/auth/passwordValidator';
import crypto from 'crypto';

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { token, newPassword } = body;

    // Validate required fields
    if (!token || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token y nueva contraseña son requeridos'
        },
        { status: 400 }
      );
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contraseña no cumple con los requisitos',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido o expirado'
        },
        { status: 400 }
      );
    }

    // Check if new password is same as current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'La nueva contraseña debe ser diferente a la anterior'
        },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Invalidate all refresh tokens for security
    user.refreshTokens = [];
    
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Contraseña restablecida exitosamente. Puedes iniciar sesión con tu nueva contraseña'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al restablecer contraseña'
      },
      { status: 500 }
    );
  }
}
