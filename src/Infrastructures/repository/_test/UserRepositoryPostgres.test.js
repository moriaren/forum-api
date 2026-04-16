import bcrypt from 'bcrypt';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => 'x');

      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding')
      ).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => 'x');

      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding')
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await userRepositoryPostgres.addUser(registerUser);

      // Assert DB
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('dicoding');
      expect(users[0].fullname).toBe('Dicoding Indonesia');
    });

    it('should return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      expect(registeredUser).toEqual({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      });
    });
  });

  describe('getPasswordByUsername', () => {
    it('should return null when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => 'x');

      await expect(
        userRepositoryPostgres.getPasswordByUsername('dicoding')
      ).resolves.toBeNull();
    });

    it('should return id and password when user is found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => 'x');

      await UsersTableTestHelper.addUser({
        id: 'user-999',
        username: 'dicoding',
        password: 'secret_password',
      });

      const row = await userRepositoryPostgres.getPasswordByUsername('dicoding');

      expect(row.id).toBe('user-999');
      expect(await bcrypt.compare('secret_password', row.password)).toBe(true);
      expect(row.password).not.toBe('secret_password');
    });
  });
});