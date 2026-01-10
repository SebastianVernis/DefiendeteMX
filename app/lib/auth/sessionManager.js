import { serialize, parse } from 'cookie';

/**
 * Session Management Utilities
 * Handles cookie-based session management for authentication
 */

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
};

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

/**
 * Set access token cookie
 * @param {Object} res - Response object
 * @param {string} token - Access token
 * @param {number} maxAge - Max age in seconds (default: 15 minutes)
 */
export function setAccessTokenCookie(res, token, maxAge = 15 * 60) {
  const cookie = serialize(ACCESS_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge
  });

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Set refresh token cookie
 * @param {Object} res - Response object
 * @param {string} token - Refresh token
 * @param {number} maxAge - Max age in seconds (default: 7 days)
 */
export function setRefreshTokenCookie(res, token, maxAge = 7 * 24 * 60 * 60) {
  const cookie = serialize(REFRESH_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge
  });

  // Get existing cookies
  const existingCookies = res.getHeader('Set-Cookie') || [];
  const cookiesArray = Array.isArray(existingCookies) ? existingCookies : [existingCookies];
  
  // Add new cookie
  cookiesArray.push(cookie);
  
  res.setHeader('Set-Cookie', cookiesArray);
}

/**
 * Set both access and refresh token cookies
 * @param {Object} res - Response object
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 */
export function setAuthCookies(res, accessToken, refreshToken) {
  const cookies = [
    serialize(ACCESS_TOKEN_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 // 15 minutes
    }),
    serialize(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
  ];

  res.setHeader('Set-Cookie', cookies);
}

/**
 * Clear access token cookie
 * @param {Object} res - Response object
 */
export function clearAccessTokenCookie(res) {
  const cookie = serialize(ACCESS_TOKEN_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0
  });

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Clear refresh token cookie
 * @param {Object} res - Response object
 */
export function clearRefreshTokenCookie(res) {
  const cookie = serialize(REFRESH_TOKEN_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0
  });

  // Get existing cookies
  const existingCookies = res.getHeader('Set-Cookie') || [];
  const cookiesArray = Array.isArray(existingCookies) ? existingCookies : [existingCookies];
  
  // Add clear cookie
  cookiesArray.push(cookie);
  
  res.setHeader('Set-Cookie', cookiesArray);
}

/**
 * Clear all authentication cookies
 * @param {Object} res - Response object
 */
export function clearAuthCookies(res) {
  const cookies = [
    serialize(ACCESS_TOKEN_COOKIE, '', {
      ...COOKIE_OPTIONS,
      maxAge: 0
    }),
    serialize(REFRESH_TOKEN_COOKIE, '', {
      ...COOKIE_OPTIONS,
      maxAge: 0
    })
  ];

  res.setHeader('Set-Cookie', cookies);
}

/**
 * Get access token from request cookies
 * @param {Object} req - Request object
 * @returns {string|null} Access token or null
 */
export function getAccessTokenFromCookies(req) {
  try {
    const cookies = parse(req.headers.cookie || '');
    return cookies[ACCESS_TOKEN_COOKIE] || null;
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return null;
  }
}

/**
 * Get refresh token from request cookies
 * @param {Object} req - Request object
 * @returns {string|null} Refresh token or null
 */
export function getRefreshTokenFromCookies(req) {
  try {
    const cookies = parse(req.headers.cookie || '');
    return cookies[REFRESH_TOKEN_COOKIE] || null;
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return null;
  }
}

/**
 * Get both tokens from request cookies
 * @param {Object} req - Request object
 * @returns {Object} Object with accessToken and refreshToken
 */
export function getAuthTokensFromCookies(req) {
  try {
    const cookies = parse(req.headers.cookie || '');
    return {
      accessToken: cookies[ACCESS_TOKEN_COOKIE] || null,
      refreshToken: cookies[REFRESH_TOKEN_COOKIE] || null
    };
  } catch (error) {
    console.error('Error parsing cookies:', error);
    return {
      accessToken: null,
      refreshToken: null
    };
  }
}

/**
 * Get token from Authorization header
 * @param {Object} req - Request object
 * @returns {string|null} Token or null
 */
export function getTokenFromHeader(req) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
      return null;
    }

    // Check for Bearer token
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return authHeader;
  } catch (error) {
    console.error('Error getting token from header:', error);
    return null;
  }
}

/**
 * Get access token from request (cookies or header)
 * @param {Object} req - Request object
 * @returns {string|null} Access token or null
 */
export function getAccessToken(req) {
  // Try to get from cookies first
  let token = getAccessTokenFromCookies(req);
  
  // If not in cookies, try Authorization header
  if (!token) {
    token = getTokenFromHeader(req);
  }

  return token;
}

/**
 * Create session data object
 * @param {Object} user - User object
 * @returns {Object} Session data
 */
export function createSessionData(user) {
  return {
    userId: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isVerified: user.isVerified,
    isPremium: user.isPremium
  };
}

/**
 * Validate session data
 * @param {Object} sessionData - Session data to validate
 * @returns {boolean} True if valid
 */
export function validateSessionData(sessionData) {
  if (!sessionData) return false;
  
  return !!(
    sessionData.userId &&
    sessionData.email &&
    sessionData.role
  );
}

export default {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setAuthCookies,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  getAuthTokensFromCookies,
  getTokenFromHeader,
  getAccessToken,
  createSessionData,
  validateSessionData
};
