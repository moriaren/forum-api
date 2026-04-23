import { nanoid } from 'nanoid';

class UserCommentLikeRepositoryPostgres {
  constructor(pool, idGenerator = nanoid) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyLike(userId, commentId) {
    const query = {
      text: `
        SELECT 1 
        FROM user_comment_likes 
        WHERE user_id = $1 AND comment_id = $2
      `,
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async addLike(userId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO user_comment_likes (id, user_id, comment_id)
        VALUES ($1, $2, $3)
      `,
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: `
        DELETE FROM user_comment_likes 
        WHERE user_id = $1 AND comment_id = $2
      `,
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }
}

export default UserCommentLikeRepositoryPostgres;