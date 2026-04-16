import { nanoid } from 'nanoid';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator = nanoid) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({ content, commentId, owner }) {
    const id = `reply-${this._idGenerator(16)}`;
    const date = new Date().toISOString();

    const { rows } = await this._pool.query({
      text: `
        INSERT INTO replies (id, content, comment_id, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING id, content, owner
      `,
      values: [id, content, commentId, owner, date],
    });

    return rows[0];
  }

  async verifyReplyExists(replyId) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT 1 FROM replies WHERE id = $1',
      values: [replyId],
    });

    if (!rowCount) {
      throw new NotFoundError('REPLY.NOT_FOUND');
    }
  }

  async getReplyById(replyId) {
    const { rows, rowCount } = await this._pool.query({
      text: 'SELECT id, owner FROM replies WHERE id = $1',
      values: [replyId],
    });

    if (!rowCount) {
      throw new NotFoundError('REPLY.NOT_FOUND');
    }

    return rows[0];
  }

  async deleteReply(replyId) {
    await this._pool.query({
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    });
  }

  async getRepliesByCommentIds(commentIds) {
    if (!commentIds?.length) return [];

    const { rows } = await this._pool.query({
      text: `
        SELECT
          r.id,
          r.content,
          r.date,
          r.is_delete,
          r.comment_id,
          u.username
        FROM replies r
        JOIN users u ON u.id = r.owner
        WHERE r.comment_id = ANY($1)
        ORDER BY r.date ASC
      `,
      values: [commentIds],
    });

    return rows;
  }
}

export default ReplyRepositoryPostgres;