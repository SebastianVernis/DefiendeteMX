import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
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
    await connectDB();

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
    const user = await User.findById(decoded.userId).select('-password');

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
    if (!user.hasValidRefreshToken(refreshToken)) {
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

    // Clean expired tokens
    await user.cleanExpiredRefreshTokens();

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
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
