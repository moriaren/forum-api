import bcrypt from 'bcrypt';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';
import PasswordHash from '../../Applications/security/PasswordHash.js';

class BcryptPasswordHash extends PasswordHash {
  constructor(bcryptLibrary = bcrypt) {
    super();
    this._bcrypt = bcryptLibrary;
  }

  async hash(password) {
    return this._bcrypt.hash(password, 10);
  }

  async compare(password, hashedPassword) {
    const match = await this._bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('kredensial tidak valid');
    }
  }
}

export default BcryptPasswordHash;