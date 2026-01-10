export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { UserDB } from '../../../lib/db';
import bcrypt from 'bcrypt';
import { getRefreshTokenFromCookies, clearAuthCookies } from '../../../lib/auth/sessionManager';
import { authenticate } from '../../../lib/middleware/authMiddleware.d1';

/**
 * POST /api/auth/logout
 * Logout user and invalidate refresh token
 */
export async function POST(request) {
  try {
    // Get refresh token from cookies
    const refreshToken = getRefreshTokenFromCookies(request);

    // Try to authenticate user
    const authResult = await authenticate(request);

    if (authResult.authenticated && refreshToken) {
      // Remove refresh token from user
      await UserDB.removeRefreshToken(authResult.userId, refreshToken);
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
    await UserDB.update(authResult.userId, { refreshTokens: [] });

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
