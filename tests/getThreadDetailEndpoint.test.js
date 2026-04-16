import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';

describe('GET /threads/:threadId', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should return thread detail correctly', async () => {
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

    await CommentsTableTestHelper.addComment({
      id: 'comment-2',
      content: 'secret',
      threadId: 'thread-1',
      owner: 'user-1',
    });

    await CommentsTableTestHelper.softDeleteComment('comment-2');

    const response = await request(server).get('/threads/thread-1');

    expect(response.status).toBe(200);

    const { thread } = response.body.data;

    // eslint-disable-next-line arrow-parens
    const deleted = thread.comments.find(c => c.id === 'comment-2');

    expect(deleted.content)
      .toBe('**komentar telah dihapus**');
  });
});