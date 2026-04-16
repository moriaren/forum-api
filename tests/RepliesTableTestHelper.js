import pool from '../src/Infrastructures/database/postgres/pool.js';

const RepliesTableTestHelper = {
  async addReply({
    id = `reply-${Date.now()}`,
    content = 'a reply',
    commentId = 'comment-123',
    owner = 'user-123',
    date = new Date().toISOString(),
    // eslint-disable-next-line camelcase
    is_delete = false,
  } = {}) {
    await pool.query({
      text: `
        INSERT INTO replies(id, content, comment_id, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      // eslint-disable-next-line camelcase
      values: [id, content, commentId, owner, date, is_delete],
    });
  },

  async findReplyById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    });

    return result.rows;
  },

  async softDeleteReply(id) {
    await pool.query({
      text: `
        UPDATE replies
        SET is_delete = TRUE
        WHERE id = $1
      `,
      values: [id],
    });
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies;');
  },

  async cleanByCommentId(commentId) {
    await pool.query({
      text: 'DELETE FROM replies WHERE comment_id = $1',
      values: [commentId],
    });
  },
};

export default RepliesTableTestHelper;