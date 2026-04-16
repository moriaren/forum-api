import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres.js';

describe('AuthenticationRepositoryPostgres', () => {
  let authenticationRepository;

  beforeAll(() => {
    authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const token = 'token';

      // Act
      await authenticationRepository.addToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      // Arrange
      const token = 'token';

      // Act & Assert
      await expect(authenticationRepository.checkAvailabilityToken(token))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if token available', async () => {
      // Arrange
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Act & Assert
      await expect(authenticationRepository.checkAvailabilityToken(token))
        .resolves.not.toThrow();
    });
  });

  describe('verifyToken function', () => {
    it('should not throw error when token valid', async () => {
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      await expect(authenticationRepository.verifyToken(token))
        .resolves.not.toThrow();
    });

    it('should throw error when token invalid', async () => {
      await expect(authenticationRepository.verifyToken('invalid'))
        .rejects.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      // Arrange
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Act
      await authenticationRepository.deleteToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});