import pool from '../src/Infrastructures/database/postgres/pool.js';

const UserCommentLikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    userId = 'user-1',
    commentId = 'comment-1',
  }) {
    await pool.query({
      text: `
        INSERT INTO user_comment_likes (id, user_id, comment_id)
        VALUES ($1, $2, $3)
      `,
      values: [id, userId, commentId],
    });
  },

  async findLike(userId, commentId) {
    const result = await pool.query({
      text: `
        SELECT * FROM user_comment_likes
        WHERE user_id = $1 AND comment_id = $2
      `,
      values: [userId, commentId],
    });

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM user_comment_likes');
  },
};

export default UserCommentLikesTableTestHelper;