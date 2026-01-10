import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  isTokenExpired
} from '../../../app/lib/auth/jwt';

describe('JWT Utilities', () => {
  const mockUser = {
    userId: '123456789',
    email: 'test@example.com',
    role: 'USER'
  };

  describe('generateAccessToken', () => {
    test('should generate a valid access token', () => {
      const token = generateAccessToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should include user data in token', () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(mockUser.userId);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
      expect(decoded.type).toBe('access');
    });
  });

  describe('generateRefreshToken', () => {
    test('should generate a valid refresh token', () => {
      const token = generateRefreshToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    test('should include user data in token', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(mockUser.userId);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.type).toBe('refresh');
    });
  });

  describe('generateTokens', () => {
    test('should generate both access and refresh tokens', () => {
      const user = {
        _id: '123456789',
        email: 'test@example.com',
        role: 'USER'
      };
      
      const tokens = generateTokens(user);
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    test('should verify valid access token', () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockUser.userId);
    });

    test('should throw error for invalid token', () => {
      expect(() => {
        verifyAccessToken('invalid-token');
      }).toThrow();
    });

    test('should throw error for refresh token used as access token', () => {
      const refreshToken = generateRefreshToken(mockUser);
      expect(() => {
        verifyAccessToken(refreshToken);
      }).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    test('should verify valid refresh token', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyRefreshToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockUser.userId);
    });

    test('should throw error for invalid token', () => {
      expect(() => {
        verifyRefreshToken('invalid-token');
      }).toThrow();
    });

    test('should throw error for access token used as refresh token', () => {
      const accessToken = generateAccessToken(mockUser);
      expect(() => {
        verifyRefreshToken(accessToken);
      }).toThrow();
    });
  });

  describe('isTokenExpired', () => {
    test('should return false for valid token', () => {
      const token = generateAccessToken(mockUser);
      expect(isTokenExpired(token)).toBe(false);
    });

    test('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
    });
  });
});
