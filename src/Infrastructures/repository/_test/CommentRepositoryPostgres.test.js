import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';

import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';

describe('CommentRepositoryPostgres', () => {
  let repo;

  beforeAll(() => {
    repo = new CommentRepositoryPostgres(pool);
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const setup = async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-1',
      username: 'user1',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-1',
      title: 'thread',
      body: 'body',
      owner: 'user-1',
    });
  };

  it('should add comment correctly', async () => {
    // Arrange
    await setup();

    // Act
    const result = await repo.addComment({
      content: 'comment',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    // Assert (return value)
    expect(result.id).toBeDefined();
    expect(result.content).toBe('comment');
    expect(result.owner).toBe('user-1');

    // Assert (database verification)
    const comments = await CommentsTableTestHelper.findCommentById(result.id);

    expect(comments.length).toBe(1);
    expect(comments[0].id).toBe(result.id);
    expect(comments[0].content).toBe('comment');
    expect(comments[0].owner).toBe('user-1');
    expect(comments[0].thread_id).toBe('thread-1');
    expect(comments[0].is_delete).toBe(false);
  });

  it('should soft delete comment', async () => {
    await setup();

    await CommentsTableTestHelper.addComment({
      id: 'comment-1',
      content: 'comment',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    await repo.deleteComment('comment-1');

    const comments = await CommentsTableTestHelper.findCommentById('comment-1');

    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].is_delete).toBe(true);
  });

  it('should verify comment exists correctly', async () => {
    await setup();

    await CommentsTableTestHelper.addComment({
      id: 'comment-1',
      content: 'comment',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    await expect(repo.verifyCommentExists('comment-1'))
      .resolves.not.toThrowError();

    await expect(repo.verifyCommentExists('comment-x'))
      .rejects.toThrowError('COMMENT.NOT_FOUND');
  });

  it('should get comment owner correctly', async () => {
    await setup();

    await CommentsTableTestHelper.addComment({
      id: 'comment-1',
      content: 'comment',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    const owner = await repo.getCommentOwner('comment-1');

    expect(owner).toBe('user-1');

    await expect(repo.getCommentOwner('comment-x'))
      .rejects.toThrowError('COMMENT.NOT_FOUND');
  });

  it('should get comments by thread id correctly', async () => {
    await setup();

    await CommentsTableTestHelper.addComment({
      id: 'comment-1',
      content: 'comment 1',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-2',
      content: 'comment 2',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    await repo.deleteComment('comment-2');

    const comments = await repo.getCommentsByThreadId('thread-1');

    expect(comments.length).toBe(2);

    expect(comments[0]).toHaveProperty('id', 'comment-1');
    expect(comments[0]).toHaveProperty('is_delete', false);

    expect(comments[1]).toHaveProperty('id', 'comment-2');
    expect(comments[1]).toHaveProperty('is_delete', true);
  });

  it('should return empty array when no comments found', async () => {
    const threadId = 'thread-empty';

    await UsersTableTestHelper.addUser({
      id: 'user-1',
      username: 'user1',
    });

    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread',
      body: 'body',
      owner: 'user-1',
    });

    const comments = await repo.getCommentsByThreadId(threadId);

    expect(comments).toEqual([]);
  });
});