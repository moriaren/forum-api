import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import request from 'supertest';

import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';

import createServer from '../createServer.js';
import JwtTokenManager from '../../security/JwtTokenManager.js';

describe('HTTP server', () => {
  let app;

  // ARRANGE
  beforeAll(() => {
    app = createServer();
  });

  // CLEANUP
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    const response = await request(app).get('/unregisteredRoute');
    expect(response.status).toEqual(404);
  });

  // USERS
  describe('when POST /users', () => {
    const validPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    it('should response 201 and persisted user', async () => {
      const response = await request(app)
        .post('/users')
        .send(validPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when payload missing property', async () => {
      const response = await request(app)
        .post('/users')
        .send({ fullname: 'Dicoding Indonesia', password: 'secret' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when payload wrong data type', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: 'dicoding',
          password: 'secret',
          fullname: ['Dicoding Indonesia'],
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when username > 50 char', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when username contain restricted char', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: 'dicoding indonesia',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when username unavailable', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const response = await request(app)
        .post('/users')
        .send(validPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });

  // LOGIN
  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });

      expect(response.status).toEqual(201);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const response = await request(app)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 if password wrong', async () => {
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'wrong_password',
        });

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });
  });

  // REFRESH TOKEN
  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginRes = await request(app)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken: loginRes.body.data.refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 if refresh token not registered', async () => {
      const jwtTokenManager = new JwtTokenManager();

      const refreshToken = await jwtTokenManager.createRefreshToken({
        id: 'user-1',
        username: 'dicoding',
      });

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });

  // LOGOUT
  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await request(app)
        .delete('/authentications')
        .send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered', async () => {
      const response = await request(app)
        .delete('/authentications')
        .send({ refreshToken: 'invalid' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });
});