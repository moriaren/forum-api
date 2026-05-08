import { describe, it, expect, vi } from 'vitest';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate thread detail with nested replies correctly', async () => {
    const threadId = 'thread-1';

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
      getThreadById: vi.fn().mockResolvedValue({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date().toISOString(),
        username: 'john',
        comments: [
          {
            id: 'comment-1',
            content: 'comment 1',
            date: new Date().toISOString(),
            username: 'john',
            // eslint-disable-next-line camelcase
            is_delete: false,
            likeCount: 1,
          },
          {
            id: 'comment-2',
            content: 'comment 2',
            date: new Date().toISOString(),
            username: 'doe',
            // eslint-disable-next-line camelcase
            is_delete: true,
            likeCount: 0,
          },
        ],
      }),
    };

    const mockReplyRepo = {
      getRepliesByCommentIds: vi.fn().mockResolvedValue([
        {
          id: 'reply-1',
          content: 'reply 1',
          date: new Date().toISOString(),
          username: 'jane',
          // eslint-disable-next-line camelcase
          is_delete: false,
          commentId: 'comment-1',
        },
        {
          id: 'reply-2',
          content: 'reply 2',
          date: new Date().toISOString(),
          username: 'jack',
          // eslint-disable-next-line camelcase
          is_delete: true,
          commentId: 'comment-1',
        },
      ]),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      replyRepository: mockReplyRepo,
    });

    const result = await useCase.execute(threadId);
    const normalized = JSON.parse(JSON.stringify(result));

    expect(mockThreadRepo.verifyThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepo.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepo.getRepliesByCommentIds)
      .toHaveBeenCalledWith(['comment-1', 'comment-2']);

    expect(normalized).toStrictEqual({
      id: threadId,
      title: 'title',
      body: 'body',
      date: normalized.date,
      username: 'john',
      comments: [
        {
          id: 'comment-1',
          username: 'john',
          date: normalized.comments[0].date,
          content: 'comment 1',
          likeCount: 1,
          replies: [
            {
              id: 'reply-1',
              username: 'jane',
              date: normalized.comments[0].replies[0].date,
              content: 'reply 1',
            },
            {
              id: 'reply-2',
              username: 'jack',
              date: normalized.comments[0].replies[1].date,
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'doe',
          date: normalized.comments[1].date,
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    });
  });

  it('should handle thread without comments', async () => {
    const threadId = 'thread-1';

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
      getThreadById: vi.fn().mockResolvedValue({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date(),
        username: 'john',
        comments: undefined,
      }),
    };

    const mockReplyRepo = {
      getRepliesByCommentIds: vi.fn(),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      replyRepository: mockReplyRepo,
    });

    const result = await useCase.execute(threadId);

    expect(mockReplyRepo.getRepliesByCommentIds).not.toHaveBeenCalled();
    expect(result.comments).toEqual([]);
  });

  it('should map reply using comment_id field', async () => {
    const threadId = 'thread-1';

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
      getThreadById: vi.fn().mockResolvedValue({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date(),
        username: 'john',
        comments: [
          {
            id: 'comment-1',
            content: 'c1',
            date: new Date(),
          },
        ],
      }),
    };

    const mockReplyRepo = {
      getRepliesByCommentIds: vi.fn().mockResolvedValue([
        {
          id: 'reply-1',
          content: 'reply',
          date: new Date(),
          username: 'jane',
          // eslint-disable-next-line camelcase
          comment_id: 'comment-1',
        },
      ]),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      replyRepository: mockReplyRepo,
    });

    const result = await useCase.execute(threadId);

    expect(result.comments[0].replies.length).toBe(1);
  });

  it('should apply default values correctly', async () => {
    const threadId = 'thread-1';

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
      getThreadById: vi.fn().mockResolvedValue({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date(),
        username: 'john',
        comments: [
          {
            id: 'comment-1',
            content: 'c1',
            date: new Date(),
          },
        ],
      }),
    };

    const mockReplyRepo = {
      getRepliesByCommentIds: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      replyRepository: mockReplyRepo,
    });

    const result = await useCase.execute(threadId);

    const comment = result.comments[0];

    expect(comment.username).toBe('unknown');
    expect(comment.likeCount).toBe(0);
  });

  it('should throw error when thread not found', async () => {
    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockRejectedValue(new Error('not found')),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      replyRepository: {},
    });

    await expect(useCase.execute('thread-1')).rejects.toThrow();
  });

  it('should use current date when comment.date is not provided', async () => {
    const threadId = 'thread-1';

    const mockThreadRepo = {
      verifyThreadExists: vi.fn().mockResolvedValue(),
      getThreadById: vi.fn().mockResolvedValue({
        id: threadId,
        title: 'title',
        body: 'body',
        date: new Date(),
        username: 'john',
        comments: [
          {
            id: 'comment-1',
            content: 'comment',
          },
        ],
      }),
    };

    const mockReplyRepo = {
      getRepliesByCommentIds: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepo,
      replyRepository: mockReplyRepo,
    });

    const result = await useCase.execute(threadId);

    expect(result.comments[0].likeCount).toBe(0);
  });
});