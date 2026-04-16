import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';

describe('DELETE /threads/:threadId/comments/:commentId', () => {
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
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'test',
      body: 'test',
      owner: user1.id,
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'test',
      threadId: 'thread-123',
      owner: user1.id,
    });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should delete comment', async () => {
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');

    const rows = await CommentsTableTestHelper.findCommentById('comment-123');

    expect(rows[0].is_delete).toBe(true);
  });

  it('should return 403 if not owner', async () => {
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123')
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(403);

    const rows = await CommentsTableTestHelper.findCommentById('comment-123');

    expect(rows[0].is_delete).toBe(false);
  });

  it('should return 401 when token is missing', async () => {
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-123');

    expect(response.status).toBe(401);
  });

  it('should return 404 when comment not found', async () => {
    const response = await request(server)
      .delete('/threads/thread-123/comments/comment-x')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});