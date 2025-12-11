import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { validatePassword } from '../../../lib/auth/passwordValidator';

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export async function POST(request) {
  try {
    
    await dbConnect();
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
    const db = getDB();
    const result = await db.prepare(`
      SELECT * FROM users 
      WHERE reset_password_token = ? 
      AND reset_password_expires > datetime('now')
      AND is_deleted = 0
    `).bind(resetTokenHash).first();

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido o expirado'
        },
        { status: 400 }
      );
    }

    // Get user with password for verification
    const user = await UserDB.findByCredentials(result.email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      );
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'La nueva contraseña debe ser diferente a la anterior'
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await UserDB.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshTokens: [] // Invalidate all refresh tokens for security
    });

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
