import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';

import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';

describe('ReplyRepositoryPostgres', () => {
  let repo;

  const userId = 'user-1';
  const threadId = 'thread-1';
  const commentId = 'comment-1';

  beforeAll(() => {
    repo = new ReplyRepositoryPostgres(pool);
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const setup = async () => {
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'user1',
    });

    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread',
      body: 'body',
      owner: userId,
    });

    await CommentsTableTestHelper.addComment({
      id: commentId,
      content: 'comment',
      threadId,
      owner: userId,
    });
  };

  it('should add reply correctly', async () => {
    await setup();

    // Act
    const result = await repo.addReply({
      content: 'reply content',
      commentId,
      owner: userId,
    });

    // Assert (return value)
    expect(result.id).toBeDefined();
    expect(result.content).toBe('reply content');
    expect(result.owner).toBe(userId);

    // Assert (database)
    const replies = await RepliesTableTestHelper.findReplyById(result.id);
    expect(replies).toHaveLength(1);
    expect(replies[0].content).toBe('reply content');
    expect(replies[0].owner).toBe(userId);
    expect(replies[0].comment_id).toBe(commentId);
  });

  it('should verify reply exists correctly', async () => {
    await setup();

    const replyId = 'reply-1';

    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      commentId,
      owner: userId,
    });

    await expect(repo.verifyReplyExists(replyId))
      .resolves.not.toThrowError();

    await expect(repo.verifyReplyExists('reply-x'))
      .rejects.toThrowError('REPLY.NOT_FOUND');
  });

  it('should get reply by id and return correct owner', async () => {
    await setup();

    const replyId = 'reply-1';

    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      commentId,
      owner: userId,
    });

    const reply = await repo.getReplyById(replyId);

    expect(reply.id).toBe(replyId);
    expect(reply.owner).toBe(userId);
  });

  it('should throw NotFoundError when reply not found', async () => {
    await expect(repo.getReplyById('reply-not-found'))
      .rejects.toThrowError('REPLY.NOT_FOUND');
  });

  it('should soft delete reply correctly', async () => {
    await setup();

    const replyId = 'reply-1';

    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      commentId,
      owner: userId,
    });

    await repo.deleteReply(replyId);

    const replies = await RepliesTableTestHelper.findReplyById(replyId);

    expect(replies.length).toBeGreaterThan(0);
    expect(replies[0].is_delete).toBe(true);
  });

  it('should get replies by commentIds', async () => {
    await setup();

    const replyId = 'reply-1';

    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      commentId,
      owner: userId,
    });

    const replies = await repo.getRepliesByCommentIds([commentId]);

    expect(replies.length).toBe(1);
    expect(replies[0].id).toBe(replyId);
    expect(replies[0].username).toBeDefined();
  });
});