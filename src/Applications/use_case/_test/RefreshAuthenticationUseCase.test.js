import { describe, it, expect, vi } from 'vitest';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';

import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';

import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase.js';

describe('RefreshAuthenticationUseCase', () => {
  it('should throw InvariantError when payload not contain refreshToken', async () => {
    // Arrange
    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: {},
      tokenManager: {},
    });

    // Act & Assert
    await expect(useCase.execute({}))
      .rejects.toThrow(InvariantError);
  });

  it('should throw InvariantError when refreshToken not string', async () => {
    // Arrange
    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: {},
      tokenManager: {},
    });

    // Act & Assert
    await expect(useCase.execute({ refreshToken: 123 }))
      .rejects.toThrow(InvariantError);
  });

  it('should orchestrating refresh authentication correctly', async () => {
    // Arrange
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockTokenManager = new AuthenticationTokenManager();

    const refreshToken = 'refresh_token';

    mockAuthenticationRepository.verifyToken = vi.fn()
      .mockResolvedValue();

    mockTokenManager.verifyRefreshToken = vi.fn()
      .mockResolvedValue({
        id: 'user-123',
        username: 'dicoding',
      });

    mockTokenManager.generateAccessToken = vi.fn()
      .mockReturnValue('new_access_token');

    const useCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      tokenManager: mockTokenManager,
    });

    // Act
    const accessToken = await useCase.execute({ refreshToken });

    // Assert
    expect(mockAuthenticationRepository.verifyToken)
      .toHaveBeenCalledWith(refreshToken);

    expect(mockTokenManager.verifyRefreshToken)
      .toHaveBeenCalledWith(refreshToken);

    expect(mockTokenManager.generateAccessToken)
      .toHaveBeenCalledWith({
        id: 'user-123',
        username: 'dicoding',
      });

    expect(accessToken).toBe('new_access_token');
  });
});