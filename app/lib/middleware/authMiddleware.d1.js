import { verifyAccessToken } from '../auth/jwt';
import { getAccessToken } from '../auth/sessionManager';
import { UserDB } from '../db';

/**
 * Authentication Middleware for D1
 * Protects API routes by verifying JWT tokens
 */

/**
 * Authenticate request and attach user to request object
 * @param {Object} req - Request object
 * @returns {Object} Object with authenticated user or error
 */
export async function authenticate(req) {
  try {
    // Get access token from cookies or header
    const token = getAccessToken(req);

    if (!token) {
      return {
        authenticated: false,
        error: 'No se proporcionó token de autenticación',
        statusCode: 401
      };
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return {
        authenticated: false,
        error: error.message || 'Token inválido',
        statusCode: 401
      };
    }

    // Get user from D1 database
    const user = await UserDB.findById(decoded.userId);

    if (!user) {
      return {
        authenticated: false,
        error: 'Usuario no encontrado',
        statusCode: 401
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        authenticated: false,
        error: 'Cuenta desactivada',
        statusCode: 403
      };
    }

    // Check if user is deleted
    if (user.isDeleted) {
      return {
        authenticated: false,
        error: 'Cuenta eliminada',
        statusCode: 403
      };
    }

    // Check if account is locked
    if (user.isLocked) {
      return {
        authenticated: false,
        error: 'Cuenta bloqueada temporalmente. Intenta más tarde',
        statusCode: 403
      };
    }

    return {
      authenticated: true,
      user,
      userId: user.id
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      error: 'Error de autenticación',
      statusCode: 500
    };
  }
}

/**
 * Require authentication middleware
 * Returns 401 if not authenticated
 * @param {Function} handler - Route handler function
 * @returns {Function} Wrapped handler
 */
export function requireAuth(handler) {
  return async (req, res) => {
    const authResult = await authenticate(req);

    if (!authResult.authenticated) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error
      });
    }

    // Attach user to request
    req.user = authResult.user;
    req.userId = authResult.userId;

    // Call the actual handler
    return handler(req, res);
  };
}

/**
 * Require specific role middleware
 * @param {string|Array<string>} roles - Required role(s)
 * @returns {Function} Middleware function
 */
export function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (handler) => {
    return async (req, res) => {
      const authResult = await authenticate(req);

      if (!authResult.authenticated) {
        return res.status(authResult.statusCode).json({
          success: false,
          error: authResult.error
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(authResult.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para acceder a este recurso'
        });
      }

      // Attach user to request
      req.user = authResult.user;
      req.userId = authResult.userId;

      // Call the actual handler
      return handler(req, res);
    };
  };
}

/**
 * Require verified email middleware
 * @param {Function} handler - Route handler function
 * @returns {Function} Wrapped handler
 */
export function requireVerified(handler) {
  return async (req, res) => {
    const authResult = await authenticate(req);

    if (!authResult.authenticated) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error
      });
    }

    // Check if email is verified
    if (!authResult.user.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'Debes verificar tu email para acceder a este recurso'
      });
    }

    // Attach user to request
    req.user = authResult.user;
    req.userId = authResult.userId;

    // Call the actual handler
    return handler(req, res);
  };
}

/**
 * Optional authentication middleware
 * Attaches user if authenticated, but doesn't require it
 * @param {Function} handler - Route handler function
 * @returns {Function} Wrapped handler
 */
export function optionalAuth(handler) {
  return async (req, res) => {
    const authResult = await authenticate(req);

    if (authResult.authenticated) {
      req.user = authResult.user;
      req.userId = authResult.userId;
    }

    // Call the actual handler regardless of authentication
    return handler(req, res);
  };
}

/**
 * Check if user owns resource
 * @param {string} resourceUserId - User ID of resource owner
 * @param {string} requestUserId - User ID from request
 * @param {string} userRole - User role from request
 * @returns {boolean} True if user owns resource or is admin
 */
export function isResourceOwner(resourceUserId, requestUserId, userRole) {
  // Admin can access any resource
  if (userRole === 'ADMIN') {
    return true;
  }

  // Check if user owns the resource
  return resourceUserId === requestUserId;
}

/**
 * Require resource ownership middleware
 * @param {Function} getResourceUserId - Function to get resource user ID from request
 * @returns {Function} Middleware function
 */
export function requireOwnership(getResourceUserId) {
  return (handler) => {
    return async (req, res) => {
      const authResult = await authenticate(req);

      if (!authResult.authenticated) {
        return res.status(authResult.statusCode).json({
          success: false,
          error: authResult.error
        });
      }

      // Get resource user ID
      const resourceUserId = await getResourceUserId(req);

      if (!resourceUserId) {
        return res.status(404).json({
          success: false,
          error: 'Recurso no encontrado'
        });
      }

      // Check ownership
      if (!isResourceOwner(resourceUserId, authResult.userId, authResult.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para acceder a este recurso'
        });
      }

      // Attach user to request
      req.user = authResult.user;
      req.userId = authResult.userId;

      // Call the actual handler
      return handler(req, res);
    };
  };
}

export default {
  authenticate,
  requireAuth,
  requireRole,
  requireVerified,
  optionalAuth,
  isResourceOwner,
  requireOwnership
};
