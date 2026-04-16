import { describe, it, beforeAll, afterAll, afterEach, expect } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';

describe('POST /threads', () => {
  let server;
  let accessToken;
  let user;

  // ARRANGE
  beforeAll(async () => {
    server = createServer();

    user = await UsersTableTestHelper.addUser();

    const loginRes = await request(server)
      .post('/authentications')
      .send({
        username: user.username,
        password: 'secret',
      });

    expect(loginRes.status).toBe(201);

    accessToken = loginRes.body.data.accessToken;
  });

  // CLEANUP PER TEST
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  // CLEANUP GLOBAL
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  // TEST CASES
  it('should respond 201 and persisted thread', async () => {
    // ACT
    const response = await request(server)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Thread',
        body: 'Ini body thread',
      });

    // ASSERT
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');

    const addedThread = response.body.data.addedThread;

    expect(addedThread).toHaveProperty('id');
    expect(addedThread.title).toBe('Test Thread');
    expect(addedThread.owner).toBe(user.id);

    const threadFromDb = await ThreadsTableTestHelper.findThreadById(addedThread.id);

    expect(threadFromDb).toBeDefined();
    expect(threadFromDb.title).toBe('Test Thread');
    expect(threadFromDb.owner).toBe(user.id);
  });

  it('should respond 400 when payload missing properties', async () => {
    // ACT
    const response = await request(server)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'title only' });

    // ASSERT
    expect(response.status).toBe(400);
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBeDefined();
  });

  it('should respond 400 when payload invalid data type', async () => {
    // ACT
    const response = await request(server)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'thread',
        body: true,
      });

    // ASSERT
    expect(response.status).toBe(400);
    expect(response.body.status).toBe('fail');
  });

  it('should respond 401 when access token is missing', async () => {
    // ACT
    const response = await request(server)
      .post('/threads')
      .send({
        title: 'thread',
        body: 'body',
      });

    // ASSERT
    expect(response.status).toBe(401);
    expect(response.body.status).toBe('fail');
  });
});