import { nanoid } from 'nanoid';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator = nanoid) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ content, threadId, owner }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const { rows } = await this._pool.query({
      text: `
        INSERT INTO comments (id, content, thread_id, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING id, content, owner
      `,
      values: [id, content, threadId, owner, date],
    });

    return rows[0];
  }

  async getCommentById(commentId) {
    const { rows, rowCount } = await this._pool.query({
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (!rowCount) {
      throw new NotFoundError('COMMENT.NOT_FOUND');
    }

    return rows[0];
  }

  async deleteComment(commentId) {
    await this._pool.query({
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    });
  }

  async verifyCommentExists(commentId) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT 1 FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (!rowCount) {
      throw new NotFoundError('COMMENT.NOT_FOUND');
    }
  }

  async getCommentOwner(commentId) {
    const { rows, rowCount } = await this._pool.query({
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (!rowCount) {
      throw new NotFoundError('COMMENT.NOT_FOUND');
    }

    return rows[0].owner;
  }

  async getCommentsByThreadId(threadId) {
    const { rows } = await this._pool.query({
      text: `
        SELECT 
          c.id,
          c.content,
          c.date,
          c.is_delete,
          c.owner,
          u.username
        FROM comments c
        JOIN users u ON u.id = c.owner
        WHERE c.thread_id = $1
        ORDER BY c.date ASC
      `,
      values: [threadId],
    });

    return rows;
  }
}

export default CommentRepositoryPostgres;