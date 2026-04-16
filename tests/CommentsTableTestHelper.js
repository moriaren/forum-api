import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {
  async addComment({
    id = `comment-${Date.now()}`,
    content = 'comment',
    threadId = 'thread-123',
    owner = 'user-123',
    date = new Date().toISOString(),
    // eslint-disable-next-line camelcase
    is_delete = false,
  } = {}) {
    await pool.query({
      text: `
        INSERT INTO comments(id, content, thread_id, owner, date, is_delete)
        VALUES($1, $2, $3, $4, $5, $6)
      `,
      // eslint-disable-next-line camelcase
      values: [id, content, threadId, owner, date, is_delete],
    });
  },

  async findCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    });

    return result.rows;
  },

  async softDeleteComment(id) {
    await pool.query({
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    });
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments;');
  },
};

export default CommentsTableTestHelper;