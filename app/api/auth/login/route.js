import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
import { generateTokens } from '../../../lib/auth/jwt';
import { setAuthCookies } from '../../../lib/auth/sessionManager';
import { validateEmail } from '../../../lib/auth/passwordValidator';

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email y contraseña son requeridos'
        },
        { status: 400 }
      );
    }

    // Validate email format
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

    // Find user by email (including password field)
    const user = await User.findByCredentials(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Credenciales inválidas'
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockUntil = new Date(user.lockUntil);
      const now = new Date();
      const minutesLeft = Math.ceil((lockUntil - now) / 60000);

      return NextResponse.json(
        {
          success: false,
          error: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutesLeft} minutos`
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();

      // Check if account is now locked
      const updatedUser = await User.findById(user._id);
      if (updatedUser.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: 'Demasiados intentos fallidos. Cuenta bloqueada por 2 horas'
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Credenciales inválidas',
          attemptsLeft: 5 - updatedUser.loginAttempts
        },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Calculate refresh token expiration (7 days)
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'Unknown';

    // Save refresh token to user
    await user.addRefreshToken(refreshToken, refreshTokenExpires, userAgent, ipAddress);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Get user without password
    const userWithoutPassword = await User.findById(user._id).select('-password');

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: {
          id: userWithoutPassword._id,
          email: userWithoutPassword.email,
          fullName: userWithoutPassword.fullName,
          role: userWithoutPassword.role,
          isVerified: userWithoutPassword.isVerified,
          isPremium: userWithoutPassword.isPremium,
          lastLogin: userWithoutPassword.lastLogin
        }
      },
      { status: 200 }
    );

    // Set auth cookies
    setAuthCookies(response, accessToken, refreshToken);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al iniciar sesión'
      },
      { status: 500 }
    );
  }
}
