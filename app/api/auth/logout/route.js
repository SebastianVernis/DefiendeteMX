import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
import { getRefreshTokenFromCookies, clearAuthCookies } from '../../../lib/auth/sessionManager';
import { authenticate } from '../../../lib/middleware/authMiddleware';

/**
 * POST /api/auth/logout
 * Logout user and invalidate refresh token
 */
export async function POST(request) {
  try {
    await connectDB();

    // Get refresh token from cookies
    const refreshToken = getRefreshTokenFromCookies(request);

    // Try to authenticate user
    const authResult = await authenticate(request);

    if (authResult.authenticated && refreshToken) {
      // Remove refresh token from user
      const user = await User.findById(authResult.userId);
      if (user) {
        await user.removeRefreshToken(refreshToken);
      }
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada exitosamente'
      },
      { status: 200 }
    );

    // Clear auth cookies
    clearAuthCookies(response);

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, clear cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada'
      },
      { status: 200 }
    );

    clearAuthCookies(response);
    return response;
  }
}

/**
 * DELETE /api/auth/logout
 * Logout from all devices (remove all refresh tokens)
 */
export async function DELETE(request) {
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

    // Remove all refresh tokens
    const user = await User.findById(authResult.userId);
    if (user) {
      await user.removeAllRefreshTokens();
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Sesión cerrada en todos los dispositivos'
      },
      { status: 200 }
    );

    // Clear auth cookies
    clearAuthCookies(response);

    return response;

  } catch (error) {
    console.error('Logout all devices error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cerrar sesión'
      },
      { status: 500 }
    );
  }
}
