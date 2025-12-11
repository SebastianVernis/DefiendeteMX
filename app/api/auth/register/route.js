export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { UserDB } from '../../../lib/db';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../../lib/auth/jwt';
import { setAuthCookies } from '../../../lib/auth/sessionManager';
import { 
  validateEmail, 
  validatePassword, 
  validateFullName,
  validatePhone,
  sanitizeInput 
} from '../../../lib/auth/passwordValidator';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phone } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email, contraseña y nombre completo son requeridos'
        },
        { status: 400 }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: emailValidation.errors[0]
        },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Validate full name
    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: nameValidation.errors[0]
        },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone) {
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: phoneValidation.errors[0]
          },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await UserDB.findByEmail(email.toLowerCase());

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'El email ya está registrado'
        },
        { status: 409 }
      );
    }

    // Sanitize inputs
    const sanitizedFullName = sanitizeInput(fullName);
    const sanitizedPhone = phone ? sanitizeInput(phone) : undefined;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await UserDB.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName: sanitizedFullName,
      phone: sanitizedPhone,
      role: 'USER',
      isActive: true,
      isVerified: false
    });

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

    // Update last login
    await UserDB.update(user.id, {
      lastLogin: new Date().toISOString()
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          isPremium: user.isPremium
        }
      },
      { status: 201 }
    );

    // Set auth cookies
    setAuthCookies(response, accessToken, refreshToken);

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.message && error.message.includes('Validation failed')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error de validación',
          errors: [error.message]
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al registrar usuario'
      },
      { status: 500 }
    );
  }
}
