export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { UserDB } from '../../../lib/db';
import { authenticate } from '../../../lib/middleware/authMiddleware.d1';

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
          id: user.id,
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

    // Update allowed fields
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (phone !== undefined) updates.phone = phone;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updates.gender = gender;
    if (address !== undefined) updates.address = address;
    if (emergencyContacts !== undefined) updates.emergencyContacts = emergencyContacts;
    if (privacySettings !== undefined) {
      updates.privacySettings = {
        ...authResult.user.privacySettings,
        ...privacySettings
      };
    }

    const updatedUser = await UserDB.update(authResult.userId, updates);

    return NextResponse.json(
      {
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          dateOfBirth: updatedUser.dateOfBirth,
          gender: updatedUser.gender,
          address: updatedUser.address,
          emergencyContacts: updatedUser.emergencyContacts,
          privacySettings: updatedUser.privacySettings,
          updatedAt: updatedUser.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update user profile error:', error);
    
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
        error: 'Error al actualizar perfil'
      },
      { status: 500 }
    );
  }
}
