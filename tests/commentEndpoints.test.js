import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';

describe('POST /threads/:threadId/comments', () => {
  let server;
  let accessToken;
  let user;

  beforeAll(async () => {
    server = createServer();

    user = await UsersTableTestHelper.addUser();

    const login = await request(server)
      .post('/authentications')
      .send({
        username: user.username,
        password: 'secret',
      });

    expect(login.status).toBe(201);

    accessToken = login.body.data.accessToken;

    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'thread',
      body: 'body',
      owner: user.id,
    });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should add comment correctly', async () => {
    const response = await request(server)
      .post('/threads/thread-123/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'comment test' });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.addedComment).toHaveProperty('id');
  });
});