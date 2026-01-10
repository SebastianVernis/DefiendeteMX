export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { UserDB } from '../../../lib/db';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../../lib/auth/jwt';
import { setAuthCookies } from '../../../lib/auth/sessionManager';
import { validateEmail } from '../../../lib/auth/passwordValidator';

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export async function POST(request) {
  try {
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
    const user = await UserDB.findByCredentials(email);

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment login attempts
      const newAttempts = (user.loginAttempts || 0) + 1;
      const maxLoginAttempts = 5;
      const lockTime = 2 * 60 * 60 * 1000; // 2 hours
      
      let updates = { loginAttempts: newAttempts };
      
      if (newAttempts >= maxLoginAttempts) {
        updates.lockUntil = new Date(Date.now() + lockTime).toISOString();
        await UserDB.update(user.id, updates);
        return NextResponse.json(
          {
            success: false,
            error: 'Demasiados intentos fallidos. Cuenta bloqueada por 2 horas'
          },
          { status: 403 }
        );
      }
      
      await UserDB.update(user.id, updates);

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
    if (user.loginAttempts > 0) {
      await UserDB.update(user.id, {
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date().toISOString()
      });
    } else {
      await UserDB.update(user.id, {
        lastLogin: new Date().toISOString()
      });
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

    // Hash refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Save refresh token to user
    await UserDB.addRefreshToken(user.id, hashedRefreshToken, refreshTokenExpires.toISOString(), userAgent, ipAddress);

    // Get user without password
    const userWithoutPassword = await UserDB.findById(user.id);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: {
          id: userWithoutPassword.id,
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
