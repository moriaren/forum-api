import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import RepliesTableTestHelper from './RepliesTableTestHelper.js';

describe('GET /threads/:threadId (with replies)', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should return thread detail with nested replies and handle deleted reply correctly', async () => {
    const server = createServer();

    await UsersTableTestHelper.addUser({
      id: 'user-1',
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

    await RepliesTableTestHelper.addReply({
      id: 'reply-1',
      commentId: 'comment-1',
      owner: 'user-1',
    });

    await RepliesTableTestHelper.softDeleteReply('reply-1');

    const response = await request(server).get('/threads/thread-1');

    expect(response.status).toBe(200);

    const { thread } = response.body.data;

    // eslint-disable-next-line arrow-parens
    const comment = thread.comments.find(c => c.id === 'comment-1');

    expect(comment.replies).toHaveLength(1);

    expect(comment.replies[0].content)
      .toBe('**balasan telah dihapus**');
  });
});