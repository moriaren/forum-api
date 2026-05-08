import DomainErrorTranslator from '../DomainErrorTranslator.js';
import InvariantError from '../InvariantError.js';
import AuthenticationError from '../AuthenticationError.js';
import NotFoundError from '../NotFoundError.js';
import AuthorizationError from '../AuthorizationError.js';

describe('DomainErrorTranslator', () => {
  describe('translate function', () => {

    it('should return value as is when input is not instance of Error', () => {
      const result = DomainErrorTranslator.translate('not an error');
      expect(result).toBe('not an error');
    });

    it('should return original error when error message is not mapped', () => {
      const error = new Error('UNKNOWN_ERROR');
      const result = DomainErrorTranslator.translate(error);

      expect(result).toBe(error);
    });

    it('should translate REGISTER_USER errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
      )).toStrictEqual(
        new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
      );

      expect(DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )).toStrictEqual(
        new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai')
      );

      expect(DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
      )).toStrictEqual(
        new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit')
      );

      expect(DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
      )).toStrictEqual(
        new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang')
      );
    });

    it('should translate LOGIN errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')
      )).toStrictEqual(
        new AuthenticationError('harus mengirimkan username dan password')
      );

      expect(DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )).toStrictEqual(
        new AuthenticationError('username dan password harus string')
      );

      expect(DomainErrorTranslator.translate(
        new Error('USER_LOGIN.USER_NOT_FOUND')
      )).toStrictEqual(
        new InvariantError('kredensial yang Anda berikan salah')
      );

      expect(DomainErrorTranslator.translate(
        new Error('USER_LOGIN.INVALID_CREDENTIALS')
      )).toStrictEqual(
        new AuthenticationError('kredensial yang Anda berikan salah')
      );

      expect(DomainErrorTranslator.translate(
        new Error('password salah')
      )).toStrictEqual(
        new AuthenticationError('kredensial yang Anda berikan salah')
      );
    });

    it('should translate REFRESH TOKEN errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )).toStrictEqual(
        new InvariantError('harus mengirimkan token refresh')
      );

      expect(DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
      )).toStrictEqual(
        new InvariantError('refresh token harus string')
      );

      expect(DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.INVALID_REFRESH_TOKEN')
      )).toStrictEqual(
        new InvariantError('refresh token tidak valid')
      );
    });

    it('should translate LOGOUT errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('AUTHENTICATION.TOKEN_NOT_FOUND')
      )).toStrictEqual(
        new InvariantError('refresh token tidak ditemukan di database')
      );

      expect(DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )).toStrictEqual(
        new InvariantError('harus mengirimkan token refresh')
      );

      expect(DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
      )).toStrictEqual(
        new InvariantError('refresh token harus string')
      );

      expect(DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.INVALID_REFRESH_TOKEN')
      )).toStrictEqual(
        new InvariantError('refresh token tidak valid')
      );
    });

    it('should translate THREAD errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('THREAD.NOT_FOUND')
      )).toStrictEqual(
        new NotFoundError('thread tidak ditemukan')
      );
    });

    it('should translate COMMENT errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('NEW_COMMENT.EMPTY_CONTENT')
      )).toStrictEqual(
        new InvariantError('tidak dapat membuat komentar baru karena konten kosong')
      );

      expect(DomainErrorTranslator.translate(
        new Error('COMMENT.NOT_FOUND')
      )).toStrictEqual(
        new NotFoundError('komentar tidak ditemukan')
      );
    });

    it('should translate REPLY errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('REPLY.NOT_FOUND')
      )).toStrictEqual(
        new NotFoundError('balasan tidak ditemukan')
      );
    });

    it('should translate AUTHORIZATION errors correctly', () => {
      expect(DomainErrorTranslator.translate(
        new Error('AUTHORIZATION_ERROR')
      )).toStrictEqual(
        new AuthorizationError('anda tidak memiliki akses')
      );

      expect(DomainErrorTranslator.translate(
        new Error('REPLY.NOT_OWNER')
      )).toStrictEqual(
        new AuthorizationError('anda tidak berhak mengakses resource ini')
      );
    });

    it('should cover all error mappings in directory', () => {
      const directories = DomainErrorTranslator._directories;

      Object.keys(directories).forEach((key) => {
        const error = new Error(key);
        const result = DomainErrorTranslator.translate(error);

        expect(result).toBeInstanceOf(Error);
      });
    });

  });
});