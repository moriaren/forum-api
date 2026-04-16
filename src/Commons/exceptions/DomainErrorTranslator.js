import InvariantError from './InvariantError.js';
import AuthenticationError from './AuthenticationError.js';
import NotFoundError from './NotFoundError.js';
import AuthorizationError from './AuthorizationError.js';

const DomainErrorTranslator = {
  translate(error) {
    if (!(error instanceof Error)) {
      return error;
    }

    const mappedError =
      DomainErrorTranslator._directories[error.message];

    return mappedError ? mappedError() : error;
  },
};

DomainErrorTranslator._directories = {
  // REGISTER
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': () =>
    new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),

  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),

  'REGISTER_USER.USERNAME_LIMIT_CHAR': () =>
    new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),

  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': () =>
    new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  // LOGIN
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': () =>
    new AuthenticationError('harus mengirimkan username dan password'),

  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new AuthenticationError('username dan password harus string'),

  'USER_LOGIN.USER_NOT_FOUND': () =>
    new InvariantError('kredensial yang Anda berikan salah'),

  'USER_LOGIN.INVALID_CREDENTIALS': () =>
    new AuthenticationError('kredensial yang Anda berikan salah'),

  'password salah': () =>
    new AuthenticationError('kredensial yang Anda berikan salah'),

  // REFRESH TOKEN
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': () =>
    new InvariantError('harus mengirimkan token refresh'),

  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('refresh token harus string'),

  'REFRESH_AUTHENTICATION_USE_CASE.INVALID_REFRESH_TOKEN': () =>
    new InvariantError('refresh token tidak valid'),

  // LOGOUT
  'AUTHENTICATION.TOKEN_NOT_FOUND': () =>
    new InvariantError('refresh token tidak ditemukan di database'),

  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': () =>
    new InvariantError('harus mengirimkan token refresh'),

  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('refresh token harus string'),

  'DELETE_AUTHENTICATION_USE_CASE.INVALID_REFRESH_TOKEN': () =>
    new InvariantError('refresh token tidak valid'),

  // THREAD
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': () =>
    new InvariantError('tidak dapat membuat thread karena properti tidak lengkap'),

  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('tidak dapat membuat thread karena tipe data tidak sesuai'),

  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': () =>
    new InvariantError('gagal memproses thread'),

  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('gagal memproses thread'),

  'THREAD.NOT_FOUND': () =>
    new NotFoundError('thread tidak ditemukan'),

  // COMMENT
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': () =>
    new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'),
  'NEW_COMMENT.EMPTY_CONTENT': () =>
    new InvariantError('tidak dapat membuat komentar baru karena konten kosong'),
  'NEW_COMMENT.CONTENT_LIMIT_CHAR': () =>
    new InvariantError('tidak dapat membuat komentar baru karena karakter konten melebihi batas limit'),
  'COMMENT.NOT_FOUND': () =>
    new NotFoundError('komentar tidak ditemukan'),

  // REPLY
  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': () =>
    new InvariantError('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'),
  'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': () =>
    new InvariantError('tidak dapat membuat balasan baru karena tipe data tidak sesuai'),
  'NEW_REPLY.EMPTY_CONTENT': () =>
    new InvariantError('tidak dapat membuat balasan baru karena konten kosong'),

  // AUTHORIZATION
  'AUTHORIZATION_ERROR': () =>
    new AuthorizationError('anda tidak memiliki akses'),
  'REPLY.NOT_OWNER': () =>
    new AuthorizationError('anda tidak berhak mengakses resource ini'),
  'REPLY.NOT_FOUND': () =>
    new NotFoundError('balasan tidak ditemukan'),
};

export default DomainErrorTranslator;