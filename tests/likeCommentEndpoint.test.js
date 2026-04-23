import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';

describe('PUT /threads/:threadId/comments/:commentId/likes', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should like a comment', async () => {
    const server = createServer();

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

    const loginRes = await request(server)
      .post('/authentications')
      .send({
        username: 'john',
        password: 'secret',
      });

    const accessToken = loginRes.body.data.accessToken;

    const response = await request(server)
      .put('/threads/thread-1/comments/comment-1/likes')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('should unlike a comment when already liked', async () => {
    const server = createServer();

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

    const loginRes = await request(server)
      .post('/authentications')
      .send({
        username: 'john',
        password: 'secret',
      });

    const token = loginRes.body.data.accessToken;

    await request(server)
      .put('/threads/thread-1/comments/comment-1/likes')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(server)
      .put('/threads/thread-1/comments/comment-1/likes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('should return 401 when missing authentication', async () => {
    const server = createServer();

    const response = await request(server)
      .put('/threads/thread-1/comments/comment-1/likes');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('fail');
  });
});