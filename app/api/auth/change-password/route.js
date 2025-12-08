import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
import { authenticate } from '../../../lib/middleware/authMiddleware';
import { validatePassword } from '../../../lib/auth/passwordValidator';

/**
 * PUT /api/auth/change-password
 * Change user password
 */
export async function PUT(request) {
  try {
    await connectDB();

    // Authenticate user
    const authResult = await authenticate(request);

    if (!authResult.authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error
        },
        { status: authResult.statusCode }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contraseña actual y nueva contraseña son requeridas'
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
          error: 'La nueva contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'La nueva contraseña debe ser diferente a la actual'
        },
        { status: 400 }
      );
    }

    // Get user with password field
    const user = await User.findById(authResult.userId).select('+password');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contraseña actual incorrecta'
        },
        { status: 401 }
      );
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    // Optionally, invalidate all refresh tokens (logout from all devices)
    // await user.removeAllRefreshTokens();

    return NextResponse.json(
      {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cambiar contraseña'
      },
      { status: 500 }
    );
  }
}
