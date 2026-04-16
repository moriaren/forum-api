import InvariantError from '../../Commons/exceptions/InvariantError.js';

class UserRepositoryPostgres {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO users(id, username, password, fullname)
        VALUES($1, $2, $3, $4)
        RETURNING id, username, fullname
      `,
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows[0];
  }
}

export default UserRepositoryPostgres;