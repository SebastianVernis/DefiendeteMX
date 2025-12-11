export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { UserDB } from '../../../lib/db';
import bcrypt from 'bcrypt';
import { generateAccessToken, verifyRefreshToken } from '../../../lib/auth/jwt';
import { 
  getRefreshTokenFromCookies, 
  setAccessTokenCookie,
  clearAuthCookies 
} from '../../../lib/auth/sessionManager';

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request) {
  try {
    // Get refresh token from cookies
    const refreshToken = getRefreshTokenFromCookies(request);

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se proporcionó refresh token'
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      // Clear cookies if token is invalid
      const response = NextResponse.json(
        {
          success: false,
          error: error.message || 'Refresh token inválido'
        },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Get user from database
    const user = await UserDB.findById(decoded.userId);

    if (!user) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Check if user is active
    if (!user.isActive || user.isDeleted) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Cuenta desactivada'
        },
        { status: 403 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Check if account is locked
    if (user.isLocked) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Cuenta bloqueada temporalmente'
        },
        { status: 403 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Verify refresh token exists in user's tokens
    let tokenFound = false;
    const refreshTokens = user.refreshTokens || [];
    const validTokens = [];
    const now = new Date();

    for (const tokenData of refreshTokens) {
      // Check if token is expired
      if (new Date(tokenData.expiresAt) <= now) {
        continue; // Skip expired tokens
      }
      
      // Check if this is the token we're looking for
      try {
        const isMatch = await bcrypt.compare(refreshToken, tokenData.token);
        if (isMatch) {
          tokenFound = true;
        }
      } catch (err) {
        // Skip invalid tokens
        continue;
      }
      
      validTokens.push(tokenData);
    }

    if (!tokenFound) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Refresh token inválido o expirado'
        },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Update user with only valid tokens if any expired were removed
    if (validTokens.length !== refreshTokens.length) {
      await UserDB.update(user.id, { refreshTokens: validTokens });
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Token renovado exitosamente'
      },
      { status: 200 }
    );

    // Set new access token cookie
    setAccessTokenCookie(response, accessToken);

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    
    const response = NextResponse.json(
      {
        success: false,
        error: 'Error al renovar token'
      },
      { status: 500 }
    );

    clearAuthCookies(response);
    return response;
  }
}
