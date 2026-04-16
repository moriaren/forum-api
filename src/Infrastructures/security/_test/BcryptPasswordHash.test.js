import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcrypt';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import BcryptPasswordHash from '../BcryptPasswordHash.js';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = vi.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10);
    });
  });

  describe('compare function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(
        bcryptPasswordHash.compare('plain_password', 'wrong_hash')
      ).rejects.toThrow(AuthenticationError);
    });

    it('should not throw AuthenticationError if password match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      await expect(
        bcryptPasswordHash.compare(plainPassword, encryptedPassword)
      ).resolves.not.toThrow(AuthenticationError);
    });
  });
});