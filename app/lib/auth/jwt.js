import jwt from 'jsonwebtoken';

/**
 * JWT Utilities
 * Handles JWT token generation, verification, and refresh logic
 */

// Get JWT secrets from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // 7 days

/**
 * Generate access token
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT access token
 */
export function generateAccessToken(payload) {
  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        type: 'access'
      },
      JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        issuer: 'defiendete-mx',
        audience: 'defiendete-mx-users'
      }
    );
    return token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
}

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(payload) {
  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        issuer: 'defiendete-mx',
        audience: 'defiendete-mx-users'
      }
    );
    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
}

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing access and refresh tokens
 */
export function generateTokens(user) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken
  };
}

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'defiendete-mx',
      audience: 'defiendete-mx-users'
    });

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    } else {
      throw error;
    }
  }
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'defiendete-mx',
      audience: 'defiendete-mx-users'
    });

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      throw error;
    }
  }
}

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
export function getTokenExpiration(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
export function isTokenExpired(token) {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) return true;
    return expiration < new Date();
  } catch (error) {
    return true;
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiration,
  isTokenExpired
};
