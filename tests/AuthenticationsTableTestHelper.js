/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    await pool.query({
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token],
    });
  },

  async findToken(token) {
    const result = await pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    });

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM authentications;');
  },
};

export default AuthenticationsTableTestHelper;