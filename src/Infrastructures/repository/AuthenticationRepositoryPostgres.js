import InvariantError from '../../Commons/exceptions/InvariantError.js';

class AuthenticationRepositoryPostgres {
  constructor(pool) {
    this._pool = pool;
  }

  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async checkAvailabilityToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('AUTHENTICATION.TOKEN_NOT_FOUND');
    }
  }

  async verifyToken(token) {
    return this.checkAvailabilityToken(token);
  }

  async deleteToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

export default AuthenticationRepositoryPostgres;