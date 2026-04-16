import { nanoid } from 'nanoid';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator = nanoid) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator(16)}`;
    const date = new Date().toISOString();

    const { rows } = await this._pool.query({
      text: `
        INSERT INTO threads (id, title, body, owner, date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, owner
      `,
      values: [id, title, body, owner, date],
    });

    return rows[0];
  }

  async verifyThreadExists(threadId) {
    const { rowCount } = await this._pool.query({
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [threadId],
    });

    if (!rowCount) {
      throw new NotFoundError('THREAD.NOT_FOUND');
    }
  }

  async getThreadById(threadId) {
    const { rows, rowCount } = await this._pool.query({
      text: `
        SELECT 
          t.id,
          t.title,
          t.body,
          t.date,
          u.username
        FROM threads t
        LEFT JOIN users u ON u.id = t.owner
        WHERE t.id = $1
      `,
      values: [threadId],
    });

    if (!rowCount) {
      throw new NotFoundError('THREAD.NOT_FOUND');
    }

    return rows[0];
  }
}

export default ThreadRepositoryPostgres;