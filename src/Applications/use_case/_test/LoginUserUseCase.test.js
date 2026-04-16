import { describe, it, expect, vi } from 'vitest';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';

import UserRepository from '../../../Domains/users/UserRepository.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import PasswordHash from '../../security/PasswordHash.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';

import LoginUserUseCase from '../LoginUserUseCase.js';

describe('LoginUserUseCase', () => {
  it('should throw AuthenticationError when payload not contain needed property', async () => {
    // Arrange
    const useCase = new LoginUserUseCase({
      userRepository: {},
      authenticationRepository: {},
      passwordHash: {},
      tokenManager: {},
    });

    // Act & Assert
    await expect(useCase.execute({ username: 'dicoding' }))
      .rejects.toThrow(AuthenticationError);

    await expect(useCase.execute({ password: 'secret' }))
      .rejects.toThrow(AuthenticationError);
  });

  it('should throw AuthenticationError when payload not meet data type specification', async () => {
    // Arrange
    const useCase = new LoginUserUseCase({
      userRepository: {},
      authenticationRepository: {},
      passwordHash: {},
      tokenManager: {},
    });

    // Act & Assert
    await expect(useCase.execute({ username: 123, password: 'secret' }))
      .rejects.toThrow(AuthenticationError);

    await expect(useCase.execute({ username: 'dicoding', password: 123 }))
      .rejects.toThrow(AuthenticationError);
  });

  it('should throw InvariantError when user not found', async () => {
    // Arrange
    const mockUserRepository = new UserRepository();
    mockUserRepository.getPasswordByUsername = vi.fn()
      .mockResolvedValue(null);

    const useCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: {},
      passwordHash: {},
      tokenManager: {},
    });

    // Act & Assert
    await expect(useCase.execute({
      username: 'dicoding',
      password: 'secret',
    })).rejects.toThrow(InvariantError);
  });

  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockPasswordHash = new PasswordHash();
    const mockTokenManager = new AuthenticationTokenManager();

    mockUserRepository.getPasswordByUsername = vi.fn()
      .mockResolvedValue({
        id: 'user-123',
        password: 'encrypted_password',
      });

    mockPasswordHash.compare = vi.fn()
      .mockResolvedValue(true);

    mockTokenManager.generateAccessToken = vi.fn()
      .mockReturnValue('access_token');

    mockTokenManager.generateRefreshToken = vi.fn()
      .mockReturnValue('refresh_token');

    mockAuthenticationRepository.addToken = vi.fn()
      .mockResolvedValue();

    const useCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      passwordHash: mockPasswordHash,
      tokenManager: mockTokenManager,
    });

    // Act
    const result = await useCase.execute(payload);

    // Assert
    expect(mockUserRepository.getPasswordByUsername)
      .toHaveBeenCalledWith(payload.username);

    expect(mockPasswordHash.compare)
      .toHaveBeenCalledWith(payload.password, 'encrypted_password');

    expect(mockTokenManager.generateAccessToken)
      .toHaveBeenCalledWith({
        id: 'user-123',
        username: payload.username,
      });

    expect(mockTokenManager.generateRefreshToken)
      .toHaveBeenCalledWith({
        id: 'user-123',
        username: payload.username,
      });

    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith('refresh_token');

    expect(result).toEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
  });
});