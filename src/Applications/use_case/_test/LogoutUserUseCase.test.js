import { describe, it, expect, vi } from 'vitest';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';

import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import LogoutUserUseCase from '../LogoutUserUseCase.js';

describe('LogoutUserUseCase', () => {
  it('should throw InvariantError when payload not contain refreshToken', async () => {
    // Arrange
    const useCase = new LogoutUserUseCase({
      authenticationRepository: {},
    });

    // Act & Assert
    await expect(useCase.execute({}))
      .rejects.toThrow(InvariantError);
  });

  it('should throw InvariantError when refreshToken not string', async () => {
    // Arrange
    const useCase = new LogoutUserUseCase({
      authenticationRepository: {},
    });

    // Act & Assert
    await expect(useCase.execute({ refreshToken: 123 }))
      .rejects.toThrow(InvariantError);
  });

  it('should orchestrating delete authentication correctly', async () => {
    // Arrange
    const mockAuthenticationRepository = new AuthenticationRepository();

    const refreshToken = 'refresh_token';

    mockAuthenticationRepository.verifyToken = vi.fn()
      .mockResolvedValue();

    mockAuthenticationRepository.deleteToken = vi.fn()
      .mockResolvedValue();

    const useCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await useCase.execute({ refreshToken });

    // Assert
    expect(mockAuthenticationRepository.verifyToken)
      .toHaveBeenCalledWith(refreshToken);

    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(refreshToken);
  });
});