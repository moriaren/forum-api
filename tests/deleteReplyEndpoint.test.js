import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import RepliesTableTestHelper from './RepliesTableTestHelper.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';

describe('DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
  let server;
  let accessToken;
  let otherToken;
  let user1;
  let user2;

  beforeAll(async () => {
    server = createServer();

    user1 = await UsersTableTestHelper.addUser();
    user2 = await UsersTableTestHelper.addUser();

    const [login1, login2] = await Promise.all([
      request(server).post('/authentications').send({
        username: user1.username,
        password: 'secret',
      }),
      request(server).post('/authentications').send({
        username: user2.username,
        password: 'secret',
      }),
    ]);

    accessToken = login1.body.data.accessToken;
    otherToken = login2.body.data.accessToken;
  });

  beforeEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();

    // setup thread
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'thread',
      body: 'body',
      owner: user1.id,
    });

    // setup comment
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'comment',
      threadId: 'thread-123',
      owner: user1.id,
    });

    // setup reply
    await RepliesTableTestHelper.addReply({
      id: 'reply-123',
      content: 'reply',
      commentId: 'comment-123',
      owner: user1.id,
    });
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should delete reply (soft delete)', async () => {
    // ACT
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
      .set('Authorization', `Bearer ${accessToken}`);

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');

    const replies = await RepliesTableTestHelper.findReplyById('reply-123');

    expect(replies).toHaveLength(1);
    expect(replies[0].is_delete).toBe(true);
  });

  it('should return 403 when user is not owner', async () => {
    // ACT
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
      .set('Authorization', `Bearer ${otherToken}`);

    // ASSERT
    expect(response.status).toBe(403);
    expect(response.body.status).toBe('fail');
  });

  it('should return 401 when token is missing', async () => {
    // ACT
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123/replies/reply-123');

    // ASSERT
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('fail');
  });

  it('should return 404 when reply not found', async () => {
    // ACT
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123/replies/reply-xxx')
      .set('Authorization', `Bearer ${accessToken}`);

    // ASSERT
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('fail');
  });
});