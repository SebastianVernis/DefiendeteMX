import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
import { verifyAccessToken } from '../../../lib/auth/jwt';
import { validatePassword } from '../../../lib/auth/passwordValidator';

/**
 * POST /api/auth/change-password
 * Change user password
 */
export async function POST(request) {
  try {
    await connectDB();

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autenticado'
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido'
        },
        { status: 401 }
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
          error: 'Contraseña no cumple con los requisitos',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(decoded.userId).select('+password');

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

    // Check if new password is same as current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'La nueva contraseña debe ser diferente a la actual'
        },
        { status: 400 }
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

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
