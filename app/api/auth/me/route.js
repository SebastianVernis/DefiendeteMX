import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/database';
import { authenticate } from '../../../lib/middleware/authMiddleware';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request) {
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

    const user = authResult.user;

    // Return user data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          emergencyContacts: user.emergencyContacts,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          isPremium: user.isPremium,
          premiumExpiresAt: user.premiumExpiresAt,
          privacySettings: user.privacySettings,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get current user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener información del usuario'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/me
 * Update current user profile
 */
export async function PUT(request) {
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

    const body = await request.json();
    const { 
      fullName, 
      phone, 
      dateOfBirth, 
      gender, 
      address, 
      emergencyContacts,
      privacySettings 
    } = body;

    const user = authResult.user;

    // Update allowed fields
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (emergencyContacts !== undefined) user.emergencyContacts = emergencyContacts;
    if (privacySettings !== undefined) {
      user.privacySettings = {
        ...user.privacySettings,
        ...privacySettings
      };
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          emergencyContacts: user.emergencyContacts,
          privacySettings: user.privacySettings,
          updatedAt: user.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update user profile error:', error);
    
    // Handle validation errors
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
        error: 'Error al actualizar perfil'
      },
      { status: 500 }
    );
  }
}
