import { describe, it, expect, vi } from 'vitest';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';
import AddUserUseCase from '../AddUserUseCase.js';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-999',
      username: payload.username,
      fullname: payload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = vi.fn().mockResolvedValue();
    mockPasswordHash.hash = vi.fn().mockResolvedValue('encrypted_password');
    mockUserRepository.addUser = vi.fn().mockResolvedValue(mockRegisteredUser);

    const useCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // act
    const result = await useCase.execute(payload);

    // assert
    expect(mockUserRepository.verifyAvailableUsername)
      .toHaveBeenCalledWith(payload.username);

    expect(mockPasswordHash.hash)
      .toHaveBeenCalledWith(payload.password);

    expect(mockUserRepository.addUser)
      .toHaveBeenCalledWith(new RegisterUser({
        username: payload.username,
        password: 'encrypted_password',
        fullname: payload.fullname,
      }));

    expect(result).toBeInstanceOf(RegisteredUser);
    expect(result).toMatchObject({
      id: 'user-999',
      username: payload.username,
      fullname: payload.fullname,
    });
  });
});