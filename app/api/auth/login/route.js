import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
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
    await dbConnect();
    
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
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true, isDeleted: false }).select('+password');

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

    // Verify password using User model method
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      const newAttempts = (user.loginAttempts || 0) + 1;
      const maxLoginAttempts = 5;
      const lockTime = 2 * 60 * 60 * 1000; // 2 hours
      
      user.loginAttempts = newAttempts;
      
      if (newAttempts >= maxLoginAttempts) {
        user.lockUntil = new Date(Date.now() + lockTime);
        await user.save();
        return NextResponse.json(
          {
            success: false,
            error: 'Demasiados intentos fallidos. Cuenta bloqueada por 2 horas'
          },
          { status: 403 }
        );
      }
      
      await user.save();

      return NextResponse.json(
        {
          success: false,
          error: 'Credenciales inválidas',
          attemptsLeft: maxLoginAttempts - newAttempts
        },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

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

    // Save refresh token to user using model method
    await user.addRefreshToken(refreshToken, refreshTokenExpires, userAgent, ipAddress);

    // Get user without password
    const userWithoutPassword = await User.findById(user._id);

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
