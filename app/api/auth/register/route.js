import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import User from '../../../models/User';
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
    await connectDB();

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
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      isDeleted: false 
    });

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

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save hook
      fullName: sanitizedFullName,
      phone: sanitizedPhone,
      role: 'USER',
      isActive: true,
      isVerified: false
    });

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

    // Save refresh token to user
    await user.addRefreshToken(refreshToken, refreshTokenExpires, userAgent, ipAddress);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user._id,
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
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Error de validación',
          errors
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
