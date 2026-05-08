import { describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import JwtTokenManager from '../JwtTokenManager.js';
import config from '../../../Commons/config.js';

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      const accessKey = config.auth.accessTokenKey || process.env.ACCESS_TOKEN_KEY || 'secret';
      expect(mockJwtToken.sign).toBeCalledWith(payload, accessKey, { expiresIn: '1h' });
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      const refreshKey = config.auth.refreshTokenKey || process.env.REFRESH_TOKEN_KEY || 'refresh';
      expect(mockJwtToken.sign).toBeCalledWith(payload, refreshKey, { expiresIn: '7d' });
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
    });
  });

  it('should throw InvariantError when access token invalid', async () => {
  // Arrange
    const jwtTokenManager = new JwtTokenManager(jwt);

    // Action & Assert
    await expect(jwtTokenManager.decodePayload('invalid_token'))
      .rejects
      .toThrow(InvariantError);
  });

  it('should use fallback secret keys when config and env are unavailable', async () => {
  // Arrange
    const originalAccessKey = config.auth.accessTokenKey;
    const originalRefreshKey = config.auth.refreshTokenKey;

    config.auth.accessTokenKey = '';
    config.auth.refreshTokenKey = '';

    delete process.env.ACCESS_TOKEN_KEY;
    delete process.env.REFRESH_TOKEN_KEY;

    const mockJwtToken = {
      sign: vi.fn().mockReturnValue('mock_token'),
      verify: vi.fn().mockReturnValue({ username: 'dicoding' }),
    };

    const jwtTokenManager = new JwtTokenManager(mockJwtToken);

    // Act
    jwtTokenManager.generateAccessToken({ username: 'dicoding' });
    jwtTokenManager.generateRefreshToken({ username: 'dicoding' });

    // Assert
    expect(mockJwtToken.sign).toHaveBeenCalledWith(
      { username: 'dicoding' },
      'secret',
      { expiresIn: '1h' }
    );

    expect(mockJwtToken.sign).toHaveBeenCalledWith(
      { username: 'dicoding' },
      'refresh',
      { expiresIn: '7d' }
    );

    // cleanup
    config.auth.accessTokenKey = originalAccessKey;
    config.auth.refreshTokenKey = originalRefreshKey;
  });
});