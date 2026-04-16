import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadsTableTestHelper = {
  async addThread({
    id = `thread-${Date.now()}`,
    title = 'title',
    body = 'body',
    owner = 'user-123',
  } = {}) {
    await pool.query({
      text: `
        INSERT INTO threads (id, title, body, owner)
        VALUES ($1, $2, $3, $4)
      `,
      values: [id, title, body, owner],
    });
  },

  async findThreadById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    });

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads;');
  },
};

export default ThreadsTableTestHelper;