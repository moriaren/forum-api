import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import pool from '../../database/postgres/pool.js';
import UserCommentLikeRepositoryPostgres from '../UserCommentLikeRepositoryPostgres.js';

import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';

describe('UserCommentLikeRepositoryPostgres', () => {
  let repository;

  beforeAll(() => {
    repository = new UserCommentLikeRepositoryPostgres(pool);
  });

  afterEach(async () => {
    await pool.query('DELETE FROM user_comment_likes');
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const setupData = async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-1',
      username: 'john',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-1',
      owner: 'user-1',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-1',
      threadId: 'thread-1',
      owner: 'user-1',
    });
  };

  it('should return false when like not exist', async () => {
    await setupData();

    const result = await repository.verifyLike('user-1', 'comment-1');

    expect(result).toBe(false);
  });

  it('should return true when like exists', async () => {
    await setupData();

    await repository.addLike('user-1', 'comment-1');

    const result = await repository.verifyLike('user-1', 'comment-1');

    expect(result).toBe(true);
  });

  it('should add like correctly', async () => {
    await setupData();

    await repository.addLike('user-1', 'comment-1');

    const result = await pool.query({
      text: 'SELECT * FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: ['user-1', 'comment-1'],
    });

    expect(result.rowCount).toBe(1);
  });

  it('should delete like correctly', async () => {
    await setupData();

    await repository.addLike('user-1', 'comment-1');

    await repository.deleteLike('user-1', 'comment-1');

    const result = await pool.query({
      text: 'SELECT * FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: ['user-1', 'comment-1'],
    });

    expect(result.rowCount).toBe(0);
  });
});