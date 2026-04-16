import bcrypt from 'bcrypt';
import pool from '../src/Infrastructures/database/postgres/pool.js';

const UsersTableTestHelper = {
  async addUser({
    id = `user-${Date.now()}`,
    username = `user-${Date.now()}`,
    password = 'secret',
    fullname = 'user fullname',
  } = {}) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query({
      text: `
        INSERT INTO users (id, username, password, fullname)
        VALUES ($1, $2, $3, $4)
      `,
      values: [id, username, hashedPassword, fullname],
    });

    return { id, username, password, fullname };
  },

  async findUsersById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    });

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users;');
  },
};

export default UsersTableTestHelper;