import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import UserCommentLikesTableTestHelper from './UserCommentLikesTableTestHelper.js';

describe('GET /threads/:threadId (with likes)', () => {
  afterEach(async () => {
    await UserCommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should return thread detail with correct likeCount', async () => {
    const server = createServer();

    await UsersTableTestHelper.addUser({
      id: 'user-1',
      username: 'john',
    });

    await UsersTableTestHelper.addUser({
      id: 'user-2',
      username: 'jane',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-1',
      owner: 'user-1',
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-1',
      content: 'comment 1',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    await UserCommentLikesTableTestHelper.addLike({
      id: 'like-1',
      userId: 'user-1',
      commentId: 'comment-1',
    });

    await UserCommentLikesTableTestHelper.addLike({
      id: 'like-2',
      userId: 'user-2',
      commentId: 'comment-1',
    });

    const response = await request(server).get('/threads/thread-1');

    expect(response.status).toBe(200);

    const { thread } = response.body.data;

    const comment = thread.comments.find((c) => c.id === 'comment-1');

    expect(comment.likeCount).toBe(2);
  });

  it('should return likeCount 0 when no likes', async () => {
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
      content: 'comment 1',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    const response = await request(server).get('/threads/thread-1');

    expect(response.status).toBe(200);

    const { thread } = response.body.data;

    const comment = thread.comments.find((c) => c.id === 'comment-1');

    expect(comment.likeCount).toBe(0);
  });
});