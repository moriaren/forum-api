import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import RepliesTableTestHelper from './RepliesTableTestHelper.js';

describe('REPLIES ENDPOINTS', () => {
  let server;
  let accessToken;
  let user;

  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    server = createServer();

    user = await UsersTableTestHelper.addUser();

    const login = await request(server)
      .post('/authentications')
      .send({
        username: user.username,
        password: 'secret',
      });

    accessToken = login.body.data.accessToken;

    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread',
      body: 'body',
      owner: user.id,
    });

    await CommentsTableTestHelper.addComment({
      id: commentId,
      content: 'comment',
      threadId,
      owner: user.id,
    });
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  // ADD REPLY
  describe('POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should add reply correctly', async () => {
      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'reply test' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');

      const addedReply = response.body.data.addedReply;

      expect(addedReply).toHaveProperty('id');
      expect(addedReply.content).toBe('reply test');
      expect(addedReply.owner).toBe(user.id);

      const replies = await RepliesTableTestHelper.findReplyById(addedReply.id);
      expect(replies).toHaveLength(1);
      expect(replies[0].content).toBe('reply test');
    });

    it('should return 401 when no access token', async () => {
      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .send({ content: 'reply test' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 404 when comment not found', async () => {
      const response = await request(server)
        .post(`/threads/${threadId}/comments/comment-x/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'reply test' });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when payload missing content', async () => {
      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  // DELETE REPLY
  describe('DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should delete reply correctly (soft delete)', async () => {
      const replyId = 'reply-123';

      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: 'reply',
        commentId,
        owner: user.id,
      });

      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      const replies = await RepliesTableTestHelper.findReplyById(replyId);
      expect(replies[0].is_delete).toBe(true);
    });

    it('should return 403 when not owner', async () => {
      const replyId = 'reply-999';

      // user lain
      const otherUser = await UsersTableTestHelper.addUser({
        id: 'user-999',
        username: 'other',
      });

      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: 'reply',
        commentId,
        owner: otherUser.id,
      });

      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('fail');
    });

    it('should return 404 when reply not found', async () => {
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/reply-x`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when no access token', async () => {
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/reply-x`);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });
});